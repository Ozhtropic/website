import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import type { SiteContent } from "../content/siteContent";

const LEFT_SCROLL_DISTANCE = 1560;
const RAIL_SCROLL_DISTANCE = 920;
const MOBILE_QUERY = "(max-width: 700px), (pointer: coarse)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getMobileTextFlow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

function splitAccent(title: string, accent: string) {
  const index = title.indexOf(accent);
  if (index === -1) return [title, "", ""];
  return [title.slice(0, index), accent, title.slice(index + accent.length)];
}

type HeroProps = {
  content: SiteContent;
};

export function Hero({ content }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [mobileTextFlow, setMobileTextFlow] = useState(getMobileTextFlow);
  const { brand, heroRail, heroStages, ui } = content;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobileTextFlow(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || mobileTextFlow) {
      setProgress(0);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const compute = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const next = Math.max(0, Math.min(1, -rect.top / travel));
      setProgress(next);
    };

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    compute();

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [mobileTextFlow, reducedMotion]);

  return (
    <section id="hero-zone" className="hero-zone" ref={sectionRef}>
      <div className="hero-sticky">
        <div className="hero-inner on-dark">
          <div className="hero-stage-mask">
            <div
              className="hero-stage-stack"
              style={
                reducedMotion
                  ? undefined
                  : mobileTextFlow
                  ? undefined
                  : { transform: `translate3d(0, ${-progress * LEFT_SCROLL_DISTANCE}px, 0)` }
              }
            >
              {heroStages.map((stage) => {
                const [before, accent, after] = splitAccent(stage.title, stage.accent);
                return (
                  <article className="hero-copy" key={stage.eyebrow}>
                    <p className="eyebrow eyebrow-dark">{stage.eyebrow}</p>
                    <h1>
                      {before}
                      {accent && <span>{accent}</span>}
                      {after}
                    </h1>
                    <p>{stage.body}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="hero-rail" aria-label={`${brand.name} overview`}>
            <div
              className="hero-rail-stack"
              style={
                reducedMotion
                  ? undefined
                  : mobileTextFlow
                  ? undefined
                  : { transform: `translate3d(0, ${-progress * RAIL_SCROLL_DISTANCE}px, 0)` }
              }
            >
              {heroRail.map((item, index) => {
                if (item.type === "spacer") return <div className="rail-spacer" key={`${item.type}-${index}`} />;
                return (
                  <p className={`rail-${item.type}`} key={`${item.text}-${index}`}>
                    {item.text}
                  </p>
                );
              })}
            </div>
          </aside>

          <div className="scroll-cue">
            <ArrowDown size={14} strokeWidth={1.6} />
            <span>{ui.scrollCue}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
