(function () {
  var script = document.currentScript;
  var origin = script && script.src ? new URL(script.src, window.location.href).origin : window.location.origin;
  var apiBase = (script && script.dataset.apiBase) || origin;
  var initialLanguage = (script && script.dataset.language) === "fa" ? "fa" : "en";
  var position = (script && script.dataset.position) || "right";
  var storageKey = "ozthropic-widget-session::" + apiBase;
  var sessionId = window.localStorage.getItem(storageKey) || createSessionId();

  window.localStorage.setItem(storageKey, sessionId);

  var copy = {
    en: {
      title: "Ozthropic Assistant",
      subtitle: "English + Persian AI support",
      placeholder: "Write your message...",
      send: "Send",
      thinking: "Thinking...",
      welcome:
        "Hello. I can answer in English or Persian, capture your details for follow-up, and check registration status.",
      open: "Chat",
      close: "Close",
      error: "The assistant is not ready yet.",
      leadTool: "Lead captured",
      statusTool: "Status checked",
    },
    fa: {
      title: "دستیار Ozthropic",
      subtitle: "پشتیبانی فارسی و انگلیسی",
      placeholder: "پیام‌تان را بنویسید...",
      send: "ارسال",
      thinking: "در حال فکر کردن...",
      welcome:
        "سلام. من می‌توانم به فارسی یا انگلیسی پاسخ بدهم، اطلاعات شما را برای پیگیری ثبت کنم و وضعیت ثبت‌نام را بررسی کنم.",
      open: "چت",
      close: "بستن",
      error: "دستیار هنوز آماده نیست.",
      leadTool: "لید ثبت شد",
      statusTool: "وضعیت بررسی شد",
    },
  };

  var state = {
    language: initialLanguage,
    open: false,
    pending: false,
    messages: [],
  };

  var host = document.createElement("div");
  host.setAttribute("data-ozthropic-widget", "true");
  document.body.appendChild(host);

  var shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = [
    "<style>",
    ":host{all:initial}",
    ".wrap{position:fixed;bottom:22px;" + (position === "left" ? "left:22px;" : "right:22px;") + "z-index:2147483647;font-family:Questrial,Arial,sans-serif}",
    ".toggle{display:inline-flex;align-items:center;gap:10px;padding:14px 18px;border:0;border-radius:999px;background:#ffffff;color:#1f1f1f;box-shadow:0 20px 50px rgba(0,0,0,.18);cursor:pointer;font-size:14px;font-weight:700}",
    ".panel{display:none;width:min(380px,calc(100vw - 24px));height:min(640px,calc(100vh - 96px));margin-top:14px;border:1px solid rgba(255,255,255,.18);border-radius:24px;background:rgba(31,31,31,.88);backdrop-filter:blur(18px);color:#fff;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.25)}",
    ".panel.open{display:flex;flex-direction:column}",
    ".header{display:flex;align-items:center;justify-content:space-between;padding:18px;border-bottom:1px solid rgba(255,255,255,.1)}",
    ".brand strong{display:block;font-size:15px}",
    ".brand small{display:block;color:rgba(255,255,255,.66);margin-top:4px}",
    ".lang{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:rgba(255,255,255,.08)}",
    ".lang button{border:0;border-radius:999px;padding:8px 10px;background:transparent;color:rgba(255,255,255,.72);cursor:pointer;font-size:11px;font-weight:800}",
    ".lang button.active{background:#fff;color:#1f1f1f}",
    ".thread{flex:1;padding:16px;overflow:auto;display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01))}",
    ".msg{display:flex}",
    ".msg.user{justify-content:flex-end}",
    ".bubble{max-width:88%;padding:14px 16px;border-radius:18px;line-height:1.6;font-size:14px}",
    ".msg.assistant .bubble{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.08)}",
    ".msg.user .bubble{background:#fff;color:#1f1f1f}",
    ".tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}",
    ".tool{padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.12);font-size:11px;font-weight:700}",
    ".error{padding:0 16px 12px;color:#ffd3d3;font-size:12px}",
    ".form{display:grid;grid-template-columns:1fr auto;gap:10px;padding:16px;border-top:1px solid rgba(255,255,255,.1)}",
    ".form textarea{resize:none;height:64px;padding:12px 14px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.08);color:#fff;font:inherit}",
    ".form button{padding:0 16px;border:0;border-radius:16px;background:#fff;color:#1f1f1f;cursor:pointer;font:inherit;font-weight:700}",
    "</style>",
    "<div class='wrap'>",
    "  <button class='toggle' type='button'></button>",
    "  <section class='panel'>",
    "    <div class='header'>",
    "      <div class='brand'><strong></strong><small></small></div>",
    "      <div class='lang'>",
    "        <button type='button' data-lang='en'>EN</button>",
    "        <button type='button' data-lang='fa'>FA</button>",
    "      </div>",
    "    </div>",
    "    <div class='thread'></div>",
    "    <div class='error' hidden></div>",
    "    <form class='form'>",
    "      <textarea rows='3'></textarea>",
    "      <button type='submit'></button>",
    "    </form>",
    "  </section>",
    "</div>",
  ].join("");

  var elements = {
    toggle: shadow.querySelector(".toggle"),
    panel: shadow.querySelector(".panel"),
    title: shadow.querySelector(".brand strong"),
    subtitle: shadow.querySelector(".brand small"),
    thread: shadow.querySelector(".thread"),
    error: shadow.querySelector(".error"),
    form: shadow.querySelector(".form"),
    input: shadow.querySelector("textarea"),
    submit: shadow.querySelector(".form button"),
    langButtons: shadow.querySelectorAll("[data-lang]"),
  };

  function createSessionId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return "widget-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  }

  function render() {
    var locale = copy[state.language];

    elements.toggle.textContent = state.open ? locale.close : locale.open;
    elements.panel.classList.toggle("open", state.open);
    elements.title.textContent = locale.title;
    elements.subtitle.textContent = locale.subtitle;
    elements.input.placeholder = locale.placeholder;
    elements.submit.textContent = state.pending ? locale.thinking : locale.send;

    elements.langButtons.forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-lang") === state.language);
    });

    if (!state.messages.length) {
      state.messages = [{ role: "assistant", content: locale.welcome, toolEvents: [] }];
    }

    elements.thread.innerHTML = "";

    state.messages.forEach(function (message) {
      var item = document.createElement("article");
      item.className = "msg " + message.role;

      var bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = message.content;

      if (message.toolEvents && message.toolEvents.length) {
        var tools = document.createElement("div");
        tools.className = "tools";

        message.toolEvents.forEach(function (event) {
          var pill = document.createElement("span");
          pill.className = "tool";
          pill.textContent = event.tool === "capture_lead" ? locale.leadTool : locale.statusTool;
          tools.appendChild(pill);
        });

        bubble.appendChild(tools);
      }

      item.appendChild(bubble);
      elements.thread.appendChild(item);
    });

    if (state.pending) {
      var pending = document.createElement("article");
      pending.className = "msg assistant";
      var pendingBubble = document.createElement("div");
      pendingBubble.className = "bubble";
      pendingBubble.textContent = locale.thinking;
      pending.appendChild(pendingBubble);
      elements.thread.appendChild(pending);
    }

    elements.thread.scrollTop = elements.thread.scrollHeight;
  }

  async function sendMessage(text) {
    var outgoing = String(text || "").trim();
    if (!outgoing || state.pending) {
      return;
    }

    state.messages.push({ role: "user", content: outgoing, toolEvents: [] });
    state.pending = true;
    elements.error.hidden = true;
    render();

    try {
      var response = await fetch(apiBase + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          userKey: "widget:" + sessionId,
          channel: "widget",
          language: state.language,
          message: outgoing,
        }),
      });

      var data = await response.json();

      if (!response.ok || !data.ok || !data.reply) {
        throw new Error((data && data.error) || copy[state.language].error);
      }

      state.messages.push({
        role: "assistant",
        content: data.reply,
        toolEvents: data.toolEvents || [],
      });
    } catch (error) {
      elements.error.textContent = error instanceof Error ? error.message : copy[state.language].error;
      elements.error.hidden = false;
    } finally {
      state.pending = false;
      render();
    }
  }

  elements.toggle.addEventListener("click", function () {
    state.open = !state.open;
    render();
  });

  elements.langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.language = button.getAttribute("data-lang") === "fa" ? "fa" : "en";
      if (state.messages.length === 1 && state.messages[0].role === "assistant") {
        state.messages[0].content = copy[state.language].welcome;
      }
      render();
    });
  });

  elements.form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = elements.input.value;
    elements.input.value = "";
    void sendMessage(value);
  });

  elements.input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      var value = elements.input.value;
      elements.input.value = "";
      void sendMessage(value);
    }
  });

  render();
})();

