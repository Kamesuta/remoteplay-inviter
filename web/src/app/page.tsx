"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      src: "/assets/inviter_concept.svg",
      alt: "Remote Play Inviter コンセプト図",
      title: "簡単な招待システム"
    },
    {
      src: "/assets/inviter_concept_multiplay.svg",
      alt: "離れたお友達とローカルマルチプレイ",
      title: "マルチプレイヤー対応"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/remoteplay_inviter.png" 
                alt="Remote Play Inviter Icon" 
                width={32} 
                height={32}
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Steam Remoteplay Inviter</h1>
          </div>
          <div className="flex space-x-4">
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter" 
              target="_blank"
              className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-6">
                  無料でSteamゲームを友達と楽しもう！
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Steam Remote Play
                </span>
                <span className="text-white">を簡単に</span>
              </h1>
              <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                DiscordでSteamゲームのストリーミングプレイに招待できるBOT。<br />
                1人がゲームを持っていれば、参加者は無料でゲームに参加可能！
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
                  target="_blank"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-center"
                >
                  今すぐ始める
                </a>
                <a 
                  href="https://github.com/Kamesuta/remoteplay-inviter" 
                  target="_blank"
                  className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 transition-all"
                >
                  GitHub で見る
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-slate-600/50">
                {/* Carousel container */}
                <div className="relative overflow-hidden rounded-lg">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div key={index} className="w-full flex-shrink-0 flex items-center justify-center">
                        <Image 
                          src={slide.src}
                          alt={slide.alt}
                          width={600} 
                          height={400}
                          className="rounded-lg shadow-2xl max-w-full h-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentSlide === index 
                            ? 'bg-blue-500 scale-110' 
                            : 'bg-slate-400 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Slide title overlay */}
                  <div className="absolute bottom-6 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-medium">
                      {slides[currentSlide].title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section id="about" className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            なぜRemote Play Inviterが必要なの？
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">❌</span>
                <h3 className="text-2xl font-bold text-red-300">公式のSteamクライアントだと...</h3>
              </div>
              <ul className="space-y-4 text-slate-300 mb-6">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  ホストする人が手動で1人に1つずつ招待リンクを発行
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  コピペを繰り返す手間があって大変
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  参加者が増えると作業が煩雑に
                </li>
              </ul>
              <div className="rounded-lg overflow-hidden border border-red-500/30">
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/assets/remoteplay_inviter_og.png"
                >
                  <source src="/assets/without_inviter.mp4" type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
                <div className="p-3 bg-red-900/30">
                  <p className="text-red-300 text-sm font-medium">従来の方法：手動でのリンク発行</p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">✅</span>
                <h3 className="text-2xl font-bold text-green-300">Remote Play Inviterなら</h3>
              </div>
              <ul className="space-y-4 text-slate-300 mb-6">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  Discord上で招待パネルを一度作るだけ
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  参加者がボタンを押すと自動で招待リンクが発行
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  ホストする人は何もしなくてもOK！
                </li>
              </ul>
              <div className="rounded-lg overflow-hidden border border-green-500/30">
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/assets/remoteplay_inviter_og.png"
                >
                  <source src="/assets/with_inviter.mp4" type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
                <div className="p-3 bg-green-900/30">
                  <p className="text-green-300 text-sm font-medium">Remote Play Inviter：自動化された招待</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">主な機能</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Discord BOT</h3>
              <p className="text-slate-300">Discordを使って招待リンクの発行と共有を楽にしてくれる便利BOT</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">自動招待リンク発行</h3>
              <p className="text-slate-300">参加者がボタンを押したときに自動で招待リンクが発行される</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">完全無料</h3>
              <p className="text-slate-300">Steamの公式機能を活用。1人がゲームを持っていれば参加者は無料</p>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section id="setup" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            簡単3ステップで導入
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative h-full">
              <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/assets/invite_bot.png" alt="BOT招待画面" width={300} height={180} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">BOTを招待する</h3>
                <p className="text-slate-300 mb-4 flex-grow">「マイアプリに追加」を押して、Remote Play InviterボットをDiscordサーバーにインストール</p>
                <a 
                  href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
                  target="_blank"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                >
                  BOTを招待
                </a>
              </div>
            </div>

            <div className="relative h-full">
              <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/assets/inviter_client.png" alt="クライアント画面" width={300} height={180} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">クライアントをダウンロード</h3>
                <p className="text-slate-300 mb-4 flex-grow">Remote Play Inviterクライアントをダウンロードし、起動してclient_idをコピー</p>
                <a 
                  href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
                  target="_blank"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block text-center"
                >
                  ダウンロード
                </a>
              </div>
            </div>

            <div className="relative h-full">
              <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/assets/inviter_setup.png" alt="セットアップ画面" width={300} height={180} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">BOTとクライアントを連携</h3>
                <p className="text-slate-300 mb-4 flex-grow">Discordで `/steam invite client_id:～～～` を入力してBOTとクライアントを連携</p>
                <div className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-mono text-sm">
                  /steam invite client_id:...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            使い方
          </h2>
          <p className="text-center text-slate-300 mb-16 text-lg">
            実際の操作手順を動画でご確認ください
          </p>
          
          {/* Demo Video */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                📹 招待・参加方法デモ動画
              </h3>
              <div className="rounded-lg overflow-hidden border border-slate-600">
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/assets/remoteplay_inviter_og.png"
                >
                  <source src="/assets/howto_invite_join.mp4" type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
              </div>
              <p className="text-slate-300 text-center mt-4">
                ホストから参加まで、すべての手順を1つの動画で確認できます
              </p>
            </div>
          </div>
          
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">1</span>
                  <h3 className="text-2xl font-bold text-white">ホスト: 招待パネルを出す</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  `/steam invite` と入力すると、招待パネルが送信されます。<br />
                  DMで個別に送るほか、グループDMやサーバーのチャンネルなどで大規模に募集をかけることも可能です。
                </p>
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 font-mono text-green-400">
                  /steam invite
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <Image 
                  src="/assets/invite_panel.png" 
                  alt="Discord招待パネル" 
                  width={400} 
                  height={300} 
                  className="rounded-lg border border-slate-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">2</span>
                  <h3 className="text-2xl font-bold text-white">参加者: 参加ボタンを押す</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  「今すぐゲームに参加する！」ボタンを押すと、自動で自分専用の招待リンクが発行されます。
                </p>
              </div>
              <div className="md:order-1 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <Image 
                  src="/assets/invite_join.png" 
                  alt="参加ボタンを押した画面" 
                  width={400} 
                  height={250} 
                  className="rounded-lg border border-slate-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">3</span>
                  <h3 className="text-2xl font-bold text-white">参加者: Steamを開く</h3>
                </div>
                <p className="text-slate-300">
                  招待リンクが発行されたら「クリックしてゲームに参加！」を押して、Steam Remote Play Togetherのページを開きます。<br />
                  その後はSteamの指示に従って、ゲームを楽しむだけ！
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <Image 
                  src="/assets/invite_steam.png" 
                  alt="Steam Remote Play Together画面" 
                  width={400} 
                  height={300} 
                  className="rounded-lg border border-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">よくある質問</h2>
          
          <div className="space-y-6">
            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. このツールは無料ですか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                はい、無料です。ただし、ホストをする人はSteamでのゲーム購入が必要です。参加者は完全無料でゲームが遊べます。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. どのOSで使えますか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                クライアントはWindows/Mac/Linuxに対応しています。ただ、クライアントのダウンロードが必要になるのはホストをする人のみです。参加者はクライアントは不要で、招待リンクを受け取るだけでゲームに参加できます。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. 招待パネルはいつまで有効ですか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                クライアントを閉じるまで有効です。クライアントを再起動すると、招待パネルは無効となるので、再度招待パネルを出してください。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. このツールは公式のSteam機能ですか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                いいえ。「Steam Remote Play Together」はSteamの公式機能ですが、このツール「Remote Play Inviter」は公式の機能ではありません。このツールは「Remote Play Together」の招待リンクの発行を自動化する非公式の便利ツールです。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. 招待リンクが無効です。と言われます。</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                招待リンクは使い捨てで、一度使うと無効になります。切断されたりした場合はもう一度「招待リンクを発行」ボタンを押してリンクを再生成してください。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. どのゲームで使えますか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                <a href="https://store.steampowered.com/remoteplay_together" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">Steam Remote Play Togetherに対応しているゲーム</a>なら、どのゲームでも使えます。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. どのDiscordサーバーでも使えますか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                はい、どのサーバーでも使えます。ただし「外部のアプリを使用」が許可されていないDiscordサーバーでは使えません。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. このツールのソースコードは公開されていますか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                はい、<a href="https://github.com/Kamesuta/remoteplay-inviter" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">GitHub</a>で公開されています。自由に改変して使っていただいて構いません。プルリクエストも歓迎です。<br />
                BOTのソースコードは<a href="https://github.com/Kamesuta/remoteplay-inviter-bot" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">こちら</a>、このWebサイトのソースコードは<a href="https://github.com/Kamesuta/remoteplay-inviter-web" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">こちら</a>です。
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>Q. コントローラーを持っていないのですが、遊べますか？</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                x360ce というソフトウェアを使えば、キーボードでゲームパッドのエミュレーションが可能です。詳しい手順は<a href="https://kamesuta.notion.site/Xbox-f94467e5ad7642c68b8a4bffc5e4a6fa" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">こちら</a>をご覧ください。
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">今すぐ始めよう！</h2>
          <p className="text-xl text-slate-300 mb-12">
            Steam Remote Play Inviterで友達との楽しいゲーム体験を始めましょう
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter"
              target="_blank"
              className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>📱</span>
              <span>メインリポジトリ</span>
            </a>
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter-bot"
              target="_blank"
              className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>🤖</span>
              <span>BOTリポジトリ</span>
            </a>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
              target="_blank"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-center"
            >
              BOTを招待する
            </a>
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
              target="_blank"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-center"
            >
              クライアントをダウンロード
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/remoteplay_inviter.png" 
                alt="Remote Play Inviter Icon" 
                width={24} 
                height={24}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">Steam Remoteplay Inviter</span>
          </div>
          <p className="text-slate-400 mb-6">
            Steamの公式機能であるRemote Play Togetherを、より便利に使えるようにするツールです
          </p>
          <p className="text-slate-500 mb-6">
            <strong>Remote Play Inviter</strong> by Kamesuta
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="https://github.com/Kamesuta" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              GitHub
            </a>
            <a href="https://x.com/Kmesuta" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              X
            </a>
            <a href="https://discord.gg/kamepower" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              Discord
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="https://github.com/Kamesuta/remoteplay-inviter" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              ソースコード (クライアント)
            </a>
            <a href="https://github.com/Kamesuta/remoteplay-inviter-bot" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              ソースコード (BOT)
            </a>
          </div>
          <div className="flex justify-center space-x-6">
            <a href="https://store.steampowered.com/remoteplay_together?l=japanese" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              Steam Remote Play Together
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
