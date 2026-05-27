export default function MailConnectorWebsite() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Mail Connector</h1>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-slate-700">
            Login
          </button>

          <button className="px-4 py-2 rounded-xl bg-blue-600">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-20 py-24 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6">
          Privacy First Social Connections
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Connect With New People Safely Through Email
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          Meet people around the world without exposing your personal email
          address. Mail Connector keeps your identity private while helping you
          build real connections.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold">
            Continue With Gmail
          </button>

          <button className="px-6 py-4 rounded-2xl border border-slate-700">
            Create Account
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-20 py-20 bg-slate-900/40">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="text-4xl mb-5">🔒</div>

            <h3 className="text-2xl font-bold mb-3">
              Hidden Emails
            </h3>

            <p className="text-slate-400">
              Your real email always stays protected and private.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="text-4xl mb-5">🌍</div>

            <h3 className="text-2xl font-bold mb-3">
              Meet New People
            </h3>

            <p className="text-slate-400">
              Connect globally through secure profile discovery.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="text-4xl mb-5">⚡</div>

            <h3 className="text-2xl font-bold mb-3">
              Instant Messaging
            </h3>

            <p className="text-slate-400">
              Start private conversations safely through the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-20 py-10 border-t border-slate-800 text-center text-slate-500">
        <p>© 2026 Mail Connector. All rights reserved.</p>
      </footer>
    </div>
  )
}