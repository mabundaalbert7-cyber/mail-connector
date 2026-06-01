'use client'

import { useState, useEffect } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const login = async () => {
    if (loading) return
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/setup')
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request') {
        alert('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const members = [
    { name: 'Amara', age: 26, city: 'Cape Town', looking: 'Relationship', tags: ['Travel', 'Art', 'Music'], emoji: '🌸', bg: 'from-violet-900 to-purple-950' },
    { name: 'Thabo', age: 29, city: 'Johannesburg', looking: 'Pen pal', tags: ['Hiking', 'Sports', 'Food'], emoji: '🏔️', bg: 'from-emerald-900 to-teal-950' },
    { name: 'Kagiso', age: 24, city: 'Pretoria', looking: 'Friendship', tags: ['Yoga', 'Reading', 'Coffee'], emoji: '✨', bg: 'from-rose-900 to-pink-950' },
  ]

  const steps = [
    { icon: '👤', num: '01', title: 'Create your profile', desc: 'Sign up with Google. Add your photo, bio and interests in under 2 minutes.' },
    { icon: '🔍', num: '02', title: 'Browse members', desc: 'Explore real profiles from across South Africa. Filter by city, age and interests.' },
    { icon: '✉', num: '03', title: 'Write your first letter', desc: 'Send a thoughtful message. No swipes — just genuine words that mean something.' },
  ]

  const testimonials = [
    { text: "I never thought I'd find someone through letters but here we are — 8 months together and still writing every week.", name: 'Naledi M.', city: 'Cape Town', initials: 'NM', color: 'bg-violet-600' },
    { text: "MailConnector brought back the romance of getting to know someone. No games, just real conversations.", name: 'Sipho K.', city: 'Johannesburg', initials: 'SK', color: 'bg-amber-600' },
  ]

  return (
    <div className="min-h-screen text-white" style={{ background: '#070b12', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .grad-text { background: linear-gradient(135deg, #f97316 0%, #fb923c 40%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border: 0.5px solid rgba(255,255,255,0.08); }
        .glass-warm { background: rgba(249,115,22,0.06); backdrop-filter: blur(12px); border: 0.5px solid rgba(249,115,22,0.15); }
        .card-hover { transition: transform 0.2s ease, border-color 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); border-color: rgba(249,115,22,0.3) !important; }
        .btn-glow { box-shadow: 0 0 32px rgba(249,115,22,0.35); transition: all 0.2s ease; }
        .btn-glow:hover { box-shadow: 0 0 48px rgba(249,115,22,0.5); transform: translateY(-1px); }
        .nav-glass { backdrop-filter: blur(20px); background: rgba(7,11,18,0.8); border-bottom: 0.5px solid rgba(255,255,255,0.06); }
        .stagger-1 { animation: fadeUp 0.6s ease 0.1s both; }
        .stagger-2 { animation: fadeUp 0.6s ease 0.2s both; }
        .stagger-3 { animation: fadeUp 0.6s ease 0.3s both; }
        .stagger-4 { animation: fadeUp 0.6s ease 0.4s both; }
        .stagger-5 { animation: fadeUp 0.6s ease 0.5s both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .member-1 { animation: fadeUp 0.6s ease 0.3s both; }
        .member-2 { animation: fadeUp 0.6s ease 0.45s both; }
        .member-3 { animation: fadeUp 0.6s ease 0.6s both; }
        .serif { font-family: 'DM Serif Display', serif; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #070b12; } ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 3px; }
      `}</style>

      {/* Sticky Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-glass' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)' }}>✉</div>
            <span className="font-semibold text-base tracking-tight">MailConnector</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['How it works', 'Browse', 'Success stories'].map(l => (
              <span key={l} className="text-sm text-slate-400 hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <button onClick={login} disabled={loading}
            className="btn-glow text-sm font-semibold px-5 py-2.5 rounded-xl text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            {loading ? 'Opening...' : 'Join free →'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f97316, transparent)', filter: 'blur(80px)' }} />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="stagger-1 inline-flex items-center gap-2.5 glass-warm px-4 py-2 rounded-full mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs text-orange-300 font-medium">48,000+ members across South Africa</span>
          </div>
          <h1 className="stagger-2 serif text-5xl md:text-7xl leading-tight mb-6">
            Meet someone through a<br />
            <span className="grad-text italic">meaningful letter</span>
          </h1>
          <p className="stagger-3 text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters.
          </p>
          <div className="stagger-4 flex items-center justify-center gap-4 mb-16">
            <button onClick={login} disabled={loading}
              className="btn-glow font-semibold px-8 py-4 rounded-2xl text-white disabled:opacity-50 text-base"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              {loading ? 'Opening Google...' : 'Start writing today'}
            </button>
            <button className="glass font-medium px-8 py-4 rounded-2xl text-slate-300 hover:text-white transition-colors text-base">
              Browse members
            </button>
          </div>
          <div className="stagger-5 flex items-center justify-center gap-12">
            {[['48K+', 'Members worldwide'], ['12K', 'Letters sent today'], ['3,200', 'Couples connected']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="grad-text text-2xl font-bold">{num}</p>
                <p className="text-slate-500 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member cards */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-8 font-medium">Members online now</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {members.map((m, i) => (
            <div key={i} className={`glass card-hover rounded-2xl overflow-hidden cursor-pointer member-${i + 1}`}>
              <div className={`h-36 bg-gradient-to-br ${m.bg} flex items-center justify-center text-5xl relative`}>
                {m.emoji}
                <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full" />
              </div>
              <div className="p-5">
                <p className="font-semibold text-base mb-0.5">{m.name}, {m.age}</p>
                <p className="text-slate-500 text-xs mb-3">📍 {m.city} · {m.looking}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '0.5px solid rgba(249,115,22,0.2)' }}>{t}</span>
                  ))}
                </div>
                <button onClick={login}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                  ✉ Send letter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 relative" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '0.5px solid rgba(255,255,255,0.05)', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-orange-400 uppercase tracking-widest font-medium mb-4">Simple process</p>
          <h2 className="serif text-4xl mb-4">How it works</h2>
          <p className="text-slate-400 mb-16">Three simple steps to find your person</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto glass-warm">
                    {s.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-orange-400 serif">{s.num}</span>
                </div>
                <h3 className="font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-orange-400 uppercase tracking-widest font-medium mb-4">Real stories</p>
          <h2 className="serif text-4xl">Success stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass card-hover rounded-2xl p-7">
              <p className="text-slate-300 text-sm leading-relaxed italic mb-6 serif">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: 'rgba(249,115,22,0.04)', borderTop: '0.5px solid rgba(249,115,22,0.1)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 50% 50%, #f97316, transparent 70%)' }} />
        </div>
        <div className="max-w-xl mx-auto relative">
          <p className="serif text-4xl md:text-5xl mb-4">Ready to write<br /><span className="grad-text italic">your story?</span></p>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">Join thousands of South Africans finding real connections through meaningful letters</p>
          <button onClick={login} disabled={loading}
            className="btn-glow font-semibold px-10 py-4 rounded-2xl text-white disabled:opacity-50 text-base"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            {loading ? 'Opening Google...' : 'Create free profile →'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-6" style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)' }}>✉</div>
          <span className="text-xs text-slate-600 font-medium">MailConnector</span>
        </div>
        <span className="text-xs text-slate-600">© 2026 MailConnector. All rights reserved.</span>
        <div className="flex gap-4">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}