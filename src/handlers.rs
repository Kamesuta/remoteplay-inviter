use anyhow::{Context, Result};
use futures::SinkExt;
use indoc::printdoc;
use std::{collections::HashMap, sync::Arc, time::Duration};
use steam_stuff::{GameID, GameUID};
use tokio::{
    sync::{mpsc::Receiver, Mutex},
    task,
    time::interval,
};
use tokio_tungstenite::tungstenite::protocol::Message;
use tokio_tungstenite::tungstenite::Error as WsError;

use crate::models::{ClientCmd, ClientMessage, ErrorStatus, ServerCmd, ServerMessage};
use crate::SteamStuff;

/**
 * サーバーメッセージを処理する
 * @return 終了するかどうか (true: 終了する)
 */
pub async fn handle_server_message(
    msg: ServerMessage,
    steam: &Arc<Mutex<SteamStuff>>,
    invite_rx: &mut Receiver<(u64, String)>,
    guest_map: &Arc<Mutex<HashMap<u64, String>>>,
    write: &mut (impl SinkExt<Message, Error = WsError> + Unpin),
) -> Result<bool> {
    // コマンドタイプによって分岐
    let res = match msg.cmd {
        ServerCmd::Message { data } => {
            // メッセージをインデント
            let message = data
                .lines()
                .map(|line| format!("  {}", line))
                .collect::<Vec<String>>()
                .join("\n");
            // Welcomeメッセージを表示
            printdoc! {"

            {message}

            "};
            return Ok(false);
        }
        ServerCmd::GameId => {
            let game_id = steam.lock().await.get_running_game_id();

            if game_id.is_valid_app() {
                // ログを出力
                let claimer = msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
                println!(
                    "-> Create Panel       : claimer={claimer}, game_id={0}",
                    game_id.app_id
                );

                // レスポンスデータを作成
                ClientMessage {
                    id: msg.id,
                    cmd: ClientCmd::GameId {
                        data: game_id.app_id,
                    },
                }
            } else {
                // ゲームが実行されていない場合
                // レスポンスデータを作成
                ClientMessage {
                    id: msg.id,
                    cmd: ClientCmd::Error {
                        data: ErrorStatus::InvalidApp,
                    },
                }
            }
        }
        ServerCmd::Link { game } => {
            // ゲームIDを取得
            let game_uid: GameUID = GameID::new(game, 0, 0).into();

            // 招待リンクを作成
            let recv = invite_rx.recv();
            steam.lock().await.send_invite(0, game_uid);
            let (guest_id, connect_url) = recv.await.unwrap();

            // Discordのユーザーとguest_idを紐付け
            if let Some(user) = &msg.user {
                guest_map.lock().await.insert(guest_id, user.name.clone());
            }

            // ログを出力
            let claimer = msg.user.as_ref().map_or_else(|| "?", |s| &s.name);
            println!(
                "-> Create Invite Link : claimer={claimer}, guest_id={guest_id}, game_id={game}, invite_url={connect_url}", 
            );

            // レスポンスデータを作成
            ClientMessage {
                id: msg.id,
                cmd: ClientCmd::Link { data: connect_url },
            }
        }
        ServerCmd::Exit => {
            // アプリを終了
            return Ok(true);
        }
        ServerCmd::Invalid => {
            // レスポンスデータを作成
            ClientMessage {
                id: msg.id,
                cmd: ClientCmd::Error {
                    data: ErrorStatus::InvalidCmd,
                },
            }
        }
    };

    // レスポンスデータをJSONに変換
    let res_str =
        serde_json::to_string(&res).context("Failed to serialize JSON message for the server")?;
    // レスポンスデータを送信
    write
        .send(Message::Text(res_str))
        .await
        .context("Failed to send message to the server")?;

    Ok(false)
}

// SteamStuffのコールバックを設定
pub async fn setup_steam_callbacks(
    steam: &Arc<Mutex<SteamStuff>>,
    guest_map: &Arc<Mutex<HashMap<u64, String>>>,
    invite_tx: tokio::sync::mpsc::Sender<(u64, String)>,
) {
    // コールバックを登録
    let steam = steam.lock().await;
    let guests = guest_map.clone();
    steam.set_on_remote_started(move |invitee, guest_id| {
        let guests = guests.clone();
        tokio::spawn(async move {
            let guest_map = guests.lock().await;
            let user_name = guest_map.get(&guest_id).map_or_else(|| "?", |s| &s);
            println!(
                "-> User Joined        : claimer={user_name}, guest_id={guest_id}, steam_id={invitee}",
            );
        });
    });
    let guests = guest_map.clone();
    steam.set_on_remote_stopped(move |invitee, guest_id| {
        let guests = guests.clone();
        tokio::spawn(async move {
            let guest_map = guests.lock().await;
            let user_name = guest_map.get(&guest_id).map_or_else(|| "?", |s| &s);
            println!(
                "-> User Left          : claimer={user_name}, guest_id={guest_id}, steam_id={invitee}",
            );
        });
    });
    steam.set_on_remote_invited(move |_invitee, guest_id, connect_url| {
        // 招待リンクを送信
        let invite_tx = invite_tx.clone();
        let connect_url = String::from(connect_url);
        tokio::spawn(async move {
            invite_tx.send((guest_id, connect_url)).await.unwrap();
        });
    });
}

// SteamStuff_RunCallbacksを定期的に呼び出すタスクを開始
pub fn run_steam_callbacks(steam: &Arc<Mutex<SteamStuff>>) {
    let steam_clone = steam.clone();
    task::spawn(async move {
        let mut interval = interval(Duration::from_millis(200));
        loop {
            interval.tick().await;
            steam_clone.lock().await.run_callbacks();
        }
    });
}
