import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion'

export const Route = createFileRoute('/')({ component: ComingSoon })



/* ─── particle canvas ─── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const N = 80
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(41,112,232,0.5)'
        ctx.fill()
      })
      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 130) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(41,112,232,${0.12 * (1 - d / 130)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [])
  return <canvas ref={canvasRef} id="particle-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

/* ─── feature card ─── */
const features = [
  { icon: '🗺️', title: 'Event Blueprints', desc: 'Design detailed floor plans and layouts for any type of event with precision drag-and-drop tools.' },
  { icon: '🧊', title: '3D Visualization', desc: 'Walk through your event space in immersive 3D before the first guest ever arrives.' },
  { icon: '⚡', title: 'Real-Time Collaboration', desc: 'Invite your team, vendors, and clients to co-plan events live — all from one dashboard.' },
  { icon: '📐', title: 'Smart Templates', desc: 'Kick-start your event with intelligent templates tailored for weddings, conferences, galas, and more.' },
  { icon: '🎨', title: 'Decor Simulation', desc: 'Place virtual décor, lighting, and furniture to see how everything looks before you commit.' },
  { icon: '📊', title: 'Compliance Integration', desc: 'Fire safety regulations, Capacity limits, Accessibility requirements and Venue-specific constraints with built-in AI-powered insights.' },
]

function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className="feature-card p-7"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
    >
      <div className="text-4xl mb-4">{f.icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,200,255,0.7)' }}>{f.desc}</p>
    </motion.div>
  )
}

/* ─── orbit logo ─── */
function OrbitLogo() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 440, height: 440 }}>
      {/* outer ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 420, height: 420, borderColor: 'rgba(41,112,232,0.18)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 90, 180, 270].map(deg => (
          <div key={deg} className="absolute w-3 h-3 rounded-full" style={{ background: '#2970e8', top: '50%', left: '50%', transform: `rotate(${deg}deg) translateX(208px) translateY(-50%)` }} />
        ))}
      </motion.div>
      {/* middle ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 290, height: 290, borderColor: 'rgba(41,112,232,0.25)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {[45, 135, 225, 315].map(deg => (
          <div key={deg} className="absolute w-4 h-4 rounded-full" style={{ background: '#1a5ecf', top: '50%', left: '50%', transform: `rotate(${deg}deg) translateX(143px) translateY(-50%)` }} />
        ))}
      </motion.div>
      {/* white glow behind logo */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 70%)', filter: 'blur(20px)' }} />
      {/* logo */}
      <motion.img
        src="/mainLogo.svg"
        alt="EventSpacePro Logo"
        className="relative z-10"
        style={{ width: 180, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ─── notify form ─── */
function NotifyForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="glass-strong rounded-3xl p-10 text-center max-w-xl mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Be First in Line</h2>
      <p className="mb-6 text-sm" style={{ color: 'rgba(180,200,255,0.7)' }}>
        Get early access and exclusive launch updates for EventSpacePro.
      </p>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-lg font-semibold text-white">You're on the list!</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(180,200,255,0.6)' }}>We'll reach out as soon as we launch.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="notify-input flex-1 px-5 py-3 rounded-xl text-sm"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-6 py-3 rounded-xl text-sm"
            >
              Notify Me →
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── main page ─── */
export default function ComingSoon() {
  const [showTop, setShowTop] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, -120])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3])
  const bgY = useTransform(scrollY, [0, 1500], [0, 350])

  useEffect(() => {
    const unsub = scrollY.on('change', v => setShowTop(v > 400))
    return unsub
  }, [scrollY])

  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  /* section ref for tagline */
  const tagRef = useRef(null)
  const tagInView = useInView(tagRef, { once: true })

  return (
    <div className="relative min-h-screen" style={{ background: '#050d1f' }}>
      {/* parallax background layer */}
      <motion.div
        className="fixed inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bgY,
        }}
      />
      {/* bottom fade for background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#050d1f]/50 to-[#050d1f] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#050d1f]/80 via-transparent to-transparent pointer-events-none" />

      <Particles />

      {/* ── Hero ── */}
      <section className="hero-bg grid-overlay relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center gap-8 z-10 text-center">

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(41,112,232,0.15)', border: '1px solid rgba(41,112,232,0.35)', color: '#4a8af4' }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Coming Soon
          </motion.div>

          {/* logo + orbits */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: 'spring', stiffness: 100 }}
          >
            <OrbitLogo />
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black leading-tight"
            style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
          >
            <span className="text-white">Event</span>
            <span className="shimmer-text">Space</span>
            <span style={{ color: '#2970e8' }}>Pro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="max-w-lg text-lg md:text-xl leading-relaxed"
            style={{ color: 'rgba(180,200,255,0.75)' }}
          >
            Design stunning event blueprints, walk through immersive <strong style={{ color: '#4a8af4' }}>3D spaces</strong>, and plan every detail — before a single chair is placed.
          </motion.p>



          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <motion.a
              href="#notify"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold"
            >
              Get Early Access →
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.04 }}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{ border: '1px solid rgba(41,112,232,0.35)', color: '#4a8af4' }}
            >
              Explore Features
            </motion.a>
          </motion.div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74,138,244,0.5)' }}>Scroll to explore</span>
          <motion.div
            className="w-5 h-9 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '2px solid rgba(41,112,232,0.35)' }}
          >
            <motion.div
              className="w-1.5 h-2.5 rounded-full"
              style={{ background: '#2970e8' }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── tagline strip ── */}
      <section className="py-16 relative z-10" style={{ background: 'rgba(5,13,31,0.95)' }}>
        <div className="divider mb-16" />
        <motion.div
          ref={tagRef}
          initial={{ opacity: 0 }}
          animate={tagInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-wrap justify-center gap-x-12 gap-y-6 px-8"
        >
          {['Blueprint Design', '3D Event Preview', 'Real-Time Collab', 'Guest Analytics', 'Smart Templates', 'AI Insights'].map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, x: -20 }}
              animate={tagInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: 'rgba(180,200,255,0.6)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2970e8' }} />
              {t}
            </motion.span>
          ))}
        </motion.div>
        <div className="divider mt-16" />
      </section>

      {/* ── features ── */}
      <section id="features" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#4a8af4' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What's Coming
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Everything you need to build <br />
            <span style={{ color: '#2970e8' }}>the perfect event</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </section>



      {/* ── notify ── */}
      <section id="notify" className="relative z-10 py-24 px-6">
        <NotifyForm />
      </section>

      {/* ── footer ── */}
      <footer className="relative z-10 py-10 px-6 text-center" style={{ borderTop: '1px solid rgba(41,112,232,0.12)' }}>
        <img src="/mainLogo.svg" alt="EventSpacePro" className="h-10 mx-auto mb-4 opacity-80" />
        <p className="text-xs" style={{ color: 'rgba(180,200,255,0.4)' }}>
          © {new Date().getFullYear()} EventSpacePro. All rights reserved. Coming soon.
        </p>
      </footer>

      {/* ── jump to top ── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollTop}
            aria-label="Back to top"
            className="jump-top fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
