import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const BOKEH = [
  { id: 0, w: 280, top: "8%",  left: "3%",  dur: 13, d: 0   },
  { id: 1, w: 180, top: "58%", left: "80%", dur: 11, d: 2   },
  { id: 2, w: 130, top: "28%", left: "68%", dur: 9,  d: 1   },
  { id: 3, w: 360, top: "72%", left: "15%", dur: 16, d: 3   },
  { id: 4, w: 90,  top: "42%", left: "45%", dur: 8,  d: 1.5 },
  { id: 5, w: 220, top: "82%", left: "58%", dur: 12, d: 0.5 },
  { id: 6, w: 65,  top: "12%", left: "88%", dur: 7,  d: 2.5 },
  { id: 7, w: 155, top: "3%",  left: "52%", dur: 10, d: 1   },
];

const MENU = {
  "Entrée": [
    { name: "Foie Gras Terrine",  desc: "Hudson Valley foie gras, Sauternes gelée, brioche toast, fresh micro herbs",       price: "₹3,200",  badge: "Chef's Choice" },
    { name: "Hokkaido Scallop",   desc: "Pan-seared with truffle butter, cauliflower purée, Osetra caviar, chervil oil",     price: "₹4,100",  badge: "" },
    { name: "Garden Crudités",    desc: "Burrata, roasted heirloom beetroot, hazelnut vinaigrette, edible flowers",          price: "₹2,400",  badge: "Vegetarian" },
  ],
  "Main": [
    { name: "Wagyu A5 Tenderloin", desc: "Japanese A5 wagyu, bone marrow jus, pommes fondant, seasonal field leaves",       price: "₹12,800", badge: "Signature" },
    { name: "Dover Sole Meunière", desc: "Whole Dover sole, capers, lemon beurre noisette, green asparagus, golden roe",    price: "₹8,500",  badge: "" },
    { name: "Mushroom Wellington", desc: "Wild mushroom duxelles en croûte, black truffle sauce, roasted root vegetables",  price: "₹5,600",  badge: "Vegetarian" },
  ],
  "Dessert": [
    { name: "Valrhona Soufflé",       desc: "Dark chocolate soufflé, warm vanilla crème anglaise, edible 24k gold leaf",    price: "₹1,800",  badge: "Signature" },
    { name: "Strawberry Mille-feuille",desc: "Caramelised puff pastry, Chantilly cream, fresh strawberries, rose water jelly",price: "₹1,500", badge: "" },
    { name: "Tarte Tatin",            desc: "Caramelised heirloom apple, crème fraîche, calvados ice cream, praline crumb", price: "₹1,600",  badge: "" },
  ],
};

const TESTIMONIALS = [
  {
    text: "An unparalleled dining experience that transcends the ordinary. Every dish tells a story of meticulous craftsmanship. Aurum has redefined what fine dining means in India.",
    name: "Priya Mehta", role: "Senior Food Critic, Times of India", init: "PM",
  },
  {
    text: "We celebrate every milestone at Aurum. The service is impeccable, the ambiance divine, the cuisine — extraordinary. It is the only address that never disappoints.",
    name: "Rajan Khosla", role: "Chairman, Citadel Group", init: "RK",
  },
  {
    text: "Aurum stands as a testament to what Indian fine dining can achieve on the global stage. Chef Kapoor's dedication to craft is evident in every single bite.",
    name: "Isabelle Fontaine", role: "Michelin Guide Contributor", init: "IF",
  },
];

const AWARDS = [
  "☆  One Michelin Star · 2023",
  "☆  Best Fine Dining India — Condé Nast Traveller · 2024",
  "☆  Chef of the Year — India Food Awards · 2023",
  "☆  Asia's 50 Best Restaurants · 2022",
  "☆  Outstanding Wine Programme — World Restaurant Awards",
  "☆  Best Ambiance — Food & Wine India · 2024",
];

const TIMES = ["7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM"];

// ═══════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════

const CSS = `
  :root {
    --gold: #C4A259; --gold-l: #E8D5A0; --gold-d: rgba(196,162,89,0.1);
    --bg: #0C0B08; --bg2: #111009; --card: #141210; --card2: #1B1916;
    --cream: #F0EBE3; --text: #CCC4B5; --muted: #7D6E5E;
    --border: #252017; --bord-l: rgba(196,162,89,0.2);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Cormorant Garamond', Georgia, serif; overflow-x: hidden; }
  button { background: none; border: none; cursor: pointer; font: inherit; }
  input, select, textarea { font: inherit; }

  .fd { font-family: 'Playfair Display', Georgia, serif; }
  .fs { font-family: 'Inter', system-ui, sans-serif; }

  .eyebrow {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase;
    color: var(--gold); display: block; margin-bottom: 20px;
  }
  .divider { height: 1px; border: none; background: linear-gradient(90deg, transparent, var(--gold) 40%, var(--gold) 60%, transparent); }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 56px; height: 88px;
    transition: all .45s cubic-bezier(.4,0,.2,1);
  }
  .nav.s {
    height: 70px;
    background: rgba(12,11,8,.93); backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(196,162,89,.12);
  }
  @media (max-width: 900px) { .nav { padding: 0 24px; } .nav-links { display: none !important; } }

  .nav-link {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(240,235,227,.65); transition: color .2s;
  }
  .nav-link:hover { color: var(--gold); }

  /* BUTTONS */
  .btn {
    font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: .2em; text-transform: uppercase; padding: 13px 30px;
    transition: all .3s cubic-bezier(.4,0,.2,1);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-p { background: var(--gold); color: var(--bg); }
  .btn-p:hover { background: var(--gold-l); transform: translateY(-2px); box-shadow: 0 10px 36px rgba(196,162,89,.22); }
  .btn-g { background: transparent; color: var(--gold); border: 1px solid var(--gold); }
  .btn-g:hover { background: var(--gold-d); transform: translateY(-2px); }

  /* KEYFRAMES */
  @keyframes drift {
    0%,100% { transform: translate(0,0); opacity: .15; }
    33%      { transform: translate(18px,-22px); opacity: .3; }
    66%      { transform: translate(-12px,10px); opacity: .18; }
  }
  @keyframes shimmer { from { background-position: 200% center; } to { background-position: -200% center; } }
  @keyframes scroll-b { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
  @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes pg { 0%,100% { opacity:.3; transform: scale(1); } 50% { opacity:.9; transform: scale(1.3); } }
  @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }

  .bokeh {
    position: absolute; border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(196,162,89,.9) 0%, transparent 70%);
    filter: blur(45px);
    animation: drift var(--dur,10s) ease-in-out infinite;
    animation-delay: var(--d,0s);
  }
  .shimmer {
    background: linear-gradient(90deg, var(--gold) 0%, var(--gold-l) 30%, #FFF9EE 50%, var(--gold-l) 70%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 5s linear infinite;
  }
  .scroll-ind { animation: scroll-b 2.2s ease-in-out infinite; }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(26px); transition: opacity .9s cubic-bezier(.4,0,.2,1), transform .9s cubic-bezier(.4,0,.2,1); }
  .reveal.in { opacity: 1; transform: translateY(0); }
  .d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; } .d3 { transition-delay: .3s; }
  .d4 { transition-delay: .4s; } .d5 { transition-delay: .5s; } .d6 { transition-delay: .6s; }

  /* SECTION */
  .section { max-width: 1280px; margin: 0 auto; padding: 120px 56px; }
  @media (max-width: 768px) { .section { padding: 80px 24px; } }

  /* MENU */
  .tab-btn {
    font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 500;
    letter-spacing: .22em; text-transform: uppercase;
    padding: 10px 28px; border: 1px solid var(--border); color: var(--muted); transition: all .3s;
  }
  .tab-btn:hover { color: var(--cream); border-color: rgba(196,162,89,.35); }
  .tab-btn.active { color: var(--gold); border-color: var(--gold); background: var(--gold-d); }

  .mc {
    border-left: 1px solid var(--gold); padding: 24px 28px;
    background: var(--card); transition: background .3s, transform .3s;
    position: relative; overflow: hidden;
  }
  .mc::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(196,162,89,.05) 0%, transparent 60%);
    opacity: 0; transition: opacity .3s;
  }
  .mc:hover { background: var(--card2); transform: translateX(4px); }
  .mc:hover::before { opacity: 1; }

  /* GALLERY */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 280px 280px 220px;
    gap: 10px;
  }
  @media (max-width: 900px) {
    .gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 200px 200px 200px 160px;
    }
    .gc-span-col { grid-column: 1 / 3 !important; grid-row: auto !important; }
    .gc-span-row { grid-column: auto !important; grid-row: auto !important; }
  }
  .gc { overflow: hidden; position: relative; cursor: pointer; background: var(--card); }
  .gc .art { width: 100%; height: 100%; transition: transform .65s cubic-bezier(.4,0,.2,1); }
  .gc:hover .art { transform: scale(1.06); }
  .gc .ov {
    position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 18px;
    background: linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%);
    opacity: 0; transition: opacity .4s;
  }
  .gc:hover .ov { opacity: 1; }

  /* AWARDS */
  .marquee-track { display: flex; animation: marquee 32s linear infinite; white-space: nowrap; }

  /* TESTIMONIALS */
  .tc { background: var(--card); padding: 36px; border: 1px solid var(--border); transition: border-color .3s, background .3s; position: relative; }
  .tc:hover { border-color: var(--bord-l); background: var(--card2); }

  /* FORM */
  .form-field {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 17px; padding: 14px 16px; outline: none;
    transition: border-color .25s; -webkit-appearance: none; appearance: none;
  }
  .form-field:focus { border-color: var(--gold); }
  .form-field::placeholder { color: var(--muted); font-style: italic; }
  .form-field option { background: var(--card); color: var(--cream); }
  .fl {
    font-family: 'Inter', system-ui, sans-serif; font-size: 10px;
    font-weight: 500; letter-spacing: .22em; text-transform: uppercase;
    color: var(--muted); display: block; margin-bottom: 8px;
  }

  /* FOOTER */
  .flink { font-family: 'Inter', system-ui, sans-serif; font-size: 12px; color: var(--muted); transition: color .2s; text-align: left; padding: 0; }
  .flink:hover { color: var(--gold); }

  /* RESPONSIVE GRIDS */
  @media (max-width: 900px) {
    .story-grid   { grid-template-columns: 1fr !important; }
    .testi-grid   { grid-template-columns: 1fr !important; }
    .res-grid     { grid-template-columns: 1fr !important; }
    .footer-grid  { grid-template-columns: 1fr 1fr !important; }
    .stats-grid   { gap: 28px !important; }
    .mc-inner     { flex-direction: column !important; gap: 8px !important; }
    .story-art    { display: none !important; }
  }
  @media (max-width: 600px) {
    .footer-grid  { grid-template-columns: 1fr !important; }
    .form-2col    { grid-template-columns: 1fr !important; }
    .form-3col    { grid-template-columns: 1fr 1fr !important; }
    .hero-btns    { flex-direction: column !important; align-items: center !important; }
  }
`;

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

function useScrolled() {
  const [s, set] = useState(false);
  useEffect(() => {
    const h = () => set(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return s;
}

function useReveal() {
  const ref = useRef(null);
  const [v, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { set(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

// ═══════════════════════════════════════════════════════════════
// REVEAL WRAPPER
// ═══════════════════════════════════════════════════════════════

function R({ c = "", d = "", children }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} className={`reveal ${v ? "in" : ""} ${d} ${c}`}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════

function Nav({ scrolled, onReserve }) {
  return (
    <nav className={`nav ${scrolled ? "s" : ""}`}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, transparent, var(--gold) 30%, var(--gold) 70%, transparent)" }} />
        <div>
          <div className="fd" style={{ fontSize: 20, letterSpacing: "0.42em", color: "var(--cream)", fontWeight: 500, lineHeight: 1 }}>AURUM</div>
          <div className="fs" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", marginTop: 3, opacity: 0.85 }}>FINE DINING</div>
        </div>
        <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, transparent, var(--gold) 30%, var(--gold) 70%, transparent)" }} />
      </div>

      {/* Links */}
      <div className="nav-links" style={{ display: "flex", gap: 40 }}>
        {["Our Story", "Menu", "Gallery", "Reserve"].map(l => (
          <button key={l} className="nav-link">{l}</button>
        ))}
      </div>

      {/* CTA */}
      <button className="btn btn-p" onClick={onReserve}>Reserve Table</button>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════

function Hero({ onReserve }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 120); return () => clearTimeout(t); }, []);

  const show = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .85s ${delay}s cubic-bezier(.4,0,.2,1), transform .85s ${delay}s cubic-bezier(.4,0,.2,1)`,
  });

  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Warm ambient background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 55%, rgba(100,60,18,.38) 0%, transparent 55%), radial-gradient(ellipse at 72% 20%, rgba(80,45,10,.22) 0%, transparent 48%), var(--bg)" }} />

      {/* Bokeh orbs */}
      {BOKEH.map(b => (
        <div key={b.id} className="bokeh" style={{ width: b.w, height: b.w, top: b.top, left: b.left, "--dur": `${b.dur}s`, "--d": `${b.d}s`, opacity: 0.18 }} />
      ))}

      {/* Subtle center line */}
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(196,162,89,.12) 30%, rgba(196,162,89,.12) 70%, transparent 100%)", pointerEvents: "none" }} />

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 920 }}>
        <div style={show(0.2)}>
          <span className="eyebrow" style={{ marginBottom: 30 }}>Established 2018 · Mumbai, India</span>
        </div>

        <div style={show(0.4)}>
          <h1 className="fd" style={{ fontSize: "clamp(50px, 9vw, 110px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.07, color: "var(--cream)", marginBottom: 0 }}>
            Where Cuisine
          </h1>
        </div>

        <div style={show(0.52)}>
          <h1 className="fd shimmer" style={{ fontSize: "clamp(50px, 9vw, 110px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.07, marginBottom: 32 }}>
            Becomes Art
          </h1>
        </div>

        <div style={show(0.72)}>
          <p style={{ fontSize: 20, color: "var(--muted)", lineHeight: 1.85, maxWidth: 500, margin: "0 auto 46px" }}>
            A sanctuary of fine dining where each dish is a masterpiece, each evening an unforgettable memory.
          </p>
        </div>

        <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", ...show(0.9) }}>
          <button className="btn btn-p" onClick={onReserve}>Reserve a Table</button>
          <button className="btn btn-g">Explore Menu</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 38, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: loaded ? 0.55 : 0, transition: "opacity 1.2s 1.4s" }}>
        <span className="fs scroll-ind" style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted)" }}>Scroll</span>
        <div className="scroll-ind" style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
      </div>

      {/* Fade to next section */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to bottom, transparent, var(--bg))", pointerEvents: "none" }} />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// STORY SECTION
// ═══════════════════════════════════════════════════════════════

function StorySection() {
  return (
    <section style={{ background: "var(--bg2)", padding: "140px 0" }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "center" }}>
          {/* Text */}
          <div>
            <R><span className="eyebrow">Our Philosophy</span></R>
            <R d="d1">
              <h2 className="fd" style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", color: "var(--cream)", lineHeight: 1.15, marginBottom: 32 }}>
                The Art of the<br />Perfect Meal
              </h2>
            </R>
            <R d="d2">
              <p style={{ fontSize: 19, color: "var(--text)", lineHeight: 1.88, marginBottom: 22 }}>
                At Aurum, we believe dining is not merely eating — it is a journey. Each plate is the result of obsessive sourcing, relentless refinement, and a reverence for the finest ingredients the world offers.
              </p>
            </R>
            <R d="d3">
              <p style={{ fontSize: 19, color: "var(--muted)", lineHeight: 1.88, marginBottom: 48 }}>
                Our chef, Arnav Kapoor, trained under legends in Paris and Tokyo, brings a singular vision to every season: to honour the ingredient, to elevate the moment, to leave every guest transformed.
              </p>
            </R>
            <R d="d4">
              <div className="stats-grid" style={{ display: "flex", gap: 56 }}>
                {[["12+", "Years of Mastery"], ["3,200+", "Memorable Evenings"], ["97%", "Return Guests"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="fd" style={{ fontSize: 40, fontWeight: 500, color: "var(--gold)", lineHeight: 1 }}>{n}</div>
                    <div className="fs" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginTop: 8 }}>{l}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>

          {/* CSS Art */}
          <R d="d2" c="story-art">
            <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--card)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 35%, rgba(100,60,15,.4) 0%, transparent 55%), radial-gradient(ellipse at 68% 70%, rgba(60,20,8,.5) 0%, transparent 50%), #100E0B" }} />

              {/* Plate composition */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "58%", aspectRatio: "1", borderRadius: "50%", border: "1.5px solid rgba(196,162,89,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "60%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #2D1C0E, #180E08)", boxShadow: "inset 0 2px 16px rgba(0,0,0,.7)" }} />
              </div>

              {/* Table line */}
              <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", width: "70%", height: 1.5, background: "rgba(196,162,89,.22)" }} />
              <div style={{ position: "absolute", bottom: "10%", left: "32%", width: 1.5, height: "10%", background: "rgba(196,162,89,.15)" }} />
              <div style={{ position: "absolute", bottom: "10%", left: "65%", width: 1.5, height: "10%", background: "rgba(196,162,89,.15)" }} />

              {/* Candle flicker */}
              <div style={{ position: "absolute", top: "16%", right: "22%", width: 6, height: 18, background: "linear-gradient(to top, rgba(255,140,40,.6), rgba(255,220,80,.35))", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", filter: "blur(2px)" }} />
              <div style={{ position: "absolute", top: "13%", right: "20%", width: 14, height: 22, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,50,.22) 0%, transparent 70%)", filter: "blur(6px)" }} />

              {/* Gold accent dots */}
              {[[14, 22], [76, 36], [24, 74], [82, 68], [50, 11]].map(([l, t], i) => (
                <div key={i} style={{ position: "absolute", left: `${l}%`, top: `${t}%`, width: 3, height: 3, borderRadius: "50%", background: "var(--gold)", opacity: 0.5 + i * 0.1, animation: `pg ${2.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.35}s` }} />
              ))}

              {/* Corner brackets */}
              <div style={{ position: "absolute", top: 10, left: 10, width: 22, height: 22, borderTop: "1px solid var(--gold)", borderLeft: "1px solid var(--gold)", opacity: 0.45 }} />
              <div style={{ position: "absolute", bottom: 10, right: 10, width: 22, height: 22, borderBottom: "1px solid var(--gold)", borderRight: "1px solid var(--gold)", opacity: 0.45 }} />
              <div style={{ position: "absolute", inset: 22, border: "1px solid rgba(196,162,89,.07)" }} />

              {/* Warm light source */}
              <div style={{ position: "absolute", top: "20%", left: "35%", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,100,20,.18) 0%, transparent 70%)", filter: "blur(22px)", pointerEvents: "none" }} />
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU SECTION
// ═══════════════════════════════════════════════════════════════

function MenuSection({ activeTab, setActiveTab }) {
  return (
    <section style={{ padding: "140px 0" }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <R>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow">Culinary Excellence</span>
            <h2 className="fd" style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", color: "var(--cream)" }}>
              Our Menu
            </h2>
          </div>
        </R>

        <R d="d1">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            {Object.keys(MENU).map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </R>

        <div style={{ display: "grid", gap: 12 }}>
          {MENU[activeTab].map((item, i) => (
            <R key={item.name + activeTab} d={`d${i + 1}`}>
              <div className="mc">
                <div className="mc-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
                      <span className="fd" style={{ fontSize: 22, color: "var(--cream)", fontWeight: 500 }}>{item.name}</span>
                      {item.badge && (
                        <span className="fs" style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", padding: "3px 10px", border: "1px solid rgba(196,162,89,.3)", flexShrink: 0 }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                  <div className="fd" style={{ fontSize: 22, color: "var(--gold)", fontWeight: 500, whiteSpace: "nowrap", paddingTop: 4 }}>{item.price}</div>
                </div>
              </div>
            </R>
          ))}
        </div>

        <R d="d5">
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <hr className="divider" style={{ maxWidth: 280, margin: "0 auto 28px" }} />
            <p className="fs" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.06em", lineHeight: 1.8 }}>
              All prices exclude taxes · Tasting menus available upon request<br />
              Dietary requirements accommodated with 24 hrs notice
            </p>
          </div>
        </R>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// GALLERY SECTION
// ═══════════════════════════════════════════════════════════════

function GallerySection() {
  const [hov, setHov] = useState(null);

  const cells = [
    {
      id: 0, label: "The Kitchen",
      style: { gridColumn: "1/3", gridRow: "1/3" },
      mobileClass: "gc-span-col",
      render: () => (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 38% 42%, rgba(110,60,15,.45) 0%, transparent 52%), radial-gradient(ellipse at 65% 65%, rgba(70,30,8,.4) 0%, transparent 48%), #0E0C08" }}>
          <div style={{ position: "absolute", top: "32%", left: "38%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,100,20,.28) 0%, transparent 70%)", filter: "blur(30px)" }} />
          <div style={{ position: "absolute", top: "55%", left: "18%", width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,162,89,.12) 0%, transparent 70%)", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", bottom: "14%", left: "50%", transform: "translateX(-50%)", width: "55%", height: 1.5, background: "rgba(196,162,89,.2)" }} />
          <div style={{ position: "absolute", bottom: "8%", left: "35%", width: 1.5, height: "10%", background: "rgba(196,162,89,.15)" }} />
          <div style={{ position: "absolute", bottom: "8%", left: "62%", width: 1.5, height: "10%", background: "rgba(196,162,89,.15)" }} />
          <div style={{ position: "absolute", top: "24%", left: "46%", width: 7, height: 14, background: "linear-gradient(to top, rgba(255,140,40,.65), rgba(255,220,80,.38))", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", filter: "blur(2px)" }} />
          <div style={{ position: "absolute", top: "20%", left: "44%", width: 16, height: 22, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,50,.2) 0%, transparent 70%)", filter: "blur(7px)" }} />
          <div style={{ position: "absolute", top: 14, left: 14, width: 26, height: 26, borderTop: "1px solid rgba(196,162,89,.4)", borderLeft: "1px solid rgba(196,162,89,.4)" }} />
          <div style={{ position: "absolute", bottom: 14, right: 14, width: 26, height: 26, borderBottom: "1px solid rgba(196,162,89,.4)", borderRight: "1px solid rgba(196,162,89,.4)" }} />
        </div>
      ),
    },
    {
      id: 1, label: "Saffron Dusk",
      style: { gridColumn: "3", gridRow: "1" },
      mobileClass: "gc-span-row",
      render: () => (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(148deg, #1E1208 0%, #0E0B08 55%, #0C0B08 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 22% 88%, rgba(200,120,20,.25) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "50%", aspectRatio: "1", borderRadius: "50%", border: "1px solid rgba(196,162,89,.14)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "30%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,100,20,.2) 0%, transparent 70%)", filter: "blur(4px)" }} />
        </div>
      ),
    },
    {
      id: 2, label: "Noir & Marble",
      style: { gridColumn: "3", gridRow: "2" },
      mobileClass: "gc-span-row",
      render: () => (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, #1A1815 0%, #0C0B08 100%)" }}>
          {[[20, 0.06, "20deg"], [45, 0.04, "-6deg"], [70, 0.05, "12deg"]].map(([t, o, r], i) => (
            <div key={i} style={{ position: "absolute", top: `${t}%`, left: "8%", right: "25%", height: 1, background: `rgba(240,235,227,${o})`, transform: `rotate(${r})` }} />
          ))}
          <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 3, height: 3, borderRadius: "50%", background: "var(--gold)", opacity: 0.7 }} />
        </div>
      ),
    },
    {
      id: 3, label: "Vineyard Dusk",
      style: { gridColumn: "1", gridRow: "3" },
      mobileClass: "gc-span-row",
      render: () => (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(138deg, #140810 0%, #0C0508 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 28%, rgba(140,20,60,.2) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)", width: "38%", paddingBottom: "40%", borderRadius: "0 0 50% 50%", border: "1px solid rgba(196,162,89,.18)", background: "rgba(100,15,40,.18)" }} />
          <div style={{ position: "absolute", top: "62%", left: "49.5%", width: 2, height: "18%", background: "rgba(196,162,89,.18)" }} />
          <div style={{ position: "absolute", top: "80%", left: "40%", width: "22%", height: 1.5, background: "rgba(196,162,89,.18)" }} />
        </div>
      ),
    },
    {
      id: 4, label: "The Terrace",
      style: { gridColumn: "2/4", gridRow: "3" },
      mobileClass: "gc-span-col",
      render: () => (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0A0C12, #0C0B08)" }}>
          {[[8,12],[18,8],[32,18],[45,6],[55,20],[65,10],[78,15],[88,8],[93,22],[25,30],[42,14],[70,28]].map(([l, t], i) => (
            <div key={i} style={{ position: "absolute", left: `${l}%`, top: `${t}%`, width: i % 3 === 0 ? 2 : 1.5, height: i % 3 === 0 ? 2 : 1.5, borderRadius: "50%", background: `rgba(255,255,255,${0.28 + i * 0.04})` }} />
          ))}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(180,90,20,.12), transparent)" }} />
          {[[8, 62], [22, 52], [38, 68], [52, 56], [66, 62], [80, 58], [90, 66]].map(([l, h], i) => (
            <div key={i} style={{ position: "absolute", bottom: 0, left: `${l}%`, width: "9%", height: `${h}%`, background: "rgba(0,0,0,.45)" }} />
          ))}
          <div style={{ position: "absolute", top: "14%", right: "12%", width: 20, height: 20, borderRadius: "50%", background: "rgba(230,215,170,.1)", border: "1px solid rgba(230,215,170,.14)" }} />
        </div>
      ),
    },
  ];

  return (
    <section style={{ background: "var(--bg2)", paddingBottom: 0 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 56px 0" }}>
        <R>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="eyebrow">The Experience</span>
            <h2 className="fd" style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", color: "var(--cream)" }}>
              An Evening at Aurum
            </h2>
          </div>
        </R>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 56px 0" }}>
        <R>
          <div className="gallery-grid">
            {cells.map(cell => (
              <div
                key={cell.id}
                className={`gc ${cell.mobileClass}`}
                style={cell.style}
                onMouseEnter={() => setHov(cell.id)}
                onMouseLeave={() => setHov(null)}
              >
                <div className="art" style={{ position: "relative", width: "100%", height: "100%" }}>
                  {cell.render()}
                </div>
                <div className="ov">
                  <span className="fs" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>{cell.label}</span>
                </div>
              </div>
            ))}
          </div>
        </R>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// AWARDS MARQUEE
// ═══════════════════════════════════════════════════════════════

function AwardsStrip() {
  const doubled = [...AWARDS, ...AWARDS];
  return (
    <div style={{ background: "var(--card)", borderTop: "1px solid rgba(196,162,89,.1)", borderBottom: "1px solid rgba(196,162,89,.1)", padding: "17px 0", overflow: "hidden" }}>
      <div className="marquee-track">
        {doubled.map((a, i) => (
          <span key={i} className="fs" style={{ padding: "0 52px", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════

function TestimonialsSection() {
  return (
    <section style={{ background: "var(--bg2)", padding: "140px 0" }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <R>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span className="eyebrow">What Guests Say</span>
            <h2 className="fd" style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", color: "var(--cream)" }}>
              Voices of Aurum
            </h2>
          </div>
        </R>

        <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <R key={t.name} d={`d${i + 1}`}>
              <div className="tc" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 24 }}>
                  {[...Array(5)].map((_, s) => <span key={s} style={{ color: "var(--gold)", fontSize: 13 }}>★</span>)}
                </div>

                {/* Large opening quote */}
                <div className="fd" style={{ fontSize: 64, lineHeight: 0.7, color: "var(--gold)", opacity: 0.25, marginBottom: 16, fontStyle: "italic" }}>"</div>

                <p style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.82, marginBottom: 32, fontStyle: "italic", flex: 1 }}>
                  {t.text}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, rgba(196,162,89,.28), rgba(196,162,89,.08))", border: "1px solid rgba(196,162,89,.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="fd" style={{ fontSize: 14, color: "var(--gold)", fontWeight: 500 }}>{t.init}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, color: "var(--cream)", fontWeight: 500 }}>{t.name}</div>
                    <div className="fs" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em", marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESERVATION SECTION
// ═══════════════════════════════════════════════════════════════

function ReservationSection({ reserveRef, form, setForm, onSubmit, submitted }) {
  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <section ref={reserveRef} style={{ padding: "140px 0" }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="res-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "start" }}>
          {/* Info */}
          <div>
            <R><span className="eyebrow">Reserve Your Table</span></R>
            <R d="d1">
              <h2 className="fd" style={{ fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, fontStyle: "italic", color: "var(--cream)", lineHeight: 1.15, marginBottom: 32 }}>
                An Evening<br />Awaits You
              </h2>
            </R>
            <R d="d2">
              <p style={{ fontSize: 19, color: "var(--muted)", lineHeight: 1.88, marginBottom: 52 }}>
                Reserve your table at Aurum and allow us to craft an evening tailored precisely to your desires. Our concierge team is available to assist with every detail.
              </p>
            </R>
            <R d="d3">
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  ["Dining Hours", "Tuesday – Sunday\n7:00 PM – 11:00 PM"],
                  ["Location", "The Taj Mahal Tower, Apollo Bunder\nMumbai, Maharashtra 400001"],
                  ["Contact", "+91 22 6665 3366\nreservations@aurum.in"],
                ].map(([label, value]) => (
                  <div key={label} style={{ borderLeft: "1px solid rgba(196,162,89,.28)", paddingLeft: 22 }}>
                    <div className="fs" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 7 }}>{label}</div>
                    <div style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.75, whiteSpace: "pre-line" }}>{value}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>

          {/* Form */}
          <R d="d2">
            <div style={{ background: "var(--card)", padding: "48px", border: "1px solid var(--border)" }}>
              <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="fl">Full Name</label>
                  <input className="form-field" placeholder="Your name" value={form.name} onChange={f("name")} />
                </div>
                <div>
                  <label className="fl">Phone</label>
                  <input className="form-field" placeholder="+91 98765 43210" value={form.phone} onChange={f("phone")} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="fl">Email Address</label>
                <input className="form-field" type="email" placeholder="your@email.com" value={form.email} onChange={f("email")} />
              </div>

              <div className="form-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="fl">Date</label>
                  <input className="form-field" type="date" value={form.date} onChange={f("date")} style={{ colorScheme: "dark" }} />
                </div>
                <div>
                  <label className="fl">Time</label>
                  <select className="form-field" value={form.time} onChange={f("time")}>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fl">Guests</label>
                  <select className="form-field" value={form.guests} onChange={f("guests")}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label className="fl">Special Requests</label>
                <textarea className="form-field" rows={3} placeholder="Allergies, celebrations, special arrangements…" value={form.notes} onChange={f("notes")} style={{ resize: "vertical" }} />
              </div>

              <button
                className="btn btn-p"
                style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "16px 30px", background: submitted ? "rgba(196,162,89,.6)" : "var(--gold)" }}
                onClick={onSubmit}
              >
                {submitted ? "✓  Reservation Request Sent" : "Confirm Reservation"}
              </button>

              {submitted && (
                <div style={{ marginTop: 16, padding: "14px 20px", background: "rgba(196,162,89,.08)", border: "1px solid rgba(196,162,89,.25)", textAlign: "center" }}>
                  <p className="fs" style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.08em", lineHeight: 1.7 }}>
                    Thank you. Our team will confirm within 2 hours.
                  </p>
                </div>
              )}

              <p className="fs" style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 20, lineHeight: 1.65 }}>
                For parties of 9 or more, please call us directly.<br />
                Cancellations accepted up to 24 hrs in advance.
              </p>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════

function Footer() {
  return (
    <footer style={{ background: "#080706", padding: "80px 0 40px", borderTop: "1px solid rgba(196,162,89,.1)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 56px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 56, marginBottom: 72, paddingBottom: 60, borderBottom: "1px solid var(--border)" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }} />
              <div>
                <div className="fd" style={{ fontSize: 18, letterSpacing: "0.42em", color: "var(--cream)", fontWeight: 500, lineHeight: 1 }}>AURUM</div>
                <div className="fs" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", marginTop: 2 }}>FINE DINING</div>
              </div>
              <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }} />
            </div>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.82, maxWidth: 280, marginBottom: 32 }}>
              A sanctuary of fine dining in the heart of Mumbai. Where every meal becomes a memory.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["IG", "FB", "TW", "YT"].map(s => (
                <div key={s} style={{ width: 34, height: 34, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color .2s" }}>
                  <span className="fs" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.05em" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div className="fs" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Navigate</div>
            {["Our Story", "Menu", "Gallery", "Events", "Press"].map(l => (
              <button key={l} className="flink" style={{ display: "block", marginBottom: 12 }}>{l}</button>
            ))}
          </div>

          {/* Reserve */}
          <div>
            <div className="fs" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Reserve</div>
            {["Book a Table", "Private Dining", "Wine Programme", "Gift Vouchers", "Tasting Menu"].map(l => (
              <button key={l} className="flink" style={{ display: "block", marginBottom: 12 }}>{l}</button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="fs" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Contact</div>
            <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
              <div>The Taj Mahal Tower</div>
              <div>Apollo Bunder</div>
              <div>Mumbai 400 001</div>
              <div style={{ marginTop: 16 }}>+91 22 6665 3366</div>
              <div>reservations@aurum.in</div>
              <div style={{ marginTop: 16, color: "rgba(125,110,94,.7)" }}>Tue–Sun: 7:00 – 11:00 PM</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p className="fs" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>
            © {new Date().getFullYear()} Aurum Fine Dining Pvt. Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <button key={l} className="fs flink" style={{ fontSize: 11, letterSpacing: "0.04em" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════

export default function AurumRestaurant() {
  const scrolled = useScrolled();
  const [activeMenu, setActiveMenu] = useState("Entrée");
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "7:30 PM", guests: "2", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const reserveRef = useRef(null);

  const handleReserve = () => {
    reserveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = () => {
    if (form.name && form.email && form.date) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Nav scrolled={scrolled} onReserve={handleReserve} />
        <Hero onReserve={handleReserve} />
        <StorySection />
        <MenuSection activeTab={activeMenu} setActiveTab={setActiveMenu} />
        <GallerySection />
        <AwardsStrip />
        <TestimonialsSection />
        <ReservationSection
          reserveRef={reserveRef}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          submitted={submitted}
        />
        <Footer />
      </div>
    </>
  );
}
