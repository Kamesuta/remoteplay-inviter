# Steam Remoteplay Inviter

## 椰要

このプロジェクトは、Steam Remoteplay Inviter という無料のSteam Remoteplay TogetherにDiscordで招待するためのツールです。

### ツールの概要
- DiscordでSteamゲームのストリーミングプレイに招待できるBOT
- Steam Remote Play TogetherにDiscordの友達を招待
Steamの公式機能であるRemote Play Togetherを使えば、1人がゲームを持っていれば、参加者は無料でゲームに参加可能！
  - このツールはDiscordを使って招待リンクの発行＆共有を楽にしてくれる便利BOTです。
- ❌️公式のSteamクライアントだと...
  - しかし、公式Steamの機能だと、ホストする人が手動で1人に1つずつ招待リンクを発行してコピペをする手間があって大変・・・
- ✅️Remote Play Inviterなら
  - Discord上で招待パネルを一度作れば、参加者が参加ボタンを押したときに自動で招待リンクが発行されるため、ホストする人は何もしなくてもOK！

### リポジトリ
以下でツールを開発しています。
https://github.com/Kamesuta/remoteplay-inviter
https://github.com/Kamesuta/remoteplay-inviter-bot

## デザインの方向性

- https://store.steampowered.com/remoteplay_together?l=japanese
  - このページを参考にする
- Steamのブランドカラーを使用する
- Discordっぽいかわいさも取り入れる

## 技術

Tailwind CSS を使う

## 追加

### メタ情報・SEO
- タイトル: Remote Play Inviter - DiscordでSteamゲームのストリーミングプレイに招待できるBOT
- OGP画像: https://steaminviter.app/assets/branding/og-image.png
- ドメイン: https://steaminviter.app
- Twitter/OGPメタタグ設定済み

### ナビゲーション
- 機能紹介 (#about)
- ABOUT (#setup) 
- DOWNLOAD (#download)

### 実際のリンク・URL
- BOT招待URL: https://discord.com/oauth2/authorize?client_id=1252429340780527714
- Windows版ダウンロード: https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe
- macOS版ダウンロード: https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter-macos-intel
- Linux版ダウンロード: https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.AppImage
- Steam Remote Play Together公式: https://store.steampowered.com/remoteplay#together
- Steam Remote Play Together対応ゲーム: https://store.steampowered.com/remoteplay_together

### 動画・メディア
- without_inviter.mp4: 公式Steamクライアントでの招待手順
- with_inviter.mp4: Remote Play Inviterでの招待手順  
- howto_invite_join.mp4: 招待方法＆参加方法のデモ動画

### 導入手順

- ①BOTを招待する
下記ボタンから、Steam Remote Play Inviterボットをインストールします。
「マイアプリに追加」を押せば、どこのサーバーでもRemote Playe Inviterが使えます。
- ②クライアントをダウンロードする
下記ボタンから、Remote Play Inviterクライアントをダウンロードし、起動します。
その後、`/steam inviute client_id:～～～` をコピーします。
- ③BOTとクライアントを連携する
Discordのチャットで、`/steam invite client_id:～～～` を入力して、BOTとクライアントを連携します。

### 招待方法
①ホストをする人: 招待パネルを出す
`/steam invite` と入力すると、招待パネルが送信されます。
DMで個別に送るほか、グループDMやサーバーのチャンネルなどで大規模に募集をかけることも可能です。

②参加者: 参加ボタンを押す
「今すぐゲームに参加する！」ボタンを押すと、自動で自分専用の招待リンクが発行されます。

③参加者: Steamを開く
招待リンクが発行されたら「クリックしてゲームに参加！」を押して、Steam Remote Play Togetherのページを開きましょう。
その後はSteamの指示に従って、ゲームを楽しむだけ！ (PCの場合はSteamクライアント、スマホの人はアプリをインストールしましょう)

### ダウンロード/BOT招待
ホストをする人はBOTを招待し、クライアントをダウンロードしてください。

### Q&A
Q. このツールは無料ですか？
A. はい、無料です。ただし、ホストをする人はSteamでのゲーム購入が必要です。参加者は完全無料でゲームが遊べます。

Q. どのOSで使えますか？
A. クライアントはWindows/Mac/Linuxに対応しています。
ただ、クライアントのダウンロードが必要になるのはホストをする人のみです。参加者はクライアントは不要で、招待リンクを受け取るだけでゲームに参加できます。

Q. 招待パネルはいつまで有効ですか？
A. クライアントを閉じるまで有効です。クライアントを再起動すると、招待パネルは無効となるので、再度招待パネルを出してください。

Q. どのゲームで使えますか？
A. Steam Remote Play Togetherに対応しているゲームなら、どのゲームでも使えます。

Q. どのDiscordサーバーでも使えますか？
A. はい、どのサーバーでも使えます。ただし「外部のアプリを使用」が許可されていないDiscordサーバーでは使えません。

Q. このツールは公式のSteam機能ですか？
A. いいえ。
「Steam Remote Play Together」はSteamの公式機能ですが、このツール「Remote Play Inviter」は公式の機能ではありません。
このツールは「Remote Play Together」の招待リンクの発行を自動化する非公式の便利ツールです。

Q. 招待リンクが無効です。と言われます。
A. 招待リンクは使い捨てで、一度使うと無効になります。切断されたりした場合はもう一度「招待リンクを発行」ボタンを押してリンクを再生成してください。

Q. このツールのソースコードは公開されていますか？
A. はい、GitHubで公開されています。自由に改変して使っていただいて構いません。プルリクエストも歓迎です。
BOTのソースコードは https://github.com/Kamesuta/remoteplay-inviter-bot 、このWebサイトのソースコードは https://github.com/Kamesuta/remoteplay-inviter-web です。

Q. コントローラーを持っていないのですが、遊べますか？
A. x360ce というソフトウェアを使えば、キーボードでゲームパッドのエミュレーションが可能です。詳しい手順は https://kamesuta.notion.site/Xbox-f94467e5ad7642c68b8a4bffc5e4a6fa をご覧ください。

### フッター情報
- 作者: Kamesuta
- SNS・リンク:
  - GitHub: https://github.com/Kamesuta
  - X (Twitter): https://x.com/Kmesuta  
  - Discord: https://discord.gg/kamepower
- ソースコードリンク:
  - クライアント: https://github.com/Kamesuta/remoteplay-inviter
  - BOT: https://github.com/Kamesuta/remoteplay-inviter-bot

