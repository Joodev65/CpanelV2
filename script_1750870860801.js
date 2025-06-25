document.getElementById("panelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.toLowerCase();
  const email = document.getElementById("email").value.toLowerCase();
  const size = document.getElementById("size").value;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = "⏳ Membuat panel...";

  try {
    const res = await fetch("https://93435678-da55-4c8f-bc50-31bad0d1b364-00-2w31z89v7uzss.sisko.replit.dev/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, email, size })
});

    const data = await res.json();

    if (data.error || data.errors) {
      resultBox.innerHTML = "❌ Gagal: " + (data.error || data.errors || "Unknown Error");
      return;
    }

    resultBox.innerHTML = `
      ✅ Panel berhasil dibuat!<br/><br/>
      🌐 Domain: ${data.panel_url}<br/>
      👤 Username: ${data.username}<br/>
      🔐 Password: ${data.password}<br/>
      💾 RAM: ${data.ram}MB<br/>
      🧠 CPU: ${data.cpu}%<br/>
      📦 Disk: ${data.disk}MB<br/>
      🆔 Server ID: ${data.server_id}
    `;
  } catch (err) {
    resultBox.innerHTML = "❌ Error saat request.";
  }
});
