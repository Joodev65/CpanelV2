
document.getElementById("panelForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const size = document.getElementById("size").value;
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const resultBox = document.getElementById("result");

  // Simulasi konfigurasi (biasanya ini di-backend, tapi dibuat dummy)
  const sizeMap = {
    "1gb": { ram: "1000", disk: "1000", cpu: "40" },
    "2gb": { ram: "2000", disk: "1000", cpu: "60" },
    "3gb": { ram: "3000", disk: "2000", cpu: "80" },
    "4gb": { ram: "4000", disk: "2000", cpu: "100" },
    "5gb": { ram: "5000", disk: "3000", cpu: "120" },
    "6gb": { ram: "6000", disk: "3000", cpu: "140" },
    "7gb": { ram: "7000", disk: "4000", cpu: "160" },
    "8gb": { ram: "8000", disk: "4000", cpu: "180" },
    "9gb": { ram: "9000", disk: "5000", cpu: "200" },
    "10gb": { ram: "10000", disk: "5000", cpu: "220" },
    "unlimited": { ram: "0", disk: "0", cpu: "0" }
  };

  const config = sizeMap[size];
  if (!config) return resultBox.innerHTML = "<span style='color: red;'>Ukuran tidak valid!</span>";

  // Dummy API URL dan Key (disesuaikan kalau mau backend asli)
  const API_URL = "https://izanhost.storedigital.web.id";
  const API_KEY = "ptlc_tTtb3KgixTyHdnUH7Ep9hhV6hg9i9H0vjkcw4xjcs2h";
  const nestID = 5;
  const eggID = 15;
  const locationID = 1;

  const bodyData = {
    email: email,
    username: username,
    first_name: username,
    last_name: "Panel",
    language: "en",
    password: username + Math.random().toString(36).substring(2, 6)
  };

  resultBox.innerHTML = "Mengirim permintaan panel...";

  // Simulasi: hanya tampilkan hasil seolah berhasil
  setTimeout(() => {
    resultBox.innerHTML = `
      <strong>Panel Berhasil Dibuat 🎉</strong><br>
      <b>Username:</b> ${username}<br>
      <b>Email:</b> ${email}<br>
      <b>Password:</b> ${bodyData.password}<br>
      <b>RAM:</b> ${config.ram == "0" ? "Unlimited" : config.ram + "MB"}<br>
      <b>Disk:</b> ${config.disk == "0" ? "Unlimited" : config.disk + "MB"}<br>
      <b>CPU:</b> ${config.cpu == "0" ? "Unlimited" : config.cpu + "%"}<br>
    `;
  }, 1500);
});
