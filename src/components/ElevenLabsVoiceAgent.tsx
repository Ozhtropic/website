import { createElement, useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_WIDGET_SCRIPT_SRC } from "../config/voiceAgent";

const SCRIPT_ID = "elevenlabs-convai-widget-script";
const WIDGET_STYLE_ID = "ozthropic-elevenlabs-widget-style";
const WIDGET_TEXT_CONTENTS = JSON.stringify({
  main_label: "",
  start_call: "Start a call",
});

const WIDGET_BUTTON_CSS = `
  .overlay {
    display: none !important;
    pointer-events: none !important;
  }
`;

function applyWidgetButtonStyles(widget: HTMLElement | null) {
  const shadowRoot = widget?.shadowRoot;
  if (!shadowRoot || shadowRoot.getElementById(WIDGET_STYLE_ID)) return false;

  const style = document.createElement("style");
  style.id = WIDGET_STYLE_ID;
  style.textContent = WIDGET_BUTTON_CSS;
  shadowRoot.appendChild(style);
  return true;
}

type ElevenLabsVoiceAgentProps = {
  className?: string;
};

export function ElevenLabsVoiceAgent({ className }: ElevenLabsVoiceAgentProps) {
  const widgetRef = useRef<HTMLElement | null>(null);
  const retryStartTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = ELEVENLABS_WIDGET_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (applyWidgetButtonStyles(widgetRef.current) || attempts > 100) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (retryStartTimerRef.current) {
        window.clearInterval(retryStartTimerRef.current);
      }
    };
  }, []);

  const handleStartCall = () => {
    if (startElevenLabsCall(widgetRef.current)) {
      return;
    }

    if (retryStartTimerRef.current) {
      window.clearInterval(retryStartTimerRef.current);
    }

    let attempts = 0;
    retryStartTimerRef.current = window.setInterval(() => {
      attempts += 1;
      if (startElevenLabsCall(widgetRef.current) || attempts > 40) {
        if (retryStartTimerRef.current) {
          window.clearInterval(retryStartTimerRef.current);
          retryStartTimerRef.current = null;
        }
      }
    }, 100);
  };

  return (
    <div className={`voice-agent-widget${className ? ` ${className}` : ""}`} aria-label="Ozthropic voice agent">
      <button type="button" className="button button-light voice-agent-button" onClick={handleStartCall}>
        Start a call
        <Phone size={16} strokeWidth={1.8} />
      </button>
      {createElement("elevenlabs-convai", {
        ref: widgetRef,
        "agent-id": ELEVENLABS_AGENT_ID,
        variant: "compact",
        placement: "bottom-right",
        transcript: "false",
        "text-input": "false",
        "default-expanded": "false",
        "always-expanded": "false",
        "show-avatar-when-collapsed": "false",
        "show-conversation-id": "false",
        "text-contents": WIDGET_TEXT_CONTENTS,
      })}
    </div>
  );
}

function startElevenLabsCall(widget: HTMLElement | null) {
  const startButton = widget?.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-label="Start a call"]');
  if (!startButton) return false;

  startButton.click();
  return true;
}
