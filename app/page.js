"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleStartNow = () => {
    if (session?.user?.username) {
      router.push(`/${session.user.username}`)
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section className="relative flex flex-col justify-center items-center text-white min-h-[90vh] px-4 overflow-hidden">

        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-700/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 backdrop-blur rounded-full px-4 py-1.5 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Trusted by creators worldwide
        </div>

        {/* Headline */}
        <h1 className="font-extrabold text-5xl md:text-7xl text-center leading-tight mb-6">
          Buy Me a Chai{" "}
          <span className="inline-block align-middle">
            <img className="invertImg inline" src="/tea.gif" width={80} alt="chai" />
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-slate-400 text-base md:text-lg text-center max-w-xl mb-8 leading-relaxed">
          A crowdfunding platform for Creators. Get funded by your fans and followers.{" "}
          <span className="text-violet-400 font-medium">Start now!</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={handleStartNow}
            type="button"
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-violet-900/40 transition-all duration-200 active:scale-95"
          >
            Start Now 🚀
          </button>
          <a
            href="https://wizards-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="px-7 py-3 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-300 font-semibold text-sm hover:border-violet-500/50 hover:text-white transition-all duration-200 backdrop-blur active:scale-95"
            >
              Read More →
            </button>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs animate-bounce">
          <span>↓</span>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      {/* ── FEATURES SECTION ── */}
      <section className="text-white container mx-auto py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Your Fans can buy you a{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Chai
          </span>
        </h2>
        <p className="text-slate-500 text-center text-sm mb-14">Everything you need to get supported by your community</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { gif: "/man.gif",   title: "Fans want to help",  desc: "Your fans are always available to support and fund your journey." },
            { gif: "/coin.gif",  title: "Fans want to help",  desc: "Collect funds effortlessly with seamless payment integrations." },
            { gif: "/group.gif", title: "Fans want to help",  desc: "Build a community that rallies behind your creative work." },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 bg-slate-900/60 backdrop-blur border border-slate-700/40 rounded-2xl px-6 py-8 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/10 transition-all duration-300 group"
            >
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/40 group-hover:border-violet-500/30 transition-all">
                <img src={item.gif} width={64} alt={item.title} />
              </div>
              <p className="font-bold text-white text-base">{item.title}</p>
              <p className="text-slate-400 text-sm text-center leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      {/* ── LEARN MORE SECTION ── */}
      <section className="text-white container mx-auto py-24 px-4 flex flex-col items-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Learn more{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            about us
          </span>
        </h2>
        <p className="text-slate-400 text-sm text-center max-w-md leading-relaxed">
          We are building a space where creators can connect with their supporters and get the funding they deserve.
        </p>
        <a
          href="https://wizards-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-xl border border-slate-700/50 text-slate-300 text-sm hover:border-violet-500/50 hover:text-white transition-all duration-200"
        >
          Visit Portfolio →
        </a>
      </section>
    </>
  );
}
