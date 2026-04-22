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

/* ─── helpers ─── */
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now()
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

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

/* ─── countdown box ─── */
function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="countdown-box flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32"
      whileHover={{ scale: 1.06, borderColor: 'rgba(41,112,232,0.7)' }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', textShadow: '0 0 20px rgba(41,112,232,0.6)' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs md:text-sm font-medium mt-1 tracking-widest uppercase" style={{ color: 'rgba(74,138,244,0.8)' }}>{label}</span>
    </motion.div>
  )
}

/* ─── feature card ─── */
const features = [
  { icon: '🗺️', title: 'Event Blueprints', desc: 'Design detailed floor plans and layouts for any type of event with precision drag-and-drop tools.' },
  { icon: '🧊', title: '3D Visualization', desc: 'Walk through your event space in immersive 3D before the first guest ever arrives.' },
  { icon: '⚡', title: 'Real-Time Collaboration', desc: 'Invite your team, vendors, and clients to co-plan events live — all from one dashboard.' },
  { icon: '📐', title: 'Smart Templates', desc: 'Kick-start your event with intelligent templates tailored for weddings, conferences, galas, and more.' },
  { icon: '🎨', title: 'Decor Simulation', desc: 'Place virtual décor, lighting, and furniture to see how everything looks before you commit.' },
  { icon: '📊', title: 'Guest Flow Analytics', desc: 'Analyze traffic patterns and optimize seating arrangements with built-in AI-powered insights.' },
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
    <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
      {/* outer ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 300, height: 300, borderColor: 'rgba(41,112,232,0.15)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 90, 180, 270].map(deg => (
          <div key={deg} className="absolute w-2 h-2 rounded-full" style={{ background: '#2970e8', top: '50%', left: '50%', transform: `rotate(${deg}deg) translateX(148px) translateY(-50%)` }} />
        ))}
      </motion.div>
      {/* middle ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 210, height: 210, borderColor: 'rgba(41,112,232,0.2)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {[45, 135, 225, 315].map(deg => (
          <div key={deg} className="absolute w-3 h-3 rounded-full" style={{ background: '#1a5ecf', top: '50%', left: '50%', transform: `rotate(${deg}deg) translateX(103px) translateY(-50%)` }} />
        ))}
      </motion.div>
      {/* glow behind logo */}
      <div className="absolute rounded-full" style={{ width: 110, height: 110, background: 'radial-gradient(circle, rgba(41,112,232,0.4) 0%, transparent 70%)' }} />
      {/* logo */}
      <motion.img
        src="/mainLogo.svg"
        alt="EventSpacePro Logo"
        className="relative z-10"
        style={{ width: 100, filter: 'drop-shadow(0 0 18px rgba(41,112,232,0.7))' }}
        animate={{ scale: [1, 1.04, 1] }}
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
  const { d, h, m, s } = useCountdown(new Date('2025-09-01T00:00:00'))
  const [showTop, setShowTop] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, -120])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3])

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

          {/* countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="flex gap-4 mt-4"
          >
            <CountBox value={d} label="Days" />
            <CountBox value={h} label="Hours" />
            <CountBox value={m} label="Mins" />
            <CountBox value={s} label="Secs" />
          </motion.div>

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

      {/* ── 3D preview teaser ── */}
      <section className="relative z-10 py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050d1f 0%, #070f25 50%, #050d1f 100%)' }}>
        <div className="divider mb-24" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* visual */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(13,27,62,0.9) 0%, rgba(26,47,94,0.6) 100%)', border: '1px solid rgba(41,112,232,0.25)' }} />
              {/* fake 3d grid */}
              <div className="absolute inset-6 grid grid-cols-4 grid-rows-4 gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded"
                    style={{ background: i % 3 === 0 ? 'rgba(41,112,232,0.5)' : i % 5 === 0 ? 'rgba(41,112,232,0.25)' : 'rgba(41,112,232,0.08)', border: '1px solid rgba(41,112,232,0.2)' }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
              {/* label */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#4a8af4' }}>3D Floor Plan</span>
              </div>
              {/* glow */}
              <div className="absolute -inset-4 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(41,112,232,0.12) 0%, transparent 70%)' }} />
            </div>
          </motion.div>

          {/* text */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#4a8af4' }}>3D Visualization</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.2 }}>
              See your event before<br />
              <span style={{ color: '#2970e8' }}>it ever happens</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(180,200,255,0.7)' }}>
              Our powerful 3D engine lets you place tables, stages, decor, and lighting in a photorealistic virtual space — giving you and your clients absolute confidence before a single booking is made.
            </p>
            <div className="flex flex-col gap-3">
              {['Real-time rendering', 'VR-ready walkthrough', 'Exportable blueprints'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(41,112,232,0.2)', border: '1px solid rgba(41,112,232,0.4)' }}>
                    <span style={{ color: '#4a8af4', fontSize: 10 }}>✓</span>
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(180,200,255,0.75)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="divider mt-24" />
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
