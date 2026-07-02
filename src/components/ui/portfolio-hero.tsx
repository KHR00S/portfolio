import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

/* BlurText animation component (21st.dev @syedmoin-lab/portfolio) */
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [inView, setInView] = useState(reduceMotion);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [reduceMotion]);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateY(0)"
              : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: reduceMotion
              ? "none"
              : `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
};

const ACCENT = "#C3E41D";

const menuItems = [
  { label: "HOME", href: "#home", highlight: true },
  { label: "ABOUT", href: "#about" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PUBLICATIONS", href: "#publications" },
  { label: "AWARDS", href: "#awards" },
  { label: "CERTIFICATIONS", href: "#certifications" },
  { label: "CONTACT", href: "#contact" },
];

/* Name sizes scale with viewport so FAKHRUS (7 chars, Fira Code) never overflows */
const nameStyle: React.CSSProperties = {
  color: ACCENT,
  fontFamily: "'Fira Code', monospace",
  fontSize: "min(20.5vw, 210px)",
};

interface PortfolioHeroProps {
  photoSrc?: string;
}

export default function PortfolioHero({ photoSrc }: PortfolioHeroProps) {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {}
  };

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {}
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div
      className="min-h-screen transition-colors"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
        color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 bg-transparent border-0 appearance-none transition-colors duration-300 z-50 cursor-pointer text-neutral-500 hover:text-black dark:hover:text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              )}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 w-[200px] md:w-[240px] border-none shadow-2xl mt-2 ml-4 p-4 rounded-lg z-[100]"
                style={{
                  backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
                }}
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-lg md:text-xl font-bold tracking-tight py-1.5 px-2 cursor-pointer transition-colors duration-300"
                    style={{
                      color: item.highlight ? ACCENT : isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = ACCENT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.highlight ? ACCENT : (isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)");
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Signature */}
          <div
            className="text-4xl"
            style={{
              color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
            }}
          >
            F
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full border-0 appearance-none hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)" }}
            aria-label="Toggle theme"
          >
            <div
              className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300"
              style={{
                backgroundColor: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
                transform: isDark ? "translateX(2rem)" : "translateX(0)",
              }}
            />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col" id="home">
        <h1 className="sr-only">Fakhrus Syakir — Network Engineer &amp; ML Researcher</h1>

        {/* Centered Main Name - Always Perfectly Centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
          <div className="relative text-center" aria-hidden="true">
            <div>
              <BlurText
                text="FAKHRUS"
                delay={100}
                animateBy="letters"
                direction="top"
                className="font-bold leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={nameStyle}
              />
            </div>
            <div>
              <BlurText
                text="SYAKIR"
                delay={100}
                animateBy="letters"
                direction="top"
                className="font-bold leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={nameStyle}
              />
            </div>

            {/* Profile Picture */}
            {photoSrc && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className="rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer"
                  style={{
                    width: "min(12.6vw, 129px)",
                    height: "min(21.3vw, 218px)",
                    background: `radial-gradient(circle at 34% 24%, #ECFCCB, ${ACCENT} 58%, #84CC16)`,
                  }}
                >
                  <img
                    src={photoSrc}
                    alt="Fakhrus Syakir — portrait"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "50% 18%" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tagline - Proper Distance Below Hero */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-32 xl:bottom-36 left-1/2 -translate-x-1/2 w-full px-6">
          <div className="flex justify-center">
            <BlurText
              text="Engineering reliable networks in code & research."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center transition-colors duration-300 text-neutral-500 hover:text-black dark:hover:text-white"
              style={{ fontFamily: "'Antic', sans-serif" }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300 p-2 cursor-pointer"
          aria-label="Scroll down to About"
        >
          <ChevronDown className="w-5 h-5 md:w-8 md:h-8 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300" />
        </a>
      </main>
    </div>
  );
}
