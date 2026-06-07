import { useEffect, useRef, useState } from "react";
import { LOOP_VIDEO_SRC, MAIN_VIDEO_SRC } from "../config/media";

const HERO_ID = "hero-zone";
const SCRUB_EASE = 0.24;
const SEEK_FRAME_MS = 33;
const SEEK_MIN_DIFF = 0.035;

function getReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function VideoBackdrop() {
  const mainRef = useRef<HTMLVideoElement | null>(null);
  const loopRef = useRef<HTMLVideoElement | null>(null);
  const durationRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastSeekAtRef = useRef(0);
  const reducedRef = useRef(getReducedMotion());
  const loopActiveRef = useRef(false);
  const loopRequestedRef = useRef(false);
  const loopLoadRequestedRef = useRef(false);
  const mainInitializedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loopActive, setLoopActive] = useState(false);

  useEffect(() => {
    const mainVideo = mainRef.current;
    const loopVideo = loopRef.current;
    if (!mainVideo || !loopVideo) return;

    const playLoop = () => {
      if (loopActiveRef.current) return;
      if (loopVideo.readyState < 2) {
        if (!loopLoadRequestedRef.current) {
          loopLoadRequestedRef.current = true;
          loopVideo.load();
        }
        return;
      }

      loopActiveRef.current = true;
      setLoopActive(true);
      mainVideo.pause();
      loopVideo.playbackRate = 1;
      if (loopVideo.paused) {
        loopVideo.play().catch(() => undefined);
      }
    };

    const stopLoop = () => {
      if (!loopActiveRef.current) return;
      loopActiveRef.current = false;
      setLoopActive(false);
      loopVideo.pause();
    };

    const computeTarget = () => {
      const hero = document.getElementById(HERO_ID);
      const duration = durationRef.current;
      if (!hero || duration <= 0) return;

      const rect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom <= viewportHeight) {
        loopRequestedRef.current = true;
        targetRef.current = duration;
        return;
      }

      loopRequestedRef.current = false;
      if (!reducedRef.current) stopLoop();

      const travel = Math.max(1, hero.offsetHeight - viewportHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      targetRef.current = progress * duration;
    };

    const handleLoaded = () => {
      durationRef.current = Number.isFinite(mainVideo.duration) ? mainVideo.duration : 0;
      if (!mainInitializedRef.current) {
        mainInitializedRef.current = true;
        mainVideo.currentTime = 0;
        mainVideo.pause();
      }
      computeTarget();
      setReady(true);
    };

    const handleError = () => {
      setFailed(true);
      if (import.meta.env.DEV) {
        console.warn(`Ozthropic video missing or unreadable. Main: ${MAIN_VIDEO_SRC}; Loop: ${LOOP_VIDEO_SRC}`);
      }
    };

    const tick = () => {
      const duration = durationRef.current;
      if (mainVideo.readyState >= 2 && duration > 0 && !reducedRef.current && !loopActiveRef.current) {
        const target = Math.max(0, Math.min(duration, targetRef.current));
        const diff = target - mainVideo.currentTime;
        const now = window.performance.now();

        if (Math.abs(diff) < 0.05) {
          if (!mainVideo.paused) mainVideo.pause();
          if (loopRequestedRef.current) {
            playLoop();
          }
        } else if (now - lastSeekAtRef.current >= SEEK_FRAME_MS) {
          const nextTime = Math.abs(diff) < SEEK_MIN_DIFF ? target : mainVideo.currentTime + diff * SCRUB_EASE;

          lastSeekAtRef.current = now;
          mainVideo.pause();
          mainVideo.currentTime = Math.max(0, Math.min(duration, nextTime));
        }
      }

      if (reducedRef.current && mainVideo.readyState >= 2 && mainVideo.currentTime > 0.25) {
        stopLoop();
        mainVideo.pause();
        mainVideo.currentTime = 0.2;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const handleMotionChange = () => {
      reducedRef.current = getReducedMotion();
      if (reducedRef.current) {
        stopLoop();
        mainVideo.pause();
      } else {
        computeTarget();
      }
    };

    const handleScroll = () => {
      computeTarget();
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    mainVideo.muted = true;
    mainVideo.playsInline = true;
    mainVideo.defaultMuted = true;
    mainVideo.setAttribute("muted", "");
    mainVideo.setAttribute("playsinline", "");
    mainVideo.setAttribute("webkit-playsinline", "");
    loopVideo.muted = true;
    loopVideo.playsInline = true;
    loopVideo.defaultMuted = true;
    loopVideo.loop = true;
    loopVideo.setAttribute("muted", "");
    loopVideo.setAttribute("playsinline", "");
    loopVideo.setAttribute("webkit-playsinline", "");

    mainVideo.addEventListener("loadedmetadata", handleLoaded);
    mainVideo.addEventListener("loadeddata", handleLoaded);
    mainVideo.addEventListener("canplay", handleLoaded);
    mainVideo.addEventListener("error", handleError);
    loopVideo.addEventListener("error", handleError);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", computeTarget);
    motionQuery.addEventListener("change", handleMotionChange);

    mainVideo.load();
    loopVideo.load();
    computeTarget();
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      mainVideo.removeEventListener("loadedmetadata", handleLoaded);
      mainVideo.removeEventListener("loadeddata", handleLoaded);
      mainVideo.removeEventListener("canplay", handleLoaded);
      mainVideo.removeEventListener("error", handleError);
      loopVideo.removeEventListener("error", handleError);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", computeTarget);
      motionQuery.removeEventListener("change", handleMotionChange);
      stopLoop();
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="video-backdrop" aria-hidden="true">
      <div className="video-fallback">
        <div className="fallback-mark">Ozthropic</div>
        <div className="fallback-lines" />
        {failed && <span className="fallback-note">Add videos at public/media/main.mp4 and public/media/loop.mp4</span>}
      </div>
      {!failed && (
        <video
          ref={mainRef}
          src={MAIN_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={`${ready ? "primary-video is-ready" : "primary-video"}${loopActive ? " is-tail-hidden" : ""}`}
        />
      )}
      {!failed && (
        <video
          ref={loopRef}
          src={LOOP_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          loop
          className={loopActive ? "loop-video is-visible" : "loop-video"}
        />
      )}
      <div className="video-shade" />
    </div>
  );
}
