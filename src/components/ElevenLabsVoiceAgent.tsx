import { createElement, useEffect, useRef } from "react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_WIDGET_SCRIPT_SRC } from "../config/voiceAgent";

const SCRIPT_ID = "elevenlabs-convai-widget-script";
const WIDGET_STYLE_ID = "ozthropic-elevenlabs-widget-style";
const WIDGET_TEXT_CONTENTS = JSON.stringify({
  main_label: "",
  start_call: "Start a call",
});

const WIDGET_BUTTON_CSS = `
  .rounded-compact-sheet.flex.items-center {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .rounded-compact-sheet.flex.items-center > :first-child {
    display: none !important;
  }

  button[aria-label="Start a call"] {
    min-height: 44px !important;
    border-radius: 12px !important;
    padding: 0 16px !important;
    background: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.84) !important;
    color: #1f1f1f !important;
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.14) !important;
    font-family: "Questrial", Inter, system-ui, sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    line-height: 1 !important;
    gap: 10px !important;
    transition:
      transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
      background 250ms ease,
      color 250ms ease,
      border-color 250ms ease !important;
  }

  button[aria-label="Start a call"]:hover,
  button[aria-label="Start a call"]:focus-visible {
    background: #1f1f1f !important;
    border-color: #1f1f1f !important;
    color: #ffffff !important;
    transform: translateY(-2px) !important;
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

export function ElevenLabsVoiceAgent() {
  const widgetRef = useRef<HTMLElement | null>(null);

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
      const applied = applyWidgetButtonStyles(widgetRef.current);
      if (applied || attempts > 100) {
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="voice-agent-widget" aria-label="Ozthropic voice agent">
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
