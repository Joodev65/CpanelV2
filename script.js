const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const toneSelect = document.getElementById("tone");
const voiceToggle = document.createElement("button");

let voiceEnabled = false;

// Voice Toggle Button
voiceToggle.innerHTML = `<img src="https://www.svgrepo.com/show/525945/speaker-volume.svg" width="20" alt="voice">`;
voiceToggle.title = "Aktifkan Suara";
voiceToggle.style.background = "#2a2a2a";
voiceToggle.style.border = "none";
voiceToggle.style.borderRadius = "8px";
voiceToggle.style.padding = "8px";
voiceToggle.style.cursor = "pointer";
voiceToggle.style.display = "flex";
voiceToggle.style.alignItems = "center";
voiceToggle.style.justifyContent = "center";
voiceToggle.onmouseover = () => voiceToggle.style.background = "#333";
voiceToggle.onmouseleave = () => voiceToggle.style.background = "#2a2a2a";
document.querySelector(".config").appendChild(voiceToggle);

voiceToggle.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceToggle.innerHTML = voiceEnabled
    ? `<img src="https://img1.pixhost.to/images/6779/615687404_skyzopedia.jpg">`
    : `<img src="https://img1.pixhost.to/images/6779/615687539_skyzopedia.jpg" width="20" alt="voice">`;
  voiceToggle.title = voiceEnabled ? "Suara Aktif" : "Suara Mati";
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  const tone = toneSelect.value;
  if (!text) return;

  addMessage(text, true);
  userInput.value = "";

  const loadingEl = document.createElement("div");
  loadingEl.className = "message ai-message loading";
  loadingEl.innerText = "YuniAI sedang mengetik...";
  messages.appendChild(loadingEl);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("https://kaput-incandescent-printer.glitch.me/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, tone: tone })
    });

    const data = await res.json();
    loadingEl.remove();

    const reply = data.reply || "[!] Tidak ada respon dari AI";
    addMessage(reply, false);

    if (voiceEnabled) speak(reply);
  } catch (err) {
    loadingEl.remove();
    addMessage("[X] Gagal menghubungi YuniAI", false);
  }
});

function addMessage(content, isUser = false) {
  const msg = document.createElement("div");
  msg.className = "message " + (isUser ? "user-message" : "ai-message");
  msg.innerText = content;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

document.getElementById("clearBtn").addEventListener("click", () => {
  messages.innerHTML = "";
});

document.getElementById("generateImageBtn").addEventListener("click", async () => {
  const prompt = prompt("Masukkan deskripsi gambar:");
  if (!prompt) return;

  addMessage("Permintaan gambar: " + prompt, true);

  const loadingEl = document.createElement("div");
  loadingEl.className = "message ai-message loading";
  loadingEl.innerText = "YuniAI sedang membuat gambar...";
  messages.appendChild(loadingEl);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
      method: "POST",
      headers: {
        Authorization: "Bearer hf_ISI_TOKEN_KAMU",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    loadingEl.remove();

    const img = document.createElement("img");
    img.src = url;
    img.alt = prompt;
    img.className = "generated";

    const imgMsg = document.createElement("div");
    imgMsg.className = "message ai-message";
    imgMsg.appendChild(img);
    messages.appendChild(imgMsg);
    messages.scrollTop = messages.scrollHeight;
  } catch (e) {
    loadingEl.remove();
    addMessage("[X] Gagal membuat gambar", false);
  }
});