"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Zap, Search, ChevronRight, Users, Shield, Globe } from "lucide-react";

// ─── Chess board types & data ────────────────────────────────────────────────

type PieceCode = "wp"|"wn"|"wb"|"wr"|"wq"|"wk"|"bp"|"bn"|"bb"|"br"|"bq"|"bk";
type Board = (PieceCode | null)[][];
type Move = [number, number, number, number];

const PIECE_URLS: Record<PieceCode, string> = {
  wp: "/pieces/white-pawn.svg",
  wn: "/pieces/white-knight.svg",
  wb: "/pieces/white-bishop.svg",
  wr: "/pieces/white-rook.svg",
  wq: "/pieces/white-queen.svg",
  wk: "/pieces/white-king.svg",
  bp: "/pieces/black-pawn.svg",
  bn: "/pieces/black-knight.svg",
  bb: "/pieces/black-bishop.svg",
  br: "/pieces/black-rook.svg",
  bq: "/pieces/black-queen.svg",
  bk: "/pieces/black-king.svg",
};

const INITIAL_BOARD: Board = [
  ["br","bn","bb","bq","bk","bb","bn","br"],
  ["bp","bp","bp","bp","bp","bp","bp","bp"],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ["wp","wp","wp","wp","wp","wp","wp","wp"],
  ["wr","wn","wb","wq","wk","wb","wn","wr"],
];

// Italian Game opening sequence: e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6
const OPENING_MOVES: Move[] = [
  [6,4,4,4], // 1. e4
  [1,4,3,4], // 1...e5
  [7,6,5,5], // 2. Nf3
  [0,1,2,2], // 2...Nc6
  [7,5,4,2], // 3. Bc4
  [0,5,3,2], // 3...Bc5
  [6,2,5,2], // 4. c3
  [0,6,2,5], // 4...Nf6
];

function applyMove(board: Board, [fr, fc, tr, tc]: Move): Board {
  return board.map((row, r) =>
    row.map((cell, c) => {
      if (r === tr && c === tc) return (board[fr]?.[fc]) ?? null;
      if (r === fr && c === fc) return null;
      return cell;
    })
  ) as Board;
}

const BOARD_STATES: Board[] = OPENING_MOVES.reduce<Board[]>(
  (acc, move) => {
    const last = acc[acc.length - 1];
    return last ? [...acc, applyMove(last, move)] : acc;
  },
  [INITIAL_BOARD]
);

// ─── AnimatedChessBoard ───────────────────────────────────────────────────────

const AnimatedChessBoard = () => {
  const [stateIdx, setStateIdx] = useState(0);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setStateIdx(prev => {
        const next = (prev + 1) % BOARD_STATES.length;
        setLastMove(next > 0 ? (OPENING_MOVES[next - 1] ?? null) : null);
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const board = BOARD_STATES[stateIdx] ?? INITIAL_BOARD;

  const isLastMoveSquare = (r: number, c: number) =>
    lastMove !== null && (
      (r === lastMove[0] && c === lastMove[1]) ||
      (r === lastMove[2] && c === lastMove[3])
    );

  return (
    <div className="board-glow rounded-2xl overflow-hidden shadow-2xl w-full aspect-square">
      <div className="grid grid-cols-8 h-full w-full" style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)" }}>
        {board.map((row, r) =>
          row.map((piece, c) => {
            const light = (r + c) % 2 === 0;
            const highlighted = isLastMoveSquare(r, c);
            const bg = highlighted
              ? (light ? "rgba(247,236,94,0.75)" : "rgba(247,236,94,0.55)")
              : (light ? "#eeeed2" : "#769656");
            return (
              <div
                key={`${r}-${c}`}
                className="relative"
                style={{ backgroundColor: bg }}
              >
                <AnimatePresence>
                  {piece && (
                    <motion.div
                      key={`${piece}-${r}-${c}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 flex items-center justify-center p-[8%]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={PIECE_URLS[piece]}
                        alt={piece}
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  useEffect(() => {
    const t = setTimeout(() => onFinished(), 2500);
    return () => clearTimeout(t);
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#262421] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <motion.div
          animate={{ rotateY: [0, 180, 360], scale: [1, 1.1, 1] }}
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
          className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full opacity-50"
        />
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
    </motion.div>
  );
};

const GlassButton = ({
  children, primary = false, onClick, className = ""
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
        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-premium"
        : "glass-morphism text-white hover:bg-white/10"}
      ${className}
    `}
  >
    <div className="flex items-center gap-2 relative z-10">{children}</div>
    <div className={`absolute inset-0 transition-opacity duration-500 ${primary ? "bg-emerald-400/20 opacity-0 group-hover:opacity-100" : "bg-white/5 opacity-0 group-hover:opacity-100"}`} />
    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.button>
);

const FeatureCard = ({
  icon: Icon, title, description, delay = 0
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
    whileHover={{ y: -8, scale: 1.02 }}
    className="glass-morphism p-8 rounded-[32px] hover:border-emerald-500/30 transition-all group relative overflow-hidden h-full"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
    <div className="w-14 h-14 glass-morphism rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon className="text-emerald-500 w-7 h-7" />
    </div>
    <h3 className="text-xl font-black mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale  = useTransform(scrollY, [0, 500], [1, 0.96]);
  const heroY      = useTransform(scrollY, [0, 500], [0, 80]);

  useEffect(() => {
    if (localStorage.getItem("chess_token")) {
      router.replace("/game");
    }
  }, [router]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-mesh-gradient text-zinc-100 overflow-x-hidden selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" onFinished={() => setIsLoading(false)} />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

            {/* ── Nav ── */}
            <motion.nav
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled ? "py-3 bg-black/80 backdrop-blur-2xl border-b border-white/5" : "py-6 bg-transparent"
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
                  <div className="w-10 h-10 glass-morphism rounded-xl flex items-center justify-center font-black text-emerald-500 text-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    ♔
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase">Chess.io</span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                  <button
                    onClick={() => router.push("/leaderboard")}
                    className="hover:text-white transition-colors relative group py-1"
                  >
                    Rankings
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    className="hidden sm:block text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                  <GlassButton primary className="py-2.5 px-6 text-sm" onClick={() => router.push("/signup")}>
                    Play Free
                  </GlassButton>
                </div>
              </div>
            </motion.nav>

            {/* ── Hero ── */}
            <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
                  transition={{ duration: 9, repeat: Infinity }}
                  className="absolute -top-40 -left-20 w-[65%] h-[65%] bg-emerald-500/10 blur-[160px] rounded-full"
                />
                <motion.div
                  animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.08, 0.04] }}
                  transition={{ duration: 11, repeat: Infinity }}
                  className="absolute bottom-0 -right-20 w-[50%] h-[60%] bg-emerald-700/10 blur-[140px] rounded-full"
                />
              </div>

              <motion.div
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 xl:gap-20 items-center relative z-10 py-16"
              >
                {/* Copy */}
                <div className="space-y-10 text-center lg:text-left">
                  <div className="space-y-5">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="inline-flex items-center gap-2 px-4 py-2 glass-morphism rounded-full text-xs font-black uppercase tracking-[0.2em] text-emerald-400"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live games happening now
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.88] text-white"
                    >
                      Play chess that<br />
                      <span className="text-gradient-gold">means something.</span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                    >
                      Real Elo ratings. Instant matchmaking. Blitz, rapid, classical — all in one place.{" "}
                      <span className="text-zinc-200">Zero distractions.</span>
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  >
                    <GlassButton primary className="px-8 py-4 text-base" onClick={() => router.push("/signup")}>
                      Start Playing Free <ChevronRight className="w-4 h-4" />
                    </GlassButton>
                    <GlassButton className="px-8 py-4 text-base" onClick={() => router.push("/login")}>
                      Sign In
                    </GlassButton>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-wrap gap-8 justify-center lg:justify-start"
                  >
                    {[
                      { value: "Elo", label: "Standard ratings" },
                      { value: "4", label: "Time controls" },
                      { value: "Free", label: "Always" },
                    ].map((s) => (
                      <div key={s.label} className="text-center lg:text-left">
                        <div className="text-2xl font-black text-white">{s.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Animated board */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  className="relative flex items-center justify-center"
                >
                  <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
                    {/* Glow rings */}
                    <div className="absolute -inset-4 border border-emerald-500/10 rounded-3xl pointer-events-none" />
                    <div className="absolute -inset-8 border border-emerald-500/5 rounded-[2rem] pointer-events-none" />

                    {/* Board container with coordinate labels */}
                    <div className="glass-morphism p-3 rounded-2xl shadow-premium">
                      <AnimatedChessBoard />
                    </div>

                    {/* Move indicator */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-zinc-500 font-mono whitespace-nowrap"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Italian Game · live preview
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                <div className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500">Scroll</div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1 h-3 rounded-full bg-emerald-500"
                />
              </div>
            </section>

            {/* ── Features ── */}
            <section className="py-32 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-black tracking-tighter"
                  >
                    Everything you need.<br />
                    <span className="text-gradient-emerald">Nothing you don&apos;t.</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-zinc-500 text-lg max-w-xl mx-auto"
                  >
                    Built for players who just want to play.
                  </motion.p>
                </div>

                <div className="grid md:grid-cols-6 gap-4 md:gap-6">
                  <div className="md:col-span-4">
                    <FeatureCard
                      icon={Zap}
                      title="Instant Matchmaking"
                      description="Four time controls — bullet (1 min), blitz (5 min), rapid (10 min), classical (30 min). You'll never wait more than 30 seconds for a balanced game."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FeatureCard
                      icon={Users}
                      title="Private Games"
                      description="Challenge a friend directly. Create a room, share the code, play."
                      delay={0.1}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FeatureCard
                      icon={Search}
                      title="Real Elo Ratings"
                      description="FIDE-standard Elo tracked across every game. Your rating means something here."
                      delay={0.15}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <FeatureCard
                      icon={Globe}
                      title="Live Leaderboard"
                      description="See your rank against every player on the platform. Updated after every single game, in real time."
                      delay={0.2}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Time Controls ── */}
            <section className="py-24 px-6">
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-12"
                >
                  Pick your pace.
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Bullet", time: "1 min", icon: "⚡", desc: "Pure instinct" },
                    { label: "Blitz", time: "5 min", icon: "🔥", desc: "Fast & sharp" },
                    { label: "Rapid", time: "10 min", icon: "⏱", desc: "Think it through" },
                    { label: "Classical", time: "30 min", icon: "♟", desc: "Deep strategy" },
                  ].map((tc, i) => (
                    <motion.div
                      key={tc.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -6, scale: 1.03 }}
                      className="glass-morphism rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-all cursor-pointer group"
                      onClick={() => router.push("/signup")}
                    >
                      <div className="text-3xl mb-3">{tc.icon}</div>
                      <div className="text-lg font-black text-white">{tc.label}</div>
                      <div className="text-emerald-400 font-mono text-sm font-bold">{tc.time}</div>
                      <div className="text-xs text-zinc-500 mt-1">{tc.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-40 px-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-4xl mx-auto glass-morphism rounded-[48px] p-16 md:p-24 text-center space-y-12 relative shadow-premium"
              >
                <div className="space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-8xl font-black tracking-tighter leading-none"
                  >
                    Ready to take<br />
                    <span className="text-gradient-gold">the throne?</span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-zinc-400 text-xl max-w-lg mx-auto"
                  >
                    No downloads. No ads. Just pure chess. Free forever.
                  </motion.p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <GlassButton primary className="text-xl px-14 py-6 w-full sm:w-auto" onClick={() => router.push("/signup")}>
                    Create Free Account
                  </GlassButton>
                  <div className="flex flex-wrap items-center justify-center gap-8">
                    {[
                      { icon: Shield, label: "Fair Play" },
                      { icon: Users, label: "Active Community" },
                      { icon: Zap,    label: "Zero Lag" },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        <b.icon className="w-4 h-4 text-emerald-500" /> {b.label}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-12 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 glass-morphism rounded-xl flex items-center justify-center text-emerald-500 text-lg font-black">♔</div>
                  <span className="text-lg font-black tracking-tighter uppercase">Chess.io</span>
                </div>
                <div className="flex items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  <button onClick={() => router.push("/leaderboard")} className="hover:text-emerald-400 transition-colors">Rankings</button>
                  <button onClick={() => router.push("/login")}       className="hover:text-emerald-400 transition-colors">Login</button>
                  <button onClick={() => router.push("/signup")}      className="hover:text-emerald-400 transition-colors">Sign Up</button>
                </div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">© 2026 Chess.io</div>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
