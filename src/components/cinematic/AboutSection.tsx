import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useInView, animate } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function ParticleSystem() {
  const ref = useRef<THREE.Points>(null);
  const count = 1500;
  // Initialize once
  const [sphere] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.05;
      ref.current.rotation.x -= delta * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#7fb0ff" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
      </Points>
    </group>
  );
}

function StatCounter({ end, prefix = "", suffix = "", label }: { end: number, prefix?: string, suffix?: string, label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView && ref.current) {
      animate(0, end, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (val) => {
          if (ref.current) ref.current.textContent = `${prefix}${Math.floor(val)}${suffix}`;
        }
      });
    }
  }, [inView, end, prefix, suffix]);

  return (
    <div className="text-center group cursor-default">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display font-bold text-2xl text-primary transition-colors group-hover:text-white"
        style={{ fontFamily: "var(--font-display)", textShadow: "0 0 10px rgba(127, 176, 255, 0)" }}
        whileHover={{ textShadow: "0 0 15px rgba(127, 176, 255, 0.6)" }}
      >
        <span ref={ref}>{prefix}0{suffix}</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mt-0.5 group-hover:text-muted-foreground/90 transition-colors"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </motion.div>
    </div>
  );
}

const TRAITS = [
  { label: "Based in", value: "India 🇮🇳" },
  { label: "Age", value: "18" },
  { label: "Started coding", value: "2019" },
  { label: "Specialty", value: "AI Systems" },
  { label: "Status", value: "Available Q3" },
  { label: "Chess rating", value: "1800+ ♟" },
];

function InfoCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    animate(mouseX, 0, { duration: 0.5 });
    animate(mouseY, 0, { duration: 0.5 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      animate={{ y: [0, -8, 0] }}
      transition={{ y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
      className="relative z-10 perspective-1000 w-full"
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-primary/50 group"
        style={{
          background: "linear-gradient(135deg, oklch(0.12 0.018 250) 0%, oklch(0.09 0.012 250) 100%)",
          boxShadow: "0 40px 80px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.08)",
        }}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px transition-all duration-500 opacity-50 group-hover:opacity-100"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.13 240 / 0.8), transparent)" }}
        />

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center shrink-0">
              <img src="/profile.jpeg" alt="Aryan Garg" className="w-full h-full object-cover" />
            </div>
            <div>
              <div
                className="text-sm font-display font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Aryan Garg
              </div>
              <div
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                BTech CSE · AI Engineer
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-400/70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Available
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/6 rounded-xl overflow-hidden">
            {TRAITS.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex flex-col gap-1 p-4 bg-[oklch(0.10_0.015_250)] hover:bg-[oklch(0.13_0.018_250)] transition-colors duration-300"
              >
                <span
                  className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t.label}
                </span>
                <span
                  className="text-sm font-display font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t.value}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/8">
            <StatCounter end={40} suffix="+" label="Shipped" />
            <StatCounter prefix="$" end={8} suffix="M+" label="Saved" />
            <StatCounter end={12} label="Industries" />
          </div>
        </div>
      </div>

      <div
        className="absolute -inset-4 -z-10 rounded-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.72 0.13 240 / 0.5), transparent 70%)",
          filter: "blur(24px)",
        }}
      />
    </motion.div>
  );
}

function HeroName() {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGradientPos({ x, y });
  };
  
  const handleMouseLeave = () => {
    setGradientPos({ x: 50, y: 50 });
  };

  return (
    <motion.h2
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ y: "100%", opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
      className="font-display font-bold text-[clamp(2.8rem,8vw,8rem)] leading-[0.92] tracking-[-0.03em] cursor-default transition-all duration-300"
      style={{ 
        fontFamily: "var(--font-display)",
        backgroundImage: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(255,255,255,1) 0%, rgba(127,176,255,0.7) 40%, rgba(255,255,255,0.4) 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent"
      }}
    >
      Aryan Garg
    </motion.h2>
  );
}

const TIMELINE = [
  { year: "2019", label: "First line of code", body: "Fell into programming at 16. Built a website in a weekend and never looked back." },
  { year: "2021", label: "First AI in production", body: "Deployed a live NLP pipeline for a startup. It ran for 18 months untouched by human hands." },
  { year: "2022", label: "Went independent", body: "Started taking clients and building SaaS products independently while pursuing my BTech in CSE." },
  { year: "2024", label: "40+ systems shipped", body: "Crossed the milestone — 40 production AI systems across 12 industries and 3 continents." },
  { year: "2025", label: "Now", body: "Building AI-native products and taking select client engagements. Open to what's next." },
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const taglineWords = "AI Engineer · Full-Stack Dev · SaaS Builder".split(" ");

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Smooth entry and exit for the entire section
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 25%",
          scrub: 1,
        }
      }
    );

    gsap.to(containerRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 30%",
        end: "bottom top",
        scrub: 1,
      }
    });

    if (!timelineRef.current || !lineRef.current) return;

    // Energy line animation
    gsap.to(lineRef.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    // Milestone animations
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const dot = node.querySelector('.timeline-dot');
      const ring = node.querySelector('.timeline-ring');
      const content = node.querySelector('.timeline-content');
      const year = node.querySelector('.timeline-year');
      
      const isLast = i === TIMELINE.length - 1;

      gsap.set(content, { opacity: 0.3, scale: 0.96, filter: "blur(4px)" });
      gsap.set(dot, { scale: 0.6, backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.15)" });
      gsap.set(ring, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top 60%", 
          end: "bottom 30%",
          toggleActions: isLast ? "play none none reverse" : "play reverse play reverse",
        }
      });

      tl.to(content, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0)
        .to(year, { color: "var(--color-primary)", duration: 0.5 }, 0)
        .to(dot, { scale: 1, backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)", boxShadow: "0 0 20px oklch(0.72 0.13 240 / 0.8)", duration: 0.5, ease: "back.out(2)" }, 0)
        .to(ring, { scale: 3, opacity: 0, duration: 1.2, ease: "power2.out" }, 0);

      if (isLast) {
        gsap.to(dot, {
          scale: 1.25,
          boxShadow: "0 0 40px oklch(0.72 0.13 240 / 1), 0 0 15px oklch(0.72 0.13 240 / 0.8) inset",
          duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to(content, {
          scale: 1.05, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="relative overflow-hidden bg-background">
      {/* Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <ParticleSystem />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div className="relative z-10 px-6 md:px-16 lg:px-24 py-28 md:py-40 border-b border-white/6">
        <div aria-hidden className="absolute top-0 inset-x-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, oklch(0.055 0.010 250) 0%, transparent 100%)" }} />
        
        <div aria-hidden className="absolute right-6 md:right-12 top-12 font-display font-bold text-[clamp(6rem,18vw,16rem)] leading-none text-white/[0.02] select-none pointer-events-none" style={{ fontFamily: "var(--font-display)" }}>
          01
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="chapter-num mb-10">
            <span className="text-primary mr-3">01</span> About
          </motion.div>

          <div className="flex flex-col gap-6 mb-16 relative">
            <div className="overflow-hidden py-4">
              <HeroName />
            </div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10%" }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="font-display text-[clamp(1.4rem,3.5vw,3.5rem)] font-light leading-tight tracking-[-0.01em] flex flex-wrap gap-x-3 gap-y-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {taglineWords.map((word, i) => {
                const isHighlight = word.includes("AI") || word.includes("Full-Stack") || word.includes("SaaS");
                return (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className={isHighlight ? "text-primary" : "text-primary/70"}
                    style={{ textShadow: isHighlight ? "0 0 12px rgba(127, 176, 255, 0.4)" : "none" }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-start">
            <div className="flex flex-col gap-6">
              {[
                "I build AI systems, websites, and SaaS products that solve real problems. I started this journey as an independent developer and haven't looked back.",
                "While I'm actively building products and taking on client work, I'm also currently pursuing my BTech in Computer Science Engineering in college.",
                "My craft lives at the intersection of AI, full-stack development, and premium product engineering. I design experiences that feel alive.",
              ].map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                  className={`leading-[1.8] ${i === 0 ? "text-lg md:text-xl text-foreground/90 font-medium" : "text-base text-muted-foreground"}`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {para}
                </motion.p>
              ))}

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.5 } }
                }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {["LangGraph", "OpenAI API", "LLM Ops", "RAG Systems", "Voice AI", "Next.js", "Three.js", "Python"].map((tag) => (
                  <motion.span
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    whileHover={{ y: -2, boxShadow: "0 0 10px rgba(127, 176, 255, 0.3)", borderColor: "rgba(127, 176, 255, 0.5)", color: "rgba(127, 176, 255, 0.9)" }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" } }}
                    className="px-3 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-[0.15em] border border-white/10 text-muted-foreground/70 transition-colors duration-300 cursor-default bg-white/[0.02]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <InfoCard />
          </div>
        </div>
      </div>

      {/* Part 2: Timeline */}
      <div ref={timelineRef} className="relative px-6 md:px-16 lg:px-24 py-32 z-10">
        <div aria-hidden className="absolute left-0 top-16 font-display font-bold text-[clamp(3rem,10vw,9rem)] leading-none text-white/[0.015] select-none pointer-events-none tracking-widest z-0" style={{ fontFamily: "var(--font-display)" }}>
          TIMELINE
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="chapter-num mb-20">
            The story so far
          </motion.div>

          <div className="relative pl-2 md:pl-0">
            <div className="absolute left-[5.5rem] md:left-[8rem] top-0 bottom-0 w-[2px] bg-white/5 overflow-hidden rounded-full">
              <div ref={lineRef} className="w-full h-full origin-top bg-gradient-to-b from-primary/80 via-primary to-primary/0 shadow-[0_0_15px_oklch(0.72_0.13_240/0.8)]" style={{ transform: "scaleY(0)" }} />
            </div>

            <div className="flex flex-col gap-0">
              {TIMELINE.map((item, i) => (
                <div key={item.year} ref={(el) => { nodesRef.current[i] = el; }} className="group relative flex items-start gap-0 py-16 border-b border-white/5 last:border-0">
                  <div className="timeline-year w-[5.5rem] md:w-[8rem] flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.3em] text-primary/30 pt-1" style={{ fontFamily: "var(--font-mono)" }}>
                    {item.year}
                  </div>

                  <div className="relative flex-shrink-0 -translate-x-[0.5px]">
                    <div className="timeline-ring absolute inset-0 rounded-full border border-primary bg-primary/20 pointer-events-none" />
                    <div className="timeline-dot w-3 h-3 rounded-full border border-white/20 bg-background relative z-10" />
                  </div>

                  <div className="timeline-content flex-1 pl-8 md:pl-16 origin-left">
                    <h3 className="font-display font-semibold text-2xl md:text-3xl text-foreground mb-3 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {item.label}
                    </h3>
                    <p className="text-base text-muted-foreground/80 leading-relaxed max-w-lg" style={{ fontFamily: "var(--font-body)" }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
