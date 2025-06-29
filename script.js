// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// RAM to disk mapping with proper ratios
const ramValues = {
  "1gb": 1024, "2gb": 2048, "3gb": 3072, "4gb": 4096,
  "5gb": 5120, "6gb": 6144, "7gb": 7168, "8gb": 8192,
  "9gb": 9216, "10gb": 10240, "unlimited": 0
};

const diskValues = {
  "1gb": 10240,   // 10GB
  "2gb": 20480,   // 20GB
  "3gb": 30720,   // 30GB
  "4gb": 40960,   // 40GB
  "5gb": 51200,   // 50GB
  "6gb": 61440,   // 60GB
  "7gb": 71680,   // 70GB
  "8gb": 81920,   // 80GB
  "9gb": 92160,   // 90GB
  "10gb": 102400, // 100GB
  "unlimited": 0  // Unlimited
};

// Initialize app
function initializeApp() {
  if (document.body.classList.contains('dashboard-page')) {
    initializeDashboard();
  }
}

function initializeDashboard() {
  // Check access
  const akses = sessionStorage.getItem("akses");
  const role = sessionStorage.getItem("role");
  const nama = sessionStorage.getItem("nama");

  if (akses !== "true") {
    alert("Akses ditolak! Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  // Set user info
  const userNameEl = document.getElementById("userName");
  const userRoleEl = document.getElementById("userRole");
  
  if (userNameEl) userNameEl.textContent = nama || "User";
  if (userRoleEl) userRoleEl.textContent = role === "pt" ? "Administrator" : "Seller";

  // Set body role for CSS
  document.body.setAttribute('data-role', role);

  // Initialize navigation
  initializeNavigation();
  
  // Initialize forms
  initializeForms();
  
  // Show default section
  showSection('create');
}

// Navigation
function initializeNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      if (section) {
        showSection(section);
        setActiveNav(this);
      }
    });
  });
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Load data for list sections
  if (sectionId === 'list') {
    fetchServers();
  } else if (sectionId === 'listAdmin') {
    fetchAdmins();
  }
}

function setActiveNav(activeBtn) {
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

// Form handling
function initializeForms() {
  // Panel form
  const panelForm = document.getElementById("panelForm");
  if (panelForm) {
    panelForm.addEventListener("submit", handlePanelSubmit);
  }

  // Admin form
  const adminForm = document.getElementById("adminForm");
  if (adminForm) {
    adminForm.addEventListener("submit", handleAdminSubmit);
  }
}

async function handlePanelSubmit(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.toLowerCase().trim();
  const email = document.getElementById("email").value.toLowerCase().trim();
  const size = document.getElementById("size").value;
  const resultBox = document.getElementById("result");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!username || !email || !size) {
    showResult(resultBox, "Harap lengkapi semua field!", "error");
    return;
  }

  // Get RAM and Disk values based on selection
  const ram = ramValues[size] ?? 1024;
  const disk = diskValues[size] ?? 10240;

  showButtonLoading(submitBtn, true);
  showResult(resultBox, "Sedang membuat panel server...", "loading");

  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, ram, disk })
    });

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      showResult(resultBox, "Server error: Response bukan JSON. Server mungkin sedang offline.", "error");
      console.error('Non-JSON response:', text);
      return;
    }

    const data = await res.json();

    if (data.error || data.errors) {
      showResult(resultBox, "Gagal membuat panel: " + (data.error || data.errors || "Unknown Error"), "error");
      return;
    }

    const successMessage = `
      <div class="success-result">
        <h4>✅ Panel berhasil dibuat!</h4>
        <div class="result-details">
          <div class="result-item">
            <strong>Domain Panel:</strong> 
            <span>${data.panel_url}</span>
          </div>
          <div class="result-item">
            <strong>Username:</strong> 
            <span>${data.username}</span>
          </div>
          <div class="result-item">
            <strong>Password:</strong> 
            <span>${data.password}</span>
          </div>
          <div class="result-item">
            <strong>Email:</strong> 
            <span>${data.email}</span>
          </div>
          <div class="result-item">
            <strong>Server ID:</strong> 
            <span>${data.server_id}</span>
          </div>
          <div class="result-item">
            <strong>RAM:</strong> 
            <span>${size === 'unlimited' ? 'Unlimited' : size.toUpperCase()}</span>
          </div>
          <div class="result-item">
            <strong>Disk:</strong> 
            <span>${size === 'unlimited' ? 'Unlimited' : (disk/1024) + 'GB'}</span>
          </div>
        </div>
      </div>
    `;

    showResult(resultBox, successMessage, "success");
    e.target.reset();

  } catch (err) {
    showResult(resultBox, "Error saat membuat panel: " + err.message, "error");
  } finally {
    showButtonLoading(submitBtn, false);
  }
}

async function handleAdminSubmit(e) {
  e.preventDefault();

  const username = document.getElementById("adminUsername").value.trim();
  const email = document.getElementById("adminEmail").value.trim();
  const resultBox = document.getElementById("adminResult");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!username || !email) {
    showResult(resultBox, "Harap lengkapi semua field!", "error");
    return;
  }

  showButtonLoading(submitBtn, true);
  showResult(resultBox, "Sedang membuat admin...", "loading");

  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email })
    });

    const data = await res.json();

    if (data.error || data.errors) {
      showResult(resultBox, "Gagal membuat admin: " + (data.error || data.errors), "error");
      return;
    }

    const successMessage = `
      <div class="success-result">
        <h4>✅ Admin berhasil dibuat!</h4>
        <div class="result-details">
          <div class="result-item">
            <strong>Username:</strong> 
            <span>${data.username}</span>
          </div>
          <div class="result-item">
            <strong>Email:</strong> 
            <span>${data.email}</span>
          </div>
          <div class="result-item">
            <strong>Password:</strong> 
            <span>${data.password}</span>
          </div>
        </div>
      </div>
    `;
    
    showResult(resultBox, successMessage, "success");
    e.target.reset();
    
  } catch (err) {
    showResult(resultBox, "Error saat membuat admin: " + err.message, "error");
  } finally {
    showButtonLoading(submitBtn, false);
  }
}

// Server management
async function fetchServers() {
  const container = document.getElementById("serverList");
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner large"></div>
      <p>Memuat daftar server...</p>
    </div>
  `;

  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/servers");
    const servers = await res.json();
    
    if (!Array.isArray(servers)) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="m9 9l3 3l3-3"></path>
            <path d="m9 15l3-3l3 3"></path>
          </svg>
          <h4>Gagal memuat data</h4>
          <p>Tidak dapat mengambil data server dari API.</p>
        </div>
      `;
      return;
    }

    if (servers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h4>Belum ada server</h4>
          <p>Anda belum membuat server apapun. Buat server pertama Anda sekarang!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = servers.map(srv => `
      <div class="server-item" data-id="${srv.attributes.id}">
        <div class="server-info">
          <span class="server-name">${srv.attributes.name || 'Server Tanpa Nama'}</span>
          <span class="server-id">ID: ${srv.attributes.id}</span>
        </div>
        <button class="delete-btn" onclick="deleteServer('${srv.attributes.id}')" title="Hapus Server">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `).join('');
    
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
        </svg>
        <h4>Error koneksi</h4>
        <p>Error mengambil data server: ${err.message}</p>
      </div>
    `;
  }
}

async function deleteServer(id) {
  if (!confirm("Yakin ingin menghapus server ini?\n\nTindakan ini tidak dapat dibatalkan dan akan menghapus semua data server.")) {
    return;
  }

  const serverItem = document.querySelector(`[data-id="${id}"]`);
  if (serverItem) {
    serverItem.style.opacity = '0.5';
    serverItem.style.pointerEvents = 'none';
  }

  try {
    const res = await fetch(`https://solid-hammerhead-petalite.glitch.me/server/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      // Remove from DOM with animation
      if (serverItem) {
        serverItem.style.transform = 'translateX(-100%)';
        serverItem.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          fetchServers(); // Refresh the list
        }, 300);
      }
    } else {
      alert("Gagal menghapus server: " + (data.error || "Error tidak diketahui"));
      if (serverItem) {
        serverItem.style.opacity = '1';
        serverItem.style.pointerEvents = 'auto';
      }
    }
  } catch (err) {
    alert("Error saat menghapus server: " + err.message);
    if (serverItem) {
      serverItem.style.opacity = '1';
      serverItem.style.pointerEvents = 'auto';
    }
  }
}

// Admin management
async function fetchAdmins() {
  const container = document.getElementById("adminList");
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner large"></div>
      <p>Memuat daftar admin...</p>
    </div>
  `;

  try {
    const res = await fetch("https://solid-hammerhead-petalite.glitch.me/admins");
    const admins = await res.json();
    
    if (!Array.isArray(admins)) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
          </svg>
          <h4>Gagal memuat data</h4>
          <p>Tidak dapat mengambil data admin dari API.</p>
        </div>
      `;
      return;
    }

    const filtered = admins.filter(a => a.username && a.username.trim() !== "");
    
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <h4>Belum ada admin</h4>
          <p>Anda belum membuat admin apapun. Buat admin pertama sekarang!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(admin => `
      <div class="admin-item" data-id="${admin.id}">
        <div class="admin-info">
          <span class="admin-name">${admin.username}</span>
          <span class="admin-email">${admin.email || 'Tidak ada email'}</span>
        </div>
        <button class="delete-btn" onclick="deleteAdmin('${admin.id}')" title="Hapus Admin">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `).join('');
    
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
        </svg>
        <h4>Error koneksi</h4>
        <p>Error mengambil data admin: ${err.message}</p>
      </div>
    `;
  }
}

async function deleteAdmin(id) {
  if (!confirm("Yakin ingin menghapus admin ini?\n\nTindakan ini tidak dapat dibatalkan.")) {
    return;
  }

  const adminItem = document.querySelector(`[data-id="${id}"]`);
  if (adminItem) {
    adminItem.style.opacity = '0.5';
    adminItem.style.pointerEvents = 'none';
  }

  try {
    const res = await fetch(`https://solid-hammerhead-petalite.glitch.me/admin/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      // Remove from DOM with animation
      if (adminItem) {
        adminItem.style.transform = 'translateX(-100%)';
        adminItem.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          fetchAdmins(); // Refresh the list
        }, 300);
      }
    } else {
      alert("Gagal menghapus admin: " + (data.error || "Error tidak diketahui"));
      if (adminItem) {
        adminItem.style.opacity = '1';
        adminItem.style.pointerEvents = 'auto';
      }
    }
  } catch (err) {
    alert("Error saat menghapus admin: " + err.message);
    if (adminItem) {
      adminItem.style.opacity = '1';
      adminItem.style.pointerEvents = 'auto';
    }
  }
}

// Utility functions
function showResult(container, message, type) {
  if (!container) return;
  
  let className = '';
  switch(type) {
    case 'success':
      className = 'success-result';
      break;
    case 'error':
      className = 'error-result';
      break;
    case 'loading':
      className = 'loading-result';
      break;
    default:
      className = 'info-result';
  }
  
  if (type === 'loading') {
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
  } else if (type === 'error') {
    container.innerHTML = `
      <div class="error-result">
        <p>❌ ${message}</p>
      </div>
    `;
  } else {
    container.innerHTML = message;
  }
  
  // Add animation
  container.style.opacity = '0';
  container.style.transform = 'translateY(10px)';
  setTimeout(() => {
    container.style.transition = 'all 0.3s ease';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 10);
}

function showButtonLoading(button, loading) {
  if (!button) return;
  
  const btnText = button.querySelector('.btn-text');
  const btnLoader = button.querySelector('.btn-loader');
  
  if (loading) {
    button.disabled = true;
    button.classList.add('loading');
    if (btnText) btnText.style.opacity = '0';
    if (btnLoader) btnLoader.classList.add('active');
  } else {
    button.disabled = false;
    button.classList.remove('loading');
    if (btnText) btnText.style.opacity = '1';
    if (btnLoader) btnLoader.classList.remove('active');
  }
}

function logout() {
  if (confirm("Yakin ingin logout dari dashboard?")) {
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

// Add mobile swipe support
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Swipe left - next section
    const activeNav = document.querySelector('.nav-item.active');
    const nextNav = activeNav ? activeNav.nextElementSibling : null;
    if (nextNav && nextNav.classList.contains('nav-item')) {
      nextNav.click();
    }
  }
  
  if (touchEndX > touchStartX + 50) {
    // Swipe right - previous section
    const activeNav = document.querySelector('.nav-item.active');
    const prevNav = activeNav ? activeNav.previousElementSibling : null;
    if (prevNav && prevNav.classList.contains('nav-item')) {
      prevNav.click();
    }
  }
}

// Touch event listeners for mobile swipe
document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        document.querySelector('[data-section="create"]')?.click();
        break;
      case '2':
        e.preventDefault();
        document.querySelector('[data-section="list"]')?.click();
        break;
      case '3':
        e.preventDefault();
        document.querySelector('[data-section="createAdmin"]')?.click();
        break;
      case '4':
        e.preventDefault();
        document.querySelector('[data-section="listAdmin"]')?.click();
        break;
    }
  }
});

// Add CSS classes for better error/success styling
const additionalCSS = `
<style>
.error-result {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  color: var(--error);
  text-align: center;
}

.loading-result {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  color: var(--primary);
  text-align: center;
}

.info-result {
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  color: var(--text-secondary);
  text-align: center;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalCSS);