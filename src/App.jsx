import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, GripHorizontal, ArrowUpRight } from 'lucide-react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

    :root {
      --bg-cream: #FFF8DC;
      --bg-warm-cream: #FDF8EB;
      --bg-hero: #FFFDF3;
      --bg-pale-blue: #DDF1FF;
      --bg-pink: #FFF0F0;
      --bg-blue: #55A9E8;
      --bg-dark: #171717;
      
      --accent-purple: #4318FF;
      --accent-lavender: #C9B7FF;
      --accent-sky: #9ED8F5;
      --accent-bright-blue: #4C9BE8;
      --accent-soft-pink: #F9E4E7;
      --accent-coral: #F28C82;
      --accent-mint: #B9DCCF;
      --accent-yellow: #F4D35E;
      --accent-orange: #F28C38;
      
      --text-dark: #171717;
      --text-secondary: #555555;
      --white: #FFFFFF;
    }

    html { scroll-behavior: smooth; }

    body {
      background-color: var(--bg-cream);
      color: var(--text-dark);
      font-family: 'Instrument Sans', sans-serif;
      overflow-x: hidden;
      width: 100%;
      cursor: none; 
    }

    @media (max-width: 768px) {
      body { cursor: auto; }
    }

    .font-serif { font-family: 'DM Serif Display', serif; }
    .font-instrument { font-family: 'Instrument Sans', sans-serif; }
    .font-mono { font-family: 'Space Mono', monospace; }
    .font-handwriting { font-family: 'Caveat', cursive; }

    .full-section { width: 100%; }
    .section-inner {
      width: min(1400px, calc(100% - 80px));
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .section-inner { width: calc(100% - 32px); }
    }

    .paper-grid {
      background-image: 
        linear-gradient(rgba(108, 38, 232, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(108, 38, 232, 0.08) 1px, transparent 1px);
      background-size: 32px 32px;
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    .purple-grid {
      background-image: 
        linear-gradient(rgba(67, 24, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(67, 24, 255, 0.06) 1px, transparent 1px);
      background-size: 48px 48px;
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    .hard-shadow { box-shadow: 6px 6px 0px var(--text-dark); }
    .hard-shadow-sm { box-shadow: 4px 4px 0px var(--text-dark); }
    .hard-shadow-hover:hover {
      box-shadow: 8px 8px 0px var(--text-dark);
      transform: translate(-2px, -2px);
    }
    
    .writing-vertical {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }

    .scalloped-edge {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 20'%3E%3Cpath d='M0,20 Q10,0 20,20 Q30,0 40,20 Z' fill='white'/%3E%3C/svg%3E");
      background-size: 40px 20px;
      background-repeat: repeat-x;
      background-position: bottom;
    }

    .receipt-edge-top {
      background-image: radial-gradient(circle at 6px 0, transparent 6px, white 7px);
      background-size: 12px 12px;
      background-repeat: repeat-x;
      height: 8px;
    }
    
    .receipt-edge-bottom {
      background-image: radial-gradient(circle at 6px 8px, transparent 6px, white 7px);
      background-size: 12px 12px;
      background-repeat: repeat-x;
      height: 8px;
      transform: rotate(180deg);
    }

    ::-webkit-scrollbar { width: 0px; background: transparent; }
  `}</style>
);

const CursorContext = createContext();

const CustomCursor = () => {
  const { cursorState, cursorText } = useContext(CursorContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    if (isMobile) return;
    const updateMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [isMobile]);

  if (isMobile) return null;

  const variants = {
    default: { x: mousePos.x - 8, y: mousePos.y - 8, width: 16, height: 16, backgroundColor: "var(--text-dark)", mixBlendMode: "normal" },
    hover: { x: mousePos.x - 24, y: mousePos.y - 24, width: 48, height: 48, backgroundColor: "transparent", border: "2px solid var(--accent-purple)", mixBlendMode: "difference" },
    view: { x: mousePos.x - 40, y: mousePos.y - 40, width: 80, height: 80, backgroundColor: "var(--accent-purple)", border: "2px solid var(--text-dark)", mixBlendMode: "normal" },
    text: { x: mousePos.x - 40, y: mousePos.y - 40, width: 80, height: 80, backgroundColor: "var(--accent-coral)", border: "2px solid var(--text-dark)", mixBlendMode: "normal" }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center text-white font-instrument font-bold text-xs tracking-wider"
      variants={variants}
      animate={cursorState}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <AnimatePresence>
        {(cursorState === "view" || cursorState === "text") && (
          <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
            {cursorText || (cursorState === "view" ? "VIEW" : "")}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Navbar = ({ currentPath, navigate, onOpenContact }) => {
  const { setCursorState } = useContext(CursorContext);
  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }}
      className="fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-dark rounded-full h-[46px] w-[max-content] min-w-[280px] md:min-w-[400px] px-1.5 flex items-center justify-between shadow-[0_8px_25px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center gap-2 pr-4 border-r-2 border-gray-100 cursor-pointer h-full ml-1" onClick={() => navigate('home')} onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}>
        <div className="w-[24px] h-[24px] rounded-full border-2 border-dark overflow-hidden bg-[var(--accent-purple)]">
           <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Soukhya" className="w-full h-full object-cover grayscale" />
        </div>
        <span className="font-instrument font-bold text-[var(--accent-purple)] text-xs tracking-wide">Soukhya</span>
      </div>
      <div className="flex items-center gap-4 px-4 hidden md:flex">
        {['Work', 'Playground', 'About', 'Resume'].map(item => (
          <button key={item} onClick={() => navigate(item.toLowerCase())} onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")} className="text-xs font-semibold text-dark/70 hover:text-dark transition-colors">
            {item}
          </button>
        ))}
      </div>
      <button 
        onClick={onOpenContact}
        onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}
        className="group bg-[var(--accent-purple)] text-white text-[11px] uppercase tracking-wider font-bold pl-4 pr-3 h-[32px] rounded-full border-2 border-dark hover:bg-[#320EC2] transition-colors hard-shadow-sm ml-2 md:ml-0 flex items-center gap-1.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#171717]"
      >
        Let's talk
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </motion.nav>
  );
};

const HeroReceiptCard = () => {
  const { setCursorState } = useContext(CursorContext);
  return (
    <motion.div 
      drag
      whileHover={{ scale: 1.02, rotate: 2 }}
      onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}
      className="bg-white border-x-2 border-dark max-w-[280px] md:max-w-[320px] w-full relative rotate-[4deg] cursor-grab active:cursor-grabbing font-mono text-dark hard-shadow z-10"
    >
       <div className="receipt-edge-top w-full border-t-2 border-dark"></div>
       <div className="px-6 py-5">
          <div className="text-center border-b-2 border-dashed border-dark/20 pb-4 mb-4">
             <h3 className="font-bold text-sm tracking-widest text-dark">SOUKHYA STUDIO</h3>
             <p className="text-[10px] text-dark/60 mt-1">Design Supplies</p>
          </div>
          
          <div className="flex justify-between text-[10px] mb-4 text-dark/80">
             <div className="flex flex-col"><span className="text-dark/50">Date:</span><span>2026</span></div>
             <div className="flex flex-col text-right"><span className="text-dark/50">Cashier:</span><span>@soukhya</span></div>
          </div>

          <div className="space-y-1.5 text-[11px] border-b-2 border-dashed border-dark/20 pb-4 mb-4 font-semibold text-dark/80">
             <div className="flex justify-between"><span>01 UI Design</span><span>$450.45</span></div>
             <div className="flex justify-between"><span>02 UX Design</span><span>$550.99</span></div>
             <div className="flex justify-between"><span>03 Product Design</span><span>$640.85</span></div>
             <div className="flex justify-between"><span>04 Design Systems</span><span>$310.22</span></div>
             <div className="flex justify-between"><span>05 Prototyping</span><span>$540.52</span></div>
             <div className="flex justify-between"><span>06 Interaction Design</span><span>$400.58</span></div>
             <div className="flex justify-between"><span>07 User Flows</span><span>$441.21</span></div>
             <div className="flex justify-between"><span>08 Information Arch.</span><span>$565.44</span></div>
             <div className="flex justify-between"><span>09 Responsive Design</span><span>$333.00</span></div>
             <div className="flex justify-between"><span>10 Developer brain</span><span>$310.22</span></div>
          </div>
          
          <div className="flex justify-between text-[11px] font-bold text-dark">
            <div className="flex flex-col"><span>TAX:</span><span>TOTAL:</span></div>
            <div className="flex flex-col text-right">
              <span className="font-normal text-dark/60 text-[9px]">Zero for you cutie</span>
              <span className="text-sm">$4543.48</span>
            </div>
          </div>

          <div className="text-center mt-6 text-dark">
             <p className="text-[10px] text-dark/60 mb-2">Rise and shine, it's<br/>a brand new day!</p>
             <p className="text-[11px] font-bold">THANK YOU!</p>
          </div>
          <div className="mt-4 flex flex-col items-center gap-1">
             <div className="h-8 w-full flex gap-1 justify-center opacity-80">
                {[1,3,1,2,1,1,4,2,1,2,1,3,1,2].map((w, i) => (
                  <div key={i} className="bg-dark h-full" style={{ width: `${w * 2}px` }}></div>
                ))}
             </div>
          </div>
       </div>
       <div className="receipt-edge-bottom w-full border-b-2 border-dark"></div>
    </motion.div>
  );
};

const SectionHero = () => {
  return (
    <section className="full-section bg-[var(--bg-warm-cream)] pt-[140px] md:pt-[180px] pb-24 relative min-h-[700px] md:min-h-[800px] flex flex-col items-center justify-center">
      
      <div className="absolute top-0 left-0 w-full h-6 z-20" style={{ backgroundImage: 'radial-gradient(circle at 16px 0px, var(--bg-pale-blue) 15px, transparent 16px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 left-0 w-full h-6 z-10 translate-y-[2px]" style={{ backgroundImage: 'radial-gradient(circle at 16px 0px, var(--text-dark) 15px, transparent 16px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="paper-grid opacity-60"></div>
      
      <div className="section-inner relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-[1100px] gap-12 lg:gap-0">
         
         <div className="flex flex-col items-start text-left z-20 flex-1 w-full">
            <p className="font-instrument text-[24px] md:text-[28px] text-dark mb-1">I'm a</p>
            
            <div className="font-serif italic text-[64px] md:text-[96px] leading-[0.95] text-[var(--accent-purple)] mb-2">
               <div className="block">Product-</div>
               <div className="block">focused</div>
            </div>
            
            <div className="font-serif italic text-[64px] md:text-[96px] leading-[0.95] text-dark">
               <div className="block">UI/UX</div>
               <div className="block">designer</div>
            </div>
            
            <p className="mt-8 text-[18px] md:text-[22px] text-dark/90 font-instrument max-w-[480px] leading-[1.3] font-medium">
               refining my craft, exploring trends, & building scalable, user-centered solutions with AI-driven workflows.
            </p>
            
            <button 
              onClick={() => document.getElementById('work').scrollIntoView()}
              className="group mt-10 bg-[var(--accent-purple)] hover:bg-[#320EC2] text-white rounded-full flex items-center p-1.5 pr-6 gap-3 shadow-lg transition-all border-2 border-dark hard-shadow-sm hover:-translate-y-1 hover:shadow-[6px_6px_0px_#171717]"
            >
               <div className="w-10 h-10 bg-[#5B33FF] border-2 border-dark rounded-full flex items-center justify-center group-hover:bg-[#471BE8] transition-colors">
                 <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </div>
               <span className="font-instrument font-bold text-base">See my work</span>
            </button>
         </div>

         <div className="z-10 flex-shrink-0 lg:mr-10">
            <HeroReceiptCard />
         </div>
         
      </div>
    </section>
  );
};

const SectionMarquee = () => {
  const items = ["PRODUCT DESIGN", "✦", "UI/UX", "✦", "COFFEE", "✦", "TYPOGRAPHY", "✦", "PROBLEM SOLVING", "✦", "SYSTEMS", "✦"];
  return (
    <section className="full-section bg-[var(--bg-cream)] border-y-2 border-dark h-[42px] md:h-[48px] overflow-hidden relative flex items-center">
      <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 25 }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className={`mx-6 text-[15px] md:text-[17px] font-bold ${item === '✦' ? 'text-[var(--accent-purple)]' : 'font-serif italic text-dark'}`}>{item}</span>
        ))}
      </motion.div>
    </section>
  );
};

const SectionDesignStories = () => {
  const { setCursorState } = useContext(CursorContext);
  const projects = [
    { id: "01", title: "FinDash", category: "Dashboard", color: "var(--accent-blue)", rot: "-2deg", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" },
    { id: "02", title: "Vitality", category: "Mobile App", color: "var(--accent-orange)", rot: "1deg", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" },
    { id: "03", title: "Aura", category: "E-Commerce", color: "var(--accent-purple)", rot: "-1deg", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
    { id: "04", title: "System", category: "Design System", color: "var(--bg-pink)", rot: "2deg", image: "https://images.unsplash.com/photo-1507238692062-5a0423c8ead8?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section id="work" className="full-section py-20 md:py-28 bg-[var(--bg-cream)]">
      <div className="section-inner">
        <div className="text-center mb-16">
          <h2 className="font-serif italic text-[42px] md:text-[56px] text-dark mb-3">Design Stories</h2>
          <p className="font-mono text-[11px] md:text-[13px] text-dark uppercase tracking-widest border-2 border-dark bg-white rounded-full px-4 py-1.5 inline-flex items-center gap-2 hard-shadow-sm font-bold">
            <Play className="w-3 h-3 fill-[var(--accent-purple)] stroke-[var(--accent-purple)]" /> Case studies / Visuals
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {projects.map((p, i) => (
            <motion.div 
              key={p.id} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              onMouseEnter={() => setCursorState("view")} onMouseLeave={() => setCursorState("default")}
              className="group relative cursor-pointer w-[240px] md:w-[260px] h-[300px] md:h-[320px]"
            >
              <div className="absolute inset-0 border-2 border-dark rounded-xl hard-shadow transition-transform duration-300 group-hover:!rotate-0 group-hover:translate-x-1 group-hover:translate-y-1" style={{ backgroundColor: p.color, transform: `rotate(${p.rot})` }}></div>
              <div className="relative bg-white border-2 border-dark rounded-xl h-full flex flex-col overflow-hidden transition-transform duration-300 group-hover:!rotate-0 group-hover:-translate-x-1 group-hover:-translate-y-1" style={{ transform: `rotate(${p.rot})` }}>
                <div className="bg-[var(--bg-cream)] border-b-2 border-dark p-2.5 flex gap-1.5 items-center">
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-coral)] border border-dark"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-yellow)] border border-dark"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-mint)] border border-dark"></div>
                   <span className="ml-auto text-[10px] font-mono font-bold text-dark uppercase">{p.title}.exe</span>
                </div>
                <div className="p-3 bg-white flex-1 border-b-2 border-dark">
                  <div className="w-full h-full bg-gray-100 rounded border-2 border-dark overflow-hidden relative">
                     <img src={p.image} alt={p.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                </div>
                <div className="p-4 bg-[var(--bg-hero)]">
                   <h3 className="font-instrument font-bold text-lg text-dark mb-0.5">{p.title}</h3>
                   <p className="text-[10px] font-mono text-dark/70 uppercase font-bold">{p.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionSkills = () => {
  const { setCursorState } = useContext(CursorContext);
  const skills = [
    { name: "UX Research", color: "var(--accent-coral)" }, { name: "UI/UX Design", color: "var(--accent-purple)" },
    { name: "Product Design", color: "var(--accent-yellow)" }, { name: "Design Systems", color: "var(--accent-mint)" },
    { name: "Prototyping", color: "var(--accent-orange)" }, { name: "No-Code", color: "var(--accent-blue)" },
    { name: "AI Design", color: "var(--accent-lavender)" }, { name: "Dev Handoff", color: "var(--bg-pink)" }
  ];

  return (
    <section className="full-section bg-[var(--bg-pink)] border-y-2 border-dark py-20 md:py-28 relative">
       <div className="paper-grid opacity-50"></div>
       <div className="section-inner relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[42px] md:text-[52px] italic text-dark mb-4">What I bring to the table <ArrowRight className="inline w-8 h-8 text-[var(--text-gray)] -rotate-12"/></h2>
            <p className="font-mono text-[11px] md:text-[13px] text-[var(--text-gray)] font-bold uppercase tracking-widest">A blend of product thinking & UI craft</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-[700px] mx-auto justify-items-center">
            {skills.map((skill, i) => (
              <motion.div 
                key={skill.name} whileHover={{ y: -6, scale: 1.05 }} onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}
                className="w-[85px] h-[85px] md:w-[95px] md:h-[95px] rounded-full bg-[var(--bg-cream)] border-2 border-dark hard-shadow flex flex-col items-center justify-center p-2 text-center cursor-pointer relative group"
                style={{ borderColor: skill.color, borderWidth: '3px', transform: `rotate(${i%2===0 ? -3 : 3}deg)` }}
              >
                <div className="absolute -bottom-3 right-0 w-10 h-0.5 bg-white border border-dark rotate-[35deg] shadow-sm"></div>
                <div className="absolute -bottom-4 right-2 w-10 h-0.5 bg-white border border-dark rotate-[35deg] shadow-sm"></div>
                <span className="font-instrument font-bold text-dark text-[11px] md:text-[13px] leading-tight group-hover:text-[var(--accent-purple)] transition-colors">{skill.name}</span>
              </motion.div>
            ))}
          </div>
       </div>
    </section>
  );
};

const SectionDeveloperDark = () => {
  return (
    <section className="full-section bg-[var(--text-dark)] py-20 md:py-28 border-b-2 border-dark">
      <div className="section-inner flex flex-col md:flex-row items-center gap-12 md:gap-16 max-w-[1000px] mx-auto">
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-serif text-[42px] md:text-[64px] italic leading-[1.1] text-[var(--bg-cream)]">
            Designing with a little bit of <span className="text-[var(--accent-purple)] italic">developer brain.</span>
          </h2>
        </div>
        <div className="flex-1 flex flex-wrap gap-3 font-mono text-[11px] md:text-sm items-center justify-center bg-white/5 p-8 rounded-2xl border border-white/10">
           <span className="px-3 py-1.5 text-[var(--bg-cream)] border border-[var(--bg-cream)]/40 rounded-full font-bold">FIGMA</span>
           <ArrowRight className="w-4 h-4 text-[var(--bg-cream)]/50" />
           <span className="px-3 py-1.5 text-[var(--bg-cream)] border border-[var(--bg-cream)]/40 rounded-full font-bold">COMPONENTS</span>
           <ArrowRight className="w-4 h-4 text-[var(--bg-cream)]/50" />
           <span className="px-3 py-1.5 bg-[var(--accent-purple)] text-white border border-[var(--accent-purple)] rounded-full font-bold">CODE</span>
           <ArrowRight className="w-4 h-4 text-[var(--bg-cream)]/50" />
           <span className="px-3 py-1.5 bg-[var(--accent-coral)] text-dark border border-[var(--accent-coral)] rounded-full font-bold">PRODUCT</span>
        </div>
      </div>
    </section>
  );
};

const SectionTools = () => {
  const { setCursorState } = useContext(CursorContext);
  const [isSpilled, setIsSpilled] = useState(false);

  const tools = [
    { type: 'text', name: "Claude", color: "var(--text-dark)", x: -280, y: -200, rot: -5, delay: 0.1 },
    { type: 'text', name: "FigJam", color: "#9747FF", x: -140, y: -230, rot: 5, delay: 0.15 },
    { type: 'text', name: "Webflow", color: "#4353FF", x: -180, y: -150, rot: -2, delay: 0.12 },
    { type: 'box', name: "Ai", bg: "#421600", text: "#FF9A00", x: -230, y: -140, rot: -8, delay: 0.18, size: 'w-10 h-10', radius: 'rounded-md' },
    { type: 'box', name: "WIX", bg: "black", text: "white", x: -120, y: -70, rot: 5, delay: 0.2, size: 'w-12 h-12', radius: 'rounded-lg' },
    { type: 'figma', x: -240, y: -60, rot: -12, delay: 0.22 },
    { type: 'box', name: "Xd", bg: "#470137", text: "#FF61F6", x: -320, y: 0, rot: 10, delay: 0.25, size: 'w-10 h-10', radius: 'rounded-md' },
    { type: 'text', name: "Spline", color: "var(--text-dark)", x: -200, y: 40, rot: 0, delay: 0.28 },
    { type: 'box', name: "Ps", bg: "#001E36", text: "#31A8FF", x: -260, y: 70, rot: -5, delay: 0.3, size: 'w-10 h-10', radius: 'rounded-md' },
    { type: 'jira', x: -130, y: 90, rot: 8, delay: 0.32 },
  ];

  return (
    <section className="full-section bg-white py-24 md:py-32 relative border-b-2 border-dark overflow-hidden min-h-[500px]">
       <div className="paper-grid opacity-50"></div>
       <div className="section-inner relative z-10 flex flex-col md:flex-row items-center justify-between max-w-[1000px] mx-auto">
         
         <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">
            <div className="font-serif italic text-[60px] md:text-[84px] leading-[0.9] flex flex-col items-start w-[max-content] mx-auto md:mx-0">
              <div className="text-dark ml-0">What</div>
              <div className="text-[var(--accent-purple)] ml-[35px] md:ml-[45px]">Tools</div>
              <div className="text-dark ml-[-5px] md:ml-[-8px] mt-1 md:mt-2">are in my</div>
              <div className="text-[var(--accent-purple)] ml-[55px] md:ml-[75px]">Bag?</div>
            </div>

            <p className="font-instrument text-lg text-dark/80 mt-8 max-w-[280px] leading-snug">
              A few things I use to turn ideas into experiences.
            </p>
            <div className="font-handwriting text-[var(--accent-purple)] text-2xl mt-5 flex items-center gap-2">
              hover the bag to tip it out <ArrowRight className="w-4 h-4" />
            </div>
         </div>

         <div 
            className="w-full md:w-1/2 relative flex justify-center md:justify-end items-center mt-24 md:mt-0 h-[400px]"
            onMouseEnter={() => { setIsSpilled(true); setCursorState("hover"); }}
            onMouseLeave={() => { setIsSpilled(false); setCursorState("default"); }}
         >
            <div className="absolute top-1/2 right-[180px] -translate-y-1/2 z-10 pointer-events-none hidden md:block">
              {tools.map((tool, i) => (
                <motion.div
                  key={i} initial={{ x: 0, y: 50, opacity: 0, scale: 0.2, rotate: 0 }}
                  animate={{ x: isSpilled ? tool.x : 0, y: isSpilled ? tool.y : 50, opacity: isSpilled ? 1 : 0, scale: isSpilled ? 1 : 0.2, rotate: isSpilled ? tool.rot : 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: isSpilled ? tool.delay : 0 }}
                  className="absolute left-0 top-0 flex items-center justify-center font-bold"
                >
                  {tool.type === 'text' && (
                    <div className="flex items-center gap-2 text-[22px] font-instrument font-medium tracking-tight" style={{ color: tool.color }}>
                      {tool.name === 'Claude' && <span className="text-[#D97757] text-3xl leading-none">✹</span>}
                      {tool.name === 'Spline' && <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF00FF] via-[#00FFFF] to-[#FF00FF]"></div>}
                      {tool.name === 'Webflow' && <span className="text-[#4353FF] font-serif italic text-2xl font-bold">W</span>}
                      {tool.name === 'FigJam' && <span className="text-[#9747FF] text-lg font-bold">✧</span>}
                      {tool.name}
                    </div>
                  )}
                  {tool.type === 'box' && (
                    <div className={`${tool.size} ${tool.radius} flex items-center justify-center text-sm hard-shadow-sm border-2 border-dark/10`} style={{ backgroundColor: tool.bg, color: tool.text }}>{tool.name}</div>
                  )}
                  {tool.type === 'figma' && (
                    <div className="w-14 h-14 bg-dark rounded-2xl flex flex-col items-center justify-center gap-0.5 hard-shadow-sm border-2 border-dark/10 p-2">
                       <div className="flex gap-0.5"><div className="w-3 h-3 bg-[#F24E1E] rounded-full"></div><div className="w-3 h-3 bg-[#FF7262] rounded-full"></div></div>
                       <div className="flex gap-0.5"><div className="w-3 h-3 bg-[#A259FF] rounded-full"></div><div className="w-3 h-3 bg-[#1ABCFE] rounded-full"></div></div>
                       <div className="w-3 h-3 bg-[#0ACF83] rounded-full mr-auto ml-1.5 mt-0.5"></div>
                    </div>
                  )}
                  {tool.type === 'jira' && (
                    <div className="w-16 h-16 bg-[#0052CC] rounded-2xl flex flex-col items-center justify-center hard-shadow-sm border-2 border-dark/10">
                       <div className="flex items-end gap-1 mb-1"><div className="w-2 h-4 bg-white rounded-sm"></div><div className="w-2 h-6 bg-white rounded-sm"></div></div>
                       <span className="text-white text-[10px] font-bold">Jira</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative z-20 origin-bottom"
              animate={{ rotate: isSpilled ? -75 : 0, x: isSpilled ? -60 : 0, y: isSpilled ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600" 
                alt="Tote Bag" 
                className="w-[260px] md:w-[320px] h-auto object-contain mix-blend-multiply transition-transform"
                style={{ filter: 'contrast(1.1) brightness(0.95)' }} draggable="false"
              />
            </motion.div>
         </div>
       </div>
    </section>
  );
};

const SectionGame = () => {
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const moveDot = () => {
    setPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
    setScore(s => s + 1);
  };

  return (
    <section className="full-section py-20 md:py-28 bg-[var(--bg-warm-cream)] border-b-2 border-dark">
       <div className="section-inner flex flex-col items-center">
          <h2 className="font-serif text-[28px] md:text-[36px] text-dark italic mb-8">Before you leave... fancy a game?</h2>
          <div className="w-full max-w-[850px]">
             <div className="flex justify-between font-mono text-[11px] md:text-[13px] font-bold text-dark mb-3">
               <span>Score: {score}</span>
               <span>Click the dot!</span>
             </div>
             <div className="w-full h-[280px] md:h-[340px] bg-white border-2 border-dark rounded-xl relative overflow-hidden hard-shadow">
               <div className="paper-grid opacity-30"></div>
               <motion.div 
                 onClick={moveDot} animate={{ left: `${pos.x}%`, top: `${pos.y}%`, scale: [1, 1.2, 1] }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                 className="absolute w-8 h-8 md:w-10 md:h-10 bg-[var(--accent-blue)] border-2 border-dark rounded-full cursor-pointer hover:bg-[var(--accent-coral)]"
               />
             </div>
          </div>
       </div>
    </section>
  );
};

const SectionExperience = () => {
  const exps = [
    { co: "Tech Co", role: "UI/UX Designer", date: "2024 - Present", active: true },
    { co: "Creative Agency", role: "Product Designer", date: "2022 - 2024", active: false },
    { co: "Startup Inc", role: "Frontend Dev", date: "2020 - 2022", active: false }
  ];
  return (
    <section className="full-section bg-[var(--bg-pink)] py-20 md:py-28 border-b-2 border-dark">
      <div className="section-inner flex flex-col lg:flex-row gap-12 lg:gap-16 items-center max-w-[1100px] mx-auto">
         <div className="lg:w-1/3 text-center lg:text-left">
           <h2 className="font-serif italic text-[36px] md:text-[48px] text-dark leading-[1.1] mb-5">
             A designer with<br/>a little bit of<br/>developer brain.
           </h2>
           <p className="font-instrument text-[var(--text-gray)] text-[15px]">
             Before I started designing products, I was building them. This technical foundation ensures my designs are not only beautiful but feasible and scalable.
           </p>
         </div>
         <div className="lg:w-2/3 flex gap-5 overflow-x-auto pb-6 w-full snap-x">
           {exps.map((exp, i) => (
             <div key={i} className={`snap-center flex-shrink-0 w-[220px] h-[260px] border-2 border-dark rounded-xl hard-shadow-sm p-5 flex flex-col ${exp.active ? 'bg-[var(--accent-purple)] text-white' : 'bg-[var(--bg-cream)] text-dark'}`}>
                <div className="font-mono text-[10px] uppercase font-bold mb-auto border-b-2 border-current/20 pb-2">{exp.date}</div>
                <div>
                  <h3 className="font-serif italic text-2xl mb-1">{exp.co}</h3>
                  <p className="font-instrument text-sm font-bold opacity-80">{exp.role}</p>
                </div>
             </div>
           ))}
         </div>
      </div>
    </section>
  );
};

const SectionLetsTalk = ({ onOpenContact }) => {
  const dialHoles = [ { l: 'S', a: 40 }, { l: 'O', a: 75 }, { l: 'U', a: 110 }, { l: 'K', a: 145 }, { l: 'H', a: 180 }, { l: 'Y', a: 215 }, { l: 'A', a: 250 }, { l: '♡', a: 285 }, { l: '♡', a: 320 } ];
  return (
    <section className="full-section bg-[var(--bg-warm-cream)] pt-32 pb-16 relative">
      <div className="section-inner flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 relative z-10 mb-12">
        <div className="relative w-[280px] md:w-[320px] h-[280px] md:h-[320px] rounded-full bg-[#B8B4AD] shadow-[inset_0_-8px_20px_rgba(0,0,0,0.15),0_15px_35px_rgba(0,0,0,0.1)] flex items-center justify-center border-2 border-[#A8A49D]">
          <div className="absolute w-[240px] md:w-[280px] h-[240px] md:h-[280px] rounded-full border border-white/30"></div>
          
          <div className="w-[120px] md:w-[140px] h-[120px] md:h-[140px] bg-[#FFFBF0] rounded-full z-20 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.1)] border-[6px] border-[#D1CEC6] flex flex-col items-center justify-center p-3 text-center">
             <span className="font-sans text-[9px] md:text-[10px] font-bold text-[#4318FF] leading-tight tracking-widest mb-1">
               DIAL<br/>SOUKHYA<br/>FOR<br/>GOOD DESIGN
             </span>
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Soukhya" className="w-6 md:w-8 h-6 md:h-8 rounded-full object-cover border-2 border-[#4318FF]" />
          </div>

          {dialHoles.map((hole, i) => {
            const radius = typeof window !== 'undefined' && window.innerWidth > 768 ? 110 : 95; 
            const x = radius * Math.cos((hole.a * Math.PI) / 180);
            const y = radius * Math.sin((hole.a * Math.PI) / 180);
            return (
              <div 
                key={i}
                className="absolute w-10 md:w-12 h-10 md:h-12 bg-[#F2EEE6] rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(255,255,255,0.5)] flex items-center justify-center border border-[#D1CEC6]"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                 <span className="font-sans font-bold text-base md:text-lg text-dark">{hole.l}</span>
              </div>
            );
          })}
          
          <div className="absolute bottom-4 right-8 md:right-10 w-10 md:w-12 h-14 md:h-16 bg-[#D1CEC6] rounded-lg rotate-45 shadow-md border border-[#A8A49D] z-30">
            <div className="w-full h-full border-t-4 border-white/40 rounded-lg"></div>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h2 className="font-serif text-6xl md:text-7xl italic text-dark mb-4">Let's Talk</h2>
          <p className="font-instrument text-lg text-dark/80 mb-8 max-w-sm">
            Have a complex problem?<br/>Let's make it simple.
          </p>
          
          <button onClick={onOpenContact} className="group bg-[#4318FF] hover:bg-[#320EC2] text-white rounded-full flex items-center p-1.5 pr-6 gap-4 shadow-lg transition-all mx-auto md:mx-0 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#171717]">
             <div className="w-10 h-10 bg-[#5B33FF] rounded-full flex items-center justify-center group-hover:bg-[#471BE8] transition-colors border border-[#4318FF]">
               <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </div>
             <span className="font-instrument font-medium text-base">Start the conversation</span>
          </button>
          
          <p className="font-serif italic text-sm text-[#5D705C] mt-8 max-w-sm leading-relaxed mx-auto md:mx-0">
            Available for great product teams, freelance collaborations and international opportunities.
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-8 scalloped-edge z-20"></div>
    </section>
  );
};

const SectionTakeWhatYouNeed = () => {
  const { setCursorState } = useContext(CursorContext);
  const tearOffs = ["A warm hug", "self love note", "A deep breath", "A creative spark", "A quick stretch", "A brain teaser", "A tiny break", "A small win"];

  return (
    <section className="full-section py-24 bg-white relative">
      <div className="purple-grid"></div>
      
      <div className="section-inner relative z-10 max-w-[900px] mx-auto">
        <div className="bg-[#FCFBF7] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-[#EBE8E0] relative pt-12">
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#E8E1D1] rotate-[-1deg] shadow-sm opacity-95"></div>
           
           <h2 className="text-center font-instrument text-4xl md:text-5xl text-[#29138B] mb-10 font-medium">
             Take what you need
           </h2>
           
           <div className="flex w-full border-t border-[#EBE8E0]">
              {tearOffs.map((text, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ backgroundColor: '#F3EFFF', y: 4 }}
                  onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}
                  className="flex-1 border-r border-[#EBE8E0] last:border-r-0 py-16 md:py-24 flex justify-center cursor-pointer transition-colors relative group"
                >
                   <div className="absolute top-0 left-0 w-full h-1 border-t border-dashed border-gray-300"></div>
                   <span className="writing-vertical rotate-180 text-dark/70 font-instrument text-sm md:text-base tracking-wide group-hover:text-[#4318FF]">
                     {text}
                   </span>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="text-center mt-6">
           <span className="font-handwriting text-[#4318FF] text-2xl">
             tap a strip to take one
           </span>
        </div>
      </div>
    </section>
  );
};

const SectionFooter = () => {
  return (
    <footer className="full-section py-20 bg-white border-t border-gray-100">
      <div className="section-inner max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        
        <div className="flex flex-col items-start">
           <div className="flex items-center gap-3 mb-1">
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Soukhya" className="w-8 h-8 rounded-full object-cover" />
             <h3 className="font-serif font-bold text-2xl text-[#4318FF]">Soukhya</h3>
           </div>
           <p className="font-instrument text-sm text-dark/60 mb-12">Designing with intention</p>
           
           <h2 className="font-serif italic text-4xl text-[#4318FF] mb-4">
             Thank you for visiting
           </h2>
           <p className="text-[10px] font-instrument text-dark/40 uppercase tracking-widest">
             © 2026 Designed by Soukhya Kulkarni
           </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-4">
           <a href="#" className="w-20 h-20 md:w-24 md:h-24 border-2 border-dashed border-[#0A66C2] flex items-center justify-center relative hover:bg-blue-50 transition-colors group">
              <span className="font-serif font-bold text-3xl text-[#0A66C2]">in</span>
              <span className="absolute -bottom-6 text-[9px] font-instrument uppercase tracking-widest text-gray-400 group-hover:text-[#0A66C2]">LinkedIn</span>
           </a>
           <a href="#" className="w-20 h-20 md:w-24 md:h-24 border-2 border-dashed border-[#E4405F] flex items-center justify-center relative hover:bg-pink-50 transition-colors group">
              <span className="font-serif font-bold text-2xl text-[#E4405F]">@</span>
              <span className="absolute -bottom-6 text-[9px] font-instrument uppercase tracking-widest text-gray-400 group-hover:text-[#E4405F]">Email</span>
           </a>
           <a href="#" className="w-20 h-20 md:w-24 md:h-24 border-2 border-dashed border-dark flex items-center justify-center relative hover:bg-gray-50 transition-colors group">
              <span className="font-serif font-bold text-2xl text-dark">Bē</span>
              <span className="absolute -bottom-6 text-[9px] font-instrument uppercase tracking-widest text-gray-400 group-hover:text-dark">Behance</span>
           </a>
           <a href="#" className="w-20 h-20 md:w-24 md:h-24 border-2 border-dashed border-[#C13584] flex items-center justify-center relative hover:bg-purple-50 transition-colors group mt-6 md:mt-8">
              <svg className="w-8 h-8 text-[#C13584]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="absolute -bottom-6 text-[9px] font-instrument uppercase tracking-widest text-gray-400 group-hover:text-[#C13584]">Instagram</span>
           </a>
        </div>
      </div>
    </footer>
  );
};

const ContactOverlay = ({ onClose }) => {
  const { setCursorState } = useContext(CursorContext);
  const InstaIcon = () => (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto w-full min-h-screen"
    >
      <div className="paper-grid opacity-60"></div>
      
      <button 
        onClick={onClose} onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}
        className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-mono text-dark hover:bg-gray-50 transition-colors z-20 shadow-sm bg-white"
      >
        Back ×
      </button>

      <div className="max-w-[1200px] mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center py-20 px-8 gap-16 lg:gap-24 relative z-10">
        <div className="flex-1 w-full max-w-[500px]">
          <h1 className="font-serif italic text-[64px] md:text-[80px] text-dark mb-4 leading-[1.1]">Get in touch</h1>
          <p className="font-instrument text-[17px] md:text-[19px] text-[var(--text-gray)] mb-12 max-w-[380px]">For work, collaborations, or anything you'd like to share.</p>

          <div className="grid grid-cols-2 gap-4 max-w-[300px]">
            <div className="w-[140px] h-[140px] border-2 border-dashed border-[#0A66C2]/40 flex flex-col items-center justify-center relative">
              <div className="w-[60px] h-[60px] bg-[#0A66C2] rounded-xl flex items-center justify-center font-serif font-bold text-3xl text-white">in</div>
              <span className="absolute bottom-4 text-[10px] font-instrument uppercase tracking-widest text-dark font-semibold">LinkedIn</span>
            </div>
            
            <div className="w-[140px] h-[140px] border-2 border-dashed border-[#C13584]/40 flex flex-col items-center justify-center relative">
              <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584]"><InstaIcon /></div>
              <span className="absolute bottom-4 text-[10px] font-instrument uppercase tracking-widest text-dark font-semibold">Instagram</span>
            </div>

            <div className="w-[140px] h-[140px] border-2 border-dashed border-[#E4405F]/40 flex flex-col items-center justify-center relative">
              <div className="w-[60px] h-[60px] bg-white border border-gray-100 rounded-xl flex items-center justify-center font-serif font-bold text-3xl text-[#E4405F] shadow-sm">@</div>
              <span className="absolute bottom-4 text-[10px] font-instrument uppercase tracking-widest text-dark font-semibold">Email</span>
            </div>

            <div className="w-[140px] h-[140px] border-2 border-dashed border-[#0057FF]/40 flex flex-col items-center justify-center relative">
              <div className="w-[60px] h-[60px] bg-[#0057FF] rounded-xl flex items-center justify-center font-serif font-bold text-3xl text-white">Bē</div>
              <span className="absolute bottom-4 text-[10px] font-instrument uppercase tracking-widest text-dark font-semibold">Behance</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[500px]">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100/50">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xs font-instrument text-dark/60">Leave this empty</span>
              <input type="text" className="border border-gray-200 rounded-md px-2 py-1 w-40 h-7 bg-white shadow-inner focus:outline-none" disabled />
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-instrument text-dark/60 mb-2 block">Name</label>
                <input type="text" placeholder="What should I call you?" className="w-full bg-[#F8F7FA] rounded-xl px-4 py-3.5 text-sm font-instrument text-dark placeholder:text-dark/40 focus:outline-none focus:bg-[#F0EEF5] transition-colors" />
              </div>
              
              <div>
                <label className="text-xs font-instrument text-dark/60 mb-2 block">Email</label>
                <input type="email" placeholder="Where can I reply?" className="w-full bg-[#F8F7FA] rounded-xl px-4 py-3.5 text-sm font-instrument text-dark placeholder:text-dark/40 focus:outline-none focus:bg-[#F0EEF5] transition-colors" />
              </div>

              <div>
                <label className="text-xs font-instrument text-dark/60 mb-2 block">What's this about?</label>
                <select className="w-full bg-[#F8F7FA] rounded-xl px-4 py-3.5 text-sm font-instrument text-dark/70 focus:outline-none focus:bg-[#F0EEF5] transition-colors appearance-none cursor-pointer">
                  <option>Select...</option>
                  <option>Freelance Project</option>
                  <option>Full-time Role</option>
                  <option>Just saying hi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-instrument text-dark/60 mb-2 block">Your Message</label>
                <textarea placeholder="Drop your thoughts, ideas, or a quick hello..." rows="4" className="w-full bg-[#F8F7FA] rounded-xl px-4 py-3.5 text-sm font-instrument text-dark placeholder:text-dark/40 focus:outline-none focus:bg-[#F0EEF5] transition-colors resize-none"></textarea>
              </div>

              <button 
                onMouseEnter={() => setCursorState("hover")} onMouseLeave={() => setCursorState("default")}
                className="w-full bg-[#4318FF] hover:bg-[#320EC2] text-white rounded-xl py-4 font-instrument font-bold text-base mt-4 shadow-[0_8px_20px_rgba(67,24,255,0.25)] transition-all hover:-translate-y-0.5"
              >
                Send It Through
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HomeView = ({ onOpenContact }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
    <SectionHero />
    <SectionMarquee />
    <SectionDesignStories />
    <SectionSkills />
    <SectionDeveloperDark />
    <SectionTools />
    <SectionGame />
    <SectionExperience />
    <SectionLetsTalk onOpenContact={onOpenContact} />
    <SectionTakeWhatYouNeed />
  </motion.div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState('home');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [cursorState, setCursorState] = useState('default');
  const [cursorText, setCursorText] = useState('');

  const navigate = (path) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState, cursorText, setCursorText }}>
      <GlobalStyles />
      <div className="relative min-h-screen flex flex-col selection:bg-[var(--accent-purple)] selection:text-white w-full">
        <CustomCursor />
        
        <Navbar currentPath={currentPath} navigate={navigate} onOpenContact={() => setIsContactOpen(true)} />
        
        <main className="flex-grow w-full">
          <AnimatePresence mode="wait">
            {currentPath === 'home' ? (
              <HomeView key="home" onOpenContact={() => setIsContactOpen(true)} />
            ) : (
              <motion.div key="other" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-40 pb-32 min-h-[80vh] flex flex-col items-center justify-center text-center px-8 bg-[var(--bg-cream)] w-full">
                 <div className="paper-grid opacity-40"></div>
                 <h1 className="font-serif text-[52px] italic text-[var(--accent-purple)] mb-6 capitalize">{currentPath}</h1>
                 <button onClick={() => navigate('home')} className="mt-8 font-bold text-dark border-b-2 border-dark hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)] transition-colors text-base">← Back Home</button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <SectionFooter />

        <AnimatePresence>
          {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </AnimatePresence>
      </div>
    </CursorContext.Provider>
  );
}