"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Zap,
  Cpu,
  Search,
  ChevronRight,
  Star,
  Users,
  Shield,
  Globe
} from "lucide-react";

// --- Components ---

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinished(), 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <motion.div
          animate={{
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 glass-morphism rounded-[32px] flex items-center justify-center text-5xl text-emerald-500 shadow-premium"
        >
          ♔
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl font-black tracking-[0.3em] uppercase text-white"
          >
            Welcome to the
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-gradient-gold"
          >
            Game of Kings
          </motion.h2>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent rounded-full opacity-50"
        />
      </motion.div>

      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
    </motion.div>
  );
};

const GlassButton = ({
  children,
  primary = false,
  onClick,
  className = ""
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      px-8 py-4 rounded-xl font-bold transition-all relative overflow-hidden group
      ${primary
        ? "bg-linear-to-r from-accent-emerald to-emerald-600 text-white shadow-premium"
        : "glass-morphism text-white hover:bg-white/10"}
      ${className}
    `}
  >
    <div className="flex items-center gap-2 relative z-10 transition-transform group-hover:scale-105">
      {children}
    </div>
    <div className={`absolute inset-0 transition-opacity duration-500 ${primary ? "bg-emerald-400/20 opacity-0 group-hover:opacity-100" : "bg-white/5 opacity-0 group-hover:opacity-100"}`} />
    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.button>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="glass-morphism p-8 rounded-[32px] hover:border-emerald-500/30 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
    <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-premium">
      <Icon className="text-emerald-500 w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black mb-4 text-white tracking-tight">{title}</h3>
    <p className="text-zinc-400 leading-relaxed font-medium">{description}</p>
  </motion.div>
);

const StatCounter = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center md:text-left">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-5xl font-black text-white mb-2 tracking-tighter"
    >
      {value}
    </motion.div>
    <div className="text-emerald-500/80 text-xs uppercase tracking-[0.2em] font-black">{label}</div>
  </div>
);

// --- Page ---

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-mesh-gradient text-zinc-100 overflow-x-hidden selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" onFinished={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <motion.nav
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
                isScrolled ? "py-4 bg-black/80 backdrop-blur-2xl border-b border-white/5" : "py-8 bg-transparent"
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
                  <div className="w-12 h-12 glass-morphism rounded-2xl flex items-center justify-center font-black text-emerald-500 text-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-premium">
                    ♔
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter leading-none">CHESS.IO</span>
                    <span className="text-[10px] text-emerald-500 font-bold tracking-[0.3em] uppercase opacity-60">Mastery</span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-12 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                  <button
                    onClick={() => router.push("/leaderboard")}
                    className="hover:text-white transition-all relative group py-2"
                  >
                    Rankings
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    className="hidden sm:block text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                  <GlassButton primary className="py-3 px-8 text-sm" onClick={() => router.push("/signup")}>
                    Play Now
                  </GlassButton>
                </div>
              </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-[110vh] flex items-center pt-24 px-6 overflow-hidden">
              {/* Background Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"
                />
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute bottom-[0%] right-[-10%] w-[50%] h-[70%] bg-accent-gold/5 blur-[120px] rounded-full"
                />
              </div>

              <motion.div
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10"
              >
                <div className="space-y-12 text-center lg:text-left">
                  <div className="space-y-6">
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white"
                    >
                      Master Chess<br />
                      <span className="text-gradient-gold">Online.</span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                    >
                      Focus on what matters: <span className="text-white">your next brilliant move.</span> <br className="hidden md:block" />
                      Pure chess, zero clutter. Built for those who take the game seriously.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                  >
                    <GlassButton primary className="px-10 py-5" onClick={() => router.push("/game")}>
                      Start Playing Free <ChevronRight className="w-5 h-5 ml-2" />
                    </GlassButton>
                    <GlassButton className="px-10 py-5" onClick={() => router.push("/signup")}>
                      Create Account
                    </GlassButton>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  className="relative h-full perspective-1000"
                >
                  <div className="relative glass-morphism rounded-[60px] p-6 shadow-premium group">
                     <div className="aspect-square bg-zinc-950 rounded-[40px] overflow-hidden border-2 border-white/5 relative">
                        {/* Interactive Chessboard Decoration */}
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-40">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                              className={`${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-zinc-900' : 'bg-transparent'} transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{
                              y: [0, -40, 0],
                              rotate: [0, 5, -5, 0],
                              filter: ["drop-shadow(0 20px 30px rgba(0,0,0,0.5))", "drop-shadow(0 40px 60px rgba(16,185,129,0.3))", "drop-shadow(0 20px 30px rgba(0,0,0,0.5))"]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[280px] select-none opacity-90 cursor-default"
                          >
                            <span className="text-gradient-gold">♛</span>
                          </motion.div>
                        </div>

                        {/* Floating Pieces Decoration */}
                        {[
                          { char: "♞", pos: "top-10 left-10", delay: 0 },
                          { char: "♝", pos: "bottom-20 right-10", delay: 1 },
                          { char: "♜", pos: "top-20 right-20", delay: 2 },
                        ].map((p, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, delay: p.delay, repeat: Infinity }}
                            className={`absolute ${p.pos} text-5xl text-white/20`}
                          >
                            {p.char}
                          </motion.div>
                        ))}
                     </div>

                     {/* Decorative Ring */}
                     <div className="absolute -inset-4 border border-emerald-500/10 rounded-[70px] -z-10 animate-pulse" />
                  </div>
                </motion.div>
              </motion.div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Scroll to Explore</div>
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-3 rounded-full bg-emerald-500"
                />
              </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-40 px-6 relative">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-32 space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-8xl font-black tracking-tighter"
                  >
                    Master Your <span className="text-gradient-emerald">Strategy.</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 text-xl max-w-2xl mx-auto font-medium"
                  >
                    Everything you need to play, improve, and compete.
                  </motion.p>
                </div>

                <div className="grid md:grid-cols-6 gap-6">
                  <div className="md:col-span-4">
                    <FeatureCard
                      icon={Zap}
                      title="Smart Matchmaking"
                      description="Find opponents instantly across four time controls — bullet (1 min), blitz (5 min), rapid (10 min), and classical (30 min). Balanced games every time."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FeatureCard
                      icon={Users}
                      title="Private Lobbies"
                      description="Challenge a friend directly. Create a game, share the code, and play."
                      delay={0.1}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FeatureCard
                      icon={Search}
                      title="Rating System"
                      description="Elo-based ratings tracked across every game. See your progress and climb the ranks."
                      delay={0.2}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <FeatureCard
                      icon={Globe}
                      title="Global Leaderboard"
                      description="See where you rank against all players worldwide. Updated in real time after every game."
                      delay={0.3}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-60 px-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto glass-morphism rounded-[60px] p-20 text-center space-y-16 relative shadow-premium border-white/5"
              >
                <div className="space-y-8">
                   <motion.h2
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="text-6xl md:text-9xl font-black tracking-tighter leading-none"
                   >
                     Ready to take<br />
                     <span className="text-gradient-gold">the throne?</span>
                   </motion.h2>
                   <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="text-zinc-400 text-2xl font-medium tracking-tight max-w-2xl mx-auto"
                   >
                     No downloads. No ads. Just pure chess. Free to play.
                   </motion.p>
                </div>

                <div className="flex flex-col items-center gap-10">
                  <GlassButton primary className="text-2xl px-16 py-8 w-full sm:w-auto" onClick={() => router.push("/game")}>
                    Start Playing Now
                  </GlassButton>

                  <div className="flex flex-wrap items-center justify-center gap-10">
                     {[
                       { icon: Shield, label: "Fair Play" },
                       { icon: Users, label: "Active Daily" },
                       { icon: Zap, label: "Zero Lag" }
                     ].map((badge, i) => (
                       <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                         <badge.icon className="w-5 h-5 text-emerald-500" /> {badge.label}
                       </div>
                     ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-white/5 bg-background relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 glass-morphism rounded-xl flex items-center justify-center font-black text-emerald-500 text-xl">♔</div>
                    <span className="text-xl font-black tracking-tighter uppercase">Chess.io</span>
                  </div>
                  <div className="flex items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    <button onClick={() => router.push("/game")} className="hover:text-emerald-500 transition-colors">Play</button>
                    <button onClick={() => router.push("/leaderboard")} className="hover:text-emerald-500 transition-colors">Rankings</button>
                    <button onClick={() => router.push("/login")} className="hover:text-emerald-500 transition-colors">Login</button>
                    <button onClick={() => router.push("/signup")} className="hover:text-emerald-500 transition-colors">Sign Up</button>
                  </div>
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
                    © 2026 Chess.io
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
