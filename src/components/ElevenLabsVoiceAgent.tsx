import { createElement, useEffect } from "react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_WIDGET_SCRIPT_SRC } from "../config/voiceAgent";

const SCRIPT_ID = "elevenlabs-convai-widget-script";

export function ElevenLabsVoiceAgent() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = ELEVENLABS_WIDGET_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="voice-agent-widget" aria-label="Ozthropic voice agent">
      {createElement("elevenlabs-convai", { "agent-id": ELEVENLABS_AGENT_ID })}
    </div>
  );
}
