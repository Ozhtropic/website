import { createElement, useEffect, useRef } from "react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_WIDGET_SCRIPT_SRC } from "../config/voiceAgent";

const SCRIPT_ID = "elevenlabs-convai-widget-script";
const WIDGET_STYLE_ID = "ozthropic-elevenlabs-widget-style";
const WIDGET_TEXT_CONTENTS = JSON.stringify({
  main_label: "",
  start_call: "Start a call",
  start_chat: "Chat",
});

const WIDGET_BUTTON_CSS = `
  .overlay {
    position: fixed !important;
    inset: auto 32px 32px auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    justify-content: flex-end !important;
    width: min(600px, calc(100vw - 64px)) !important;
    height: min(640px, calc(100vh - 64px)) !important;
    min-width: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    pointer-events: none !important;
    transform: none !important;
    z-index: 2147483647 !important;
  }

  .overlay > *,
  .sheet,
  .rounded-compact-sheet,
  button,
  input,
  textarea,
  a {
    pointer-events: auto !important;
  }

  .rounded-compact-sheet.flex.items-center {
    display: inline-flex !important;
    align-items: center !important;
    width: auto !important;
    min-width: 0 !important;
    height: auto !important;
    min-height: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .rounded-compact-sheet.flex.items-center > :first-child,
  p:has(a[href*="elevenlabs.io"]) {
    display: none !important;
  }

  button[aria-label="Start a call"],
  button[aria-label="Chat"],
  button[aria-label="Message"] {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: row-reverse !important;
    width: auto !important;
    height: 44px !important;
    min-height: 44px !important;
    border-radius: 12px !important;
    padding: 0 16px !important;
    background: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.84) !important;
    color: #1f1f1f !important;
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.14) !important;
    cursor: pointer !important;
    font-family: "Questrial", Inter, system-ui, sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    line-height: 1 !important;
    gap: 10px !important;
    white-space: nowrap !important;
    transition:
      transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
      background 250ms ease,
      color 250ms ease,
      border-color 250ms ease !important;
  }

  button[aria-label="Chat"],
  button[aria-label="Message"] {
    flex-direction: row !important;
    min-width: 104px !important;
  }

  button[aria-label="Chat"]::before,
  button[aria-label="Message"]::before {
    content: "Chat";
  }

  button[aria-label="Start a call"]:hover,
  button[aria-label="Start a call"]:focus-visible,
  button[aria-label="Chat"]:hover,
  button[aria-label="Chat"]:focus-visible,
  button[aria-label="Message"]:hover,
  button[aria-label="Message"]:focus-visible {
    background: #1f1f1f !important;
    border-color: #1f1f1f !important;
    color: #ffffff !important;
    transform: translateY(-2px) !important;
  }

  @media (max-width: 620px) {
    .overlay {
      inset: auto 16px 16px auto !important;
      width: calc(100vw - 32px) !important;
      height: min(620px, calc(100vh - 32px)) !important;
    }
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

  return (
    <div className={`voice-agent-widget${className ? ` ${className}` : ""}`} aria-label="Ozthropic voice agent">
      {createElement("elevenlabs-convai", {
        ref: widgetRef,
        "agent-id": ELEVENLABS_AGENT_ID,
        variant: "compact",
        placement: "bottom-right",
        transcript: "true",
        "text-input": "true",
        "default-expanded": "false",
        "always-expanded": "false",
        "show-avatar-when-collapsed": "false",
        "show-conversation-id": "false",
        "text-contents": WIDGET_TEXT_CONTENTS,
      })}
    </div>
  );
}
