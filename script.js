const whitelist = {
  "admin@example.com": {
    password: "admin123",
    role: "pt",
    ip: ["127.0.0.1"]
  },
  "resseler@example.com": {
    password: "ressel123",
    role: "resseler",
    ip: ["127.0.0.1"]
  }
};

async function login() {
  const email = document.getElementById("email").value.toLowerCase();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("errorBox");

  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    const ip = data.ip;

    if (!whitelist[email]) return errorBox.textContent = "Akun tidak ditemukan!";
    if (whitelist[email].password !== password) return errorBox.textContent = "Password salah!";
    if (!whitelist[email].ip.includes(ip)) return errorBox.textContent = "Akses IP ditolak!";

    localStorage.setItem("login", JSON.stringify({ email, role: whitelist[email].role }));
    location.href = "cpanel.html";
  } catch (err) {
    errorBox.textContent = "Gagal verifikasi IP.";
  }
}
