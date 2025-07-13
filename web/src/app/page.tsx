export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎮</span>
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
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-6">
              無料でSteamゲームを友達と楽しもう！
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Steam Remote Play
            </span>
            <br />
            <span className="text-white">を簡単に</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            DiscordでSteamゲームのストリーミングプレイに招待できるBOT。<br />
            1人がゲームを持っていれば、参加者は無料でゲームに参加可能！
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
              今すぐ始める
            </button>
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter" 
              target="_blank"
              className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              GitHub で見る
            </a>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-20 px-6 bg-slate-800/50">
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
              <ul className="space-y-4 text-slate-300">
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
            </div>

            {/* Solution */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">✅</span>
                <h3 className="text-2xl font-bold text-green-300">Remote Play Inviterなら</h3>
              </div>
              <ul className="space-y-4 text-slate-300">
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">今すぐ始めよう！</h2>
          <p className="text-xl text-slate-300 mb-12">
            Steam Remote Play Inviterで友達との楽しいゲーム体験を始めましょう
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎮</span>
            </div>
            <span className="text-xl font-bold text-white">Steam Remoteplay Inviter</span>
          </div>
          <p className="text-slate-400 mb-6">
            Steamの公式機能であるRemote Play Togetherを、より便利に使えるようにするツールです
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://store.steampowered.com/remoteplay_together?l=japanese" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              Steam Remote Play Together
            </a>
            <a href="https://github.com/Kamesuta/remoteplay-inviter" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
