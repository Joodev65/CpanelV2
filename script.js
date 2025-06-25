
document.getElementById("panelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.toLowerCase();
  const email = document.getElementById("email").value.toLowerCase();
  const size = document.getElementById("size").value;
  const resultBox = document.getElementById("result");

  // Convert size ke RAM dalam MB
  let ram = 1024; // default 1GB
  if (size === "2gb") ram = 2048;
  else if (size === "3gb") ram = 3072;
  else if (size === "4gb") ram = 4096;
  else if (size === "5gb") ram = 5120;
  else if (size === "6gb") ram = 6144;
  else if (size === "7gb") ram = 7168;
  else if (size === "8gb") ram = 8192;
  else if (size === "9gb") ram = 9216;
  else if (size === "10gb") ram = 10240;
  else if (size === "unlimited") ram = 0; // unlimited

  resultBox.innerHTML = "⏳ Membuat panel...";

  try {
    // Gunakan URL relatif untuk menggunakan domain yang sama
    const res = await fetch("/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, ram })
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
      📧 Email: ${data.email}<br/>
      🆔 Server ID: ${data.server_id}
    `;
  } catch (err) {
    resultBox.innerHTML = "❌ Error saat request: " + err.message;
  }
});
