"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Zap, Trophy, Users, ArrowRight, Moon, Sun, Twitter } from "lucide-react";

// ─── Chess board ──────────────────────────────────────────────────────────────

type PieceCode = "wp"|"wn"|"wb"|"wr"|"wq"|"wk"|"bp"|"bn"|"bb"|"br"|"bq"|"bk";
type Board = (PieceCode | null)[][];
type Move = [number, number, number, number];

const PIECE_URLS: Record<PieceCode, string> = {
  wp: "/pieces/white-pawn.svg",   wn: "/pieces/white-knight.svg",
  wb: "/pieces/white-bishop.svg", wr: "/pieces/white-rook.svg",
  wq: "/pieces/white-queen.svg",  wk: "/pieces/white-king.svg",
  bp: "/pieces/black-pawn.svg",   bn: "/pieces/black-knight.svg",
  bb: "/pieces/black-bishop.svg", br: "/pieces/black-rook.svg",
  bq: "/pieces/black-queen.svg",  bk: "/pieces/black-king.svg",
};

const INIT: Board = [
  ["br","bn","bb","bq","bk","bb","bn","br"],
  ["bp","bp","bp","bp","bp","bp","bp","bp"],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ["wp","wp","wp","wp","wp","wp","wp","wp"],
  ["wr","wn","wb","wq","wk","wb","wn","wr"],
];

const MOVES: Move[] = [
  [6,4,4,4],[1,4,3,4],[7,6,5,5],[0,1,2,2],
  [7,5,4,2],[0,5,3,2],[6,2,5,2],[0,6,2,5],
];

const MOVE_LABELS = ["e4","e5","Nf3","Nc6","Bc4","Bc5","c3","Nf6"];

function apply(board: Board, [fr,fc,tr,tc]: Move): Board {
  return board.map((row, r) =>
    row.map((cell, c) => {
      if (r === tr && c === tc) return board[fr]?.[fc] ?? null;
      if (r === fr && c === fc) return null;
      return cell;
    })
  ) as Board;
}

const BOARDS: Board[] = MOVES.reduce<Board[]>(
  (acc, m) => { const last = acc[acc.length - 1]; return last ? [...acc, apply(last, m)] : acc; },
  [INIT]
);

// ─── Animated board ───────────────────────────────────────────────────────────

function AnimatedBoard({ size = 320 }: { size?: number }) {
  const [idx, setIdx] = useState(0);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % BOARDS.length;
        setLastMove(next > 0 ? (MOVES[next - 1] ?? null) : null);
        return next;
      });
    }, 1900);
    return () => clearInterval(id);
  }, []);

  const board = BOARDS[idx] ?? INIT;
  const isHit = (r: number, c: number) =>
    lastMove !== null && ((r === lastMove[0] && c === lastMove[1]) || (r === lastMove[2] && c === lastMove[3]));

  return (
    <div style={{ width: size, height: size }} className="rounded-lg overflow-hidden board-glow flex-shrink-0">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gridTemplateRows: "repeat(8,1fr)", width: "100%", height: "100%" }}>
        {board.map((row, r) => row.map((piece, c) => {
          const light = (r + c) % 2 === 0;
          const hit = isHit(r, c);
          return (
            <div key={`${r}-${c}`} className="relative" style={{
              backgroundColor: hit
                ? (light ? "rgba(247,236,94,0.75)" : "rgba(247,236,94,0.55)")
                : (light ? "#eeeed2" : "#769656")
            }}>
              <AnimatePresence>
                {piece && (
                  <motion.div
                    key={`${piece}-${r}-${c}`}
                    initial={{ opacity: 0, scale: 0.45 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.35 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center p-[7%]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PIECE_URLS[piece]} alt={piece} className="w-full h-full object-contain select-none" draggable={false} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }))}
      </div>
    </div>
  );
}

// ─── Product mockup frame ─────────────────────────────────────────────────────

function ProductFrame({ dark }: { dark: boolean }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(p => (p + 1) % BOARDS.length), 1900);
    return () => clearInterval(id);
  }, []);

  const label = idx > 0 ? MOVE_LABELS[idx - 1] : "start";

  return (
    <div className={`rounded-2xl overflow-hidden border ${dark ? "border-white/8 bg-[#1a1a1a]" : "border-black/8 bg-white"}`}
      style={{ boxShadow: dark ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" : "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }}>
      {/* Window chrome */}
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${dark ? "border-white/5 bg-[#141414]" : "border-black/5 bg-[#f5f5f3]"}`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className={`flex-1 text-center text-xs font-mono ${dark ? "text-white/20" : "text-black/20"}`}>chessable/game</div>
      </div>

      {/* Game UI */}
      <div className="flex gap-0">
        {/* Board area */}
        <div className={`p-4 flex flex-col gap-3 ${dark ? "bg-[#1a1a1a]" : "bg-white"}`}>
          {/* Black player */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${dark ? "bg-zinc-700 text-white" : "bg-zinc-200 text-zinc-700"}`}>M</div>
              <div>
                <div className={`text-xs font-semibold leading-none ${dark ? "text-white/80" : "text-zinc-800"}`}>Magnus</div>
                <div className={`text-[10px] ${dark ? "text-white/30" : "text-zinc-400"}`}>1842</div>
              </div>
            </div>
            <div className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${dark ? "bg-zinc-800 text-white/60" : "bg-zinc-100 text-zinc-600"}`}>5:00</div>
          </div>

          <AnimatedBoard size={500} />

          {/* White player */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${dark ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-700"}`}>Y</div>
              <div>
                <div className={`text-xs font-semibold leading-none ${dark ? "text-white/80" : "text-zinc-800"}`}>You</div>
                <div className={`text-[10px] ${dark ? "text-white/30" : "text-zinc-400"}`}>1594</div>
              </div>
            </div>
            <div className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${dark ? "bg-zinc-800 text-white/60" : "bg-zinc-100 text-zinc-600"}`}>4:47</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`w-52 border-l flex flex-col ${dark ? "border-white/5 bg-[#141414]" : "border-black/5 bg-[#f9f9f7]"}`}>
          <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b ${dark ? "text-white/20 border-white/5" : "text-zinc-400 border-black/5"}`}>Moves</div>
          <div className="flex-1 px-2 py-2 space-y-0.5 overflow-hidden">
            {MOVE_LABELS.slice(0, idx).map((m, i) => (
              <div key={i} className={`text-[11px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${i === idx - 1
                ? (dark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-700")
                : (dark ? "text-white/40" : "text-zinc-500")}`}>
                {i % 2 === 0 && <span className={`text-[9px] w-3 ${dark ? "text-white/20" : "text-zinc-300"}`}>{Math.floor(i / 2) + 1}.</span>}
                {m}
              </div>
            ))}
          </div>
          <div className={`px-3 py-2 border-t ${dark ? "border-white/5" : "border-black/5"}`}>
            <div className={`text-[10px] font-mono ${dark ? "text-white/20" : "text-zinc-400"}`}>Italian Game</div>
            <div className={`text-[9px] font-mono ${dark ? "text-emerald-500/60" : "text-emerald-600/60"}`}>{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Trophy,
    title: "Real Elo Ratings",
    desc: "FIDE-standard ratings tracked across every single game. Your number means something here.",
  },
  {
    icon: Zap,
    title: "Instant Matchmaking",
    desc: "Four time controls. Balanced opponents. You'll never wait more than 30 seconds.",
  },
  {
    icon: Users,
    title: "Private Rooms",
    desc: "Challenge a friend directly — create a room, share the code, start playing.",
  },
];

const TIME_CONTROLS = [
  { label: "Bullet",    time: "1 min",  icon: "⚡" },
  { label: "Blitz",     time: "5 min",  icon: "🔥" },
  { label: "Rapid",     time: "10 min", icon: "⏱"  },
  { label: "Classical", time: "30 min", icon: "♟"  },
];

export default function HomePage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("chess_token")) { router.replace("/game"); return; }
    const saved = localStorage.getItem("lp_theme");
    if (saved === "light") setDark(false);
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(d => {
      localStorage.setItem("lp_theme", d ? "light" : "dark");
      return !d;
    });
  }, []);

  const theme = dark ? "lp-dark" : "lp-light";

  const navBorder = scrolled
    ? (dark ? "border-b border-white/5 bg-[#0d0d0d]/90 backdrop-blur-xl" : "border-b border-black/5 bg-white/90 backdrop-blur-xl")
    : "bg-transparent";

  return (
    <div className={`${theme} lp-bg lp-text min-h-screen overflow-x-hidden`}>

      {/* ── Nav ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBorder}`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2.5 font-black text-lg tracking-tight lp-text">
            <span className="text-xl lp-accent-c">♔</span> Chessable
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium lp-muted">
            <button onClick={() => router.push("/leaderboard")} className="hover:lp-text transition-colors" style={{ color: "var(--lp-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}>
              Rankings
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors lp-card lp-card-hover"
              style={{ border: "1px solid var(--lp-border)" }}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-4 h-4 lp-muted" style={{ color: "var(--lp-muted)" }} /> : <Moon className="w-4 h-4" style={{ color: "var(--lp-muted)" }} />}
            </button>
            <button
              className="hidden sm:inline-flex text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "var(--lp-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}
              onClick={() => router.push("/login")}
            >
              Log in
            </button>
            <button className="lp-btn-primary text-sm" style={{ padding: "8px 18px", fontSize: "14px" }} onClick={() => router.push("/signup")}>
              Play free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="lp-pill">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--lp-accent)" }} />
              Free forever · No account required to spectate
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-7 text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.0]"
          >
            The chessboard<br />
            <span className="gradient-text-green">built for serious play.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-lg max-w-xl mx-auto lp-muted"
            style={{ color: "var(--lp-muted)" }}
          >
            Real Elo ratings. Instant matchmaking across four time controls.
            Zero ads, zero fluff.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button className="lp-btn-primary" onClick={() => router.push("/signup")}>
              Start playing free <ArrowRight className="w-4 h-4" />
            </button>
            <button className="lp-btn-secondary" onClick={() => router.push("/leaderboard")}>
              View rankings
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 text-sm lp-muted"
            style={{ color: "var(--lp-muted)", fontSize: "13px" }}
          >
            No credit card. No install.
          </motion.p>
        </div>
      </section>

      {/* ── Product demo ── */}
      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Glow behind the card */}
          <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, var(--lp-accent) 0%, transparent 70%)` }} />

          <ProductFrame dark={dark} />

          <p className="text-center mt-4 text-xs font-mono" style={{ color: "var(--lp-muted)" }}>
            Italian Game opening · pieces update live
          </p>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px" style={{ background: "var(--lp-border)" }} />
      </div>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black tracking-tight"
            >
              Everything you need to play.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-base lp-muted max-w-md mx-auto"
              style={{ color: "var(--lp-muted)" }}
            >
              Built lean, runs fast. No features you&apos;ll never use.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="lp-card lp-card-hover rounded-2xl p-7"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "var(--lp-green-glow)", border: "1px solid var(--lp-border)" }}>
                  <Icon className="w-5 h-5" style={{ color: "var(--lp-accent)" }} />
                </div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Time controls ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="lp-card rounded-2xl p-8 md:p-12">
            <div className="md:flex items-start justify-between gap-12">
              <div className="mb-8 md:mb-0 md:max-w-xs">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">Pick your pace.</h2>
                <p className="mt-3 text-sm" style={{ color: "var(--lp-muted)" }}>
                  From lightning bullet rounds to deep classical games. Your clock, your style.
                </p>
                <button className="lp-btn-primary mt-6 text-sm" style={{ padding: "9px 20px", fontSize: "13px" }}
                  onClick={() => router.push("/signup")}>
                  Start a game <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                {TIME_CONTROLS.map(({ label, time, icon }, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -3, scale: 1.03 }}
                    onClick={() => router.push("/signup")}
                    className="rounded-xl p-4 text-left transition-all"
                    style={{ backgroundColor: "var(--lp-bg2)", border: "1px solid var(--lp-border)" }}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "var(--lp-accent)" }}>{time}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-card rounded-3xl p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, var(--lp-green-glow) 0%, transparent 60%)` }} />
            <div className="relative">
              <div className="text-5xl mb-5">♔</div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Ready to play?
              </h2>
              <p className="mt-3 text-base" style={{ color: "var(--lp-muted)" }}>
                Create a free account and find your first match in under 30 seconds.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button className="lp-btn-primary" onClick={() => router.push("/signup")}>
                  Create free account <ArrowRight className="w-4 h-4" />
                </button>
                <button className="lp-btn-secondary" onClick={() => router.push("/login")}>
                  Already have an account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 pt-14 pb-0 overflow-hidden" style={{ borderColor: "var(--lp-border)" }}>
        <div className="max-w-6xl mx-auto">

          {/* Top row — brand + link columns */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 pb-12">

            {/* Brand */}
            <div className="flex-1 max-w-xs">
              <div className="flex items-center gap-2 font-black text-lg tracking-tight">
                <span style={{ color: "var(--lp-accent)" }}>♔</span> Chessable
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>
                The chessboard built for serious play. Real Elo ratings, instant matchmaking, zero fluff.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://twitter.com/abhijitam_tw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "var(--lp-card)", border: "1px solid var(--lp-border)", color: "var(--lp-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}
                  aria-label="Twitter"
                >
                  <Twitter size={14} />
                </a>
              </div>
            </div>

            {/* Link columns */}
            <div className="flex gap-12 md:gap-16">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--lp-muted)" }}>Product</span>
                {([["Play", "/signup"], ["Rankings", "/leaderboard"], ["Sign In", "/login"]] as [string, string][]).map(([label, href]) => (
                  <button key={label} className="text-sm text-left transition-colors" style={{ color: "var(--lp-muted)" }}
                    onClick={() => router.push(href)}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--lp-muted)" }}>Contact</span>
                <a href="https://twitter.com/abhijitam_tw" target="_blank" rel="noopener noreferrer"
                  className="text-sm transition-colors" style={{ color: "var(--lp-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}>
                  @abhijitam_tw
                </a>
                <a href="mailto:work.abhijitam@gmail.com"
                  className="text-sm transition-colors" style={{ color: "var(--lp-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}>
                  work.abhijitam@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: "var(--lp-border)" }} />

          {/* Giant wordmark */}
          <div className="py-4 overflow-hidden">
            <span
              className="block font-black tracking-tighter select-none leading-none"
              style={{
                fontSize: "clamp(60px, 14vw, 160px)",
                color: "var(--lp-border)",
                letterSpacing: "-0.04em",
              }}
            >
              CHESSABLE
            </span>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: "var(--lp-border)" }} />

          {/* Bottom bar */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "var(--lp-muted)" }}>
            <span>© 2026 Chessable. All rights reserved.</span>
            <span>
              Built by{" "}
              <a href="https://abhijitamdubey.site" target="_blank" rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "var(--lp-muted)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--lp-accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--lp-muted)")}>
                Abhijitam
              </a>
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
