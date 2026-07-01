import { MessageCircle } from "lucide-react";
import type { Language } from "../content/siteContent";
import { ElevenLabsVoiceAgent } from "./ElevenLabsVoiceAgent";

type FloatingContactActionsProps = {
  language: Language;
};

export function FloatingContactActions({ language }: FloatingContactActionsProps) {
  const chatHref = language === "fa" ? "/chat?lang=fa" : "/chat";

  return (
    <div className="floating-contact-actions" aria-label="Contact options">
      <a className="button button-light floating-chat-button" href={chatHref}>
        Text chat
        <MessageCircle size={16} strokeWidth={1.8} />
      </a>
      <ElevenLabsVoiceAgent />
    </div>
  );
}
