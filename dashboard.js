/* ============================================
   EVENT VISTA - Dashboard JavaScript
   Dashboard Interactivity & Data Management
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    initDashboardData();
    initPackageForm();
    initTabs();
    loadUserInfo();
});

/* === Sidebar Toggle for Mobile === */
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            overlay?.classList.toggle('active');
        });

        overlay?.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Highlight active nav item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        }
    });
}

/* === Load User Info === */
function loadUserInfo() {
    const userData = localStorage.getItem('eventVista_user');

    if (userData) {
        const user = JSON.parse(userData);

        // Update user name displays
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.fullName || user.name || 'User';
        });

        // Update avatar initials
        const avatars = document.querySelectorAll('.user-avatar');
        avatars.forEach(avatar => {
            const name = user.fullName || user.name || 'U';
            avatar.textContent = name.charAt(0).toUpperCase();
        });

        // Update role badge
        const roleBadges = document.querySelectorAll('.user-role');
        roleBadges.forEach(badge => {
            badge.textContent = user.role === 'vendor' ? 'Vendor' : 'Customer';
        });

        // Update welcome message
        const welcomeEl = document.querySelector('.welcome-name');
        if (welcomeEl) {
            welcomeEl.textContent = user.fullName || user.name || 'there';
        }
    }
}

/* === Initialize Dashboard Data === */
function initDashboardData() {
    // Load saved packages for vendor
    loadPackages();

    // Load saved vendors for customer
    loadSavedVendors();

    // Load leads for vendor
    loadLeads();

    // Initialize stats counters
    animateStats();
}

/* === Animate Stats === */
function animateStats() {
    const stats = document.querySelectorAll('.stat-value');

    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        const duration = 1500;
        const steps = 40;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + suffix;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    });
}

/* === Package Form Handler === */
function initPackageForm() {
    const packageForm = document.getElementById('packageForm');

    if (!packageForm) return;

    packageForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            id: Date.now(),
            name: document.getElementById('packageName').value.trim(),
            category: document.getElementById('packageCategory').value,
            price: document.getElementById('packagePrice').value,
            description: document.getElementById('packageDescription').value.trim(),
            features: document.getElementById('packageFeatures')?.value.trim() || '',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        // Validate
        if (!formData.name || !formData.category || !formData.price) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Save to localStorage
        const packages = JSON.parse(localStorage.getItem('eventVista_packages') || '[]');
        packages.push(formData);
        localStorage.setItem('eventVista_packages', JSON.stringify(packages));

        // Show success
        showNotification('Package added successfully!', 'success');

        // Reset form
        packageForm.reset();

        // Reload packages list
        loadPackages();
    });
}

/* === Load Packages === */
function loadPackages() {
    const packagesList = document.getElementById('packagesList');

    if (!packagesList) return;

    const packages = JSON.parse(localStorage.getItem('eventVista_packages') || '[]');

    if (packages.length === 0) {
        packagesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h4>No Packages Yet</h4>
        <p>Create your first package to start receiving leads.</p>
      </div>
    `;
        return;
    }

    packagesList.innerHTML = packages.map(pkg => `
    <tr>
      <td>${pkg.name}</td>
      <td>${pkg.category}</td>
      <td>₹${formatNumber(pkg.price)}</td>
      <td><span class="status ${pkg.status}">${pkg.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewPackage(${pkg.id})" title="View">👁️</button>
          <button class="action-btn edit" onclick="editPackage(${pkg.id})" title="Edit">✏️</button>
          <button class="action-btn delete" onclick="deletePackage(${pkg.id})" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* === Delete Package === */
function deletePackage(id) {
    if (!confirm('Are you sure you want to delete this package?')) return;

    let packages = JSON.parse(localStorage.getItem('eventVista_packages') || '[]');
    packages = packages.filter(pkg => pkg.id !== id);
    localStorage.setItem('eventVista_packages', JSON.stringify(packages));

    showNotification('Package deleted successfully', 'success');
    loadPackages();
}

/* === View Package === */
function viewPackage(id) {
    const packages = JSON.parse(localStorage.getItem('eventVista_packages') || '[]');
    const pkg = packages.find(p => p.id === id);

    if (pkg) {
        alert(`
Package: ${pkg.name}
Category: ${pkg.category}
Price: ₹${formatNumber(pkg.price)}
Description: ${pkg.description || 'N/A'}
Features: ${pkg.features || 'N/A'}
Status: ${pkg.status}
    `);
    }
}

/* === Edit Package === */
function editPackage(id) {
    const packages = JSON.parse(localStorage.getItem('eventVista_packages') || '[]');
    const pkg = packages.find(p => p.id === id);

    if (pkg) {
        document.getElementById('packageName').value = pkg.name;
        document.getElementById('packageCategory').value = pkg.category;
        document.getElementById('packagePrice').value = pkg.price;
        document.getElementById('packageDescription').value = pkg.description || '';
        if (document.getElementById('packageFeatures')) {
            document.getElementById('packageFeatures').value = pkg.features || '';
        }

        // Remove old package
        deletePackage(id);

        // Scroll to form
        document.querySelector('.package-form')?.scrollIntoView({ behavior: 'smooth' });

        showNotification('Edit the package and save again', 'info');
    }
}

/* === Load Saved Vendors (for Customer Dashboard) === */
function loadSavedVendors() {
    const savedList = document.getElementById('savedVendorsList');

    if (!savedList) return;

    // Mock data for saved vendors
    const savedVendors = [
        { id: 1, name: 'Royal Events', category: 'Event Planner', rating: 4.8, location: 'Mumbai' },
        { id: 2, name: 'Dream Decorators', category: 'Decoration', rating: 4.5, location: 'Delhi' },
        { id: 3, name: 'Grand Venue Hall', category: 'Venue', rating: 4.9, location: 'Bangalore' }
    ];

    savedList.innerHTML = savedVendors.map(vendor => `
    <div class="saved-item">
      <div class="saved-item-image">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100&h=100&fit=crop" alt="${vendor.name}">
      </div>
      <div class="saved-item-info">
        <h4>${vendor.name}</h4>
        <p>${vendor.category} • ${vendor.location}</p>
        <div class="rating">⭐ ${vendor.rating}</div>
      </div>
      <button class="contact-btn" onclick="contactVendor('${vendor.name}')">Contact</button>
    </div>
  `).join('');
}

/* === Load Leads (for Vendor Dashboard) === */
function loadLeads() {
    const leadsList = document.getElementById('leadsList');

    if (!leadsList) return;

    // Mock data for leads
    const leads = [
        { id: 1, name: 'Rahul Sharma', event: 'Wedding', date: '2024-03-15', budget: '500000', status: 'new' },
        { id: 2, name: 'Priya Patel', event: 'Corporate Event', date: '2024-02-28', budget: '200000', status: 'contacted' },
        { id: 3, name: 'Amit Kumar', event: 'Birthday Party', date: '2024-03-05', budget: '50000', status: 'new' }
    ];

    leadsList.innerHTML = leads.map(lead => `
    <div class="lead-card">
      <div class="lead-avatar">${lead.name.charAt(0)}</div>
      <div class="lead-info">
        <h4>${lead.name}</h4>
        <p>${lead.event}</p>
        <div class="lead-meta">
          <span>📅 ${formatDate(lead.date)}</span>
          <span>💰 ₹${formatNumber(lead.budget)}</span>
        </div>
      </div>
      <div class="lead-actions">
        <button class="action-btn view" onclick="viewLead(${lead.id})" title="View Details">👁️</button>
        <button class="action-btn edit" onclick="contactLead('${lead.name}')" title="Contact">📞</button>
      </div>
    </div>
  `).join('');
}

/* === Contact Functions === */
function contactVendor(name) {
    showNotification(`Opening contact options for ${name}...`, 'info');
}

function contactLead(name) {
    showNotification(`Contacting ${name}...`, 'info');
}

function viewLead(id) {
    showNotification('Lead details would open in a modal', 'info');
}

/* === Tab Switching === */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId)?.classList.add('active');
        });
    });
}

/* === Notification System === */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
    <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;

    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#FF6B35'};
    color: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 5px;
    opacity: 0.8;
  }
  .notification-close:hover {
    opacity: 1;
  }
`;
document.head.appendChild(notificationStyle);

/* === Utility Functions === */
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/* === Logout Function === */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('eventVista_user');
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

/* === Search Functionality === */
function initSearch() {
    const searchInput = document.getElementById('dashboardSearch');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();

        // Filter table rows
        document.querySelectorAll('.data-table tbody tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

initSearch();

console.log('📊 Event Vista - Dashboard JS Loaded Successfully!');
