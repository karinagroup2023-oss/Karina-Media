/* ===== NŪRA Admin Panel ===== */
/* ===== PRODUCTS loaded from products.js ===== */

/* ===== STOCK (v2 — variant-based, compatible with main site) ===== */
const Stock = {
    _totalDefaults: { 1:15, 2:8, 3:20, 4:12, 5:10, 6:6, 7:5, 8:25, 9:7, 10:18, 11:4, 12:14, 13:9, 14:22, 15:30, 16:11 },
    _getStore() {
        try { const s = JSON.parse(localStorage.getItem('nura_stock_v2') || 'null'); return s || {}; }
        catch { return {}; }
    },
    _save(stock) { try { localStorage.setItem('nura_stock_v2', JSON.stringify(stock)); } catch {} },
    get(id) {
        const store = this._getStore();
        const prefix = `${id}_`;
        let total = 0;
        for (const key in store) { if (key.startsWith(prefix)) total += store[key]; }
        return total || (this._totalDefaults[id] || 0);
    },
    set(id, qty) {
        const p = PRODUCTS.find(pr => pr.id === id);
        if (!p) return;
        const stock = this._getStore();
        const prefix = `${id}_`;
        for (const key in stock) { if (key.startsWith(prefix)) delete stock[key]; }
        const variants = [];
        p.sizes.forEach(s => { p.colors.forEach(c => { variants.push(`${id}_${s}_${c.name}`); }); });
        if (variants.length === 0) variants.push(`${id}_ONE_${p.colorName}`);
        const perVariant = Math.floor(qty / variants.length);
        const remainder = qty % variants.length;
        variants.forEach((key, i) => { stock[key] = perVariant + (i < remainder ? 1 : 0); });
        this._save(stock);
    },
    setAll(stockMap) {
        for (const id in stockMap) { this.set(parseInt(id), stockMap[id]); }
    }
};

/* ===== BANK ACCOUNTS ===== */
function getBankAccounts() {
    try { return JSON.parse(localStorage.getItem('nura_bank_accounts') || '[]'); } catch { return []; }
}
function saveBankAccounts(accounts) {
    try { localStorage.setItem('nura_bank_accounts', JSON.stringify(accounts)); } catch {}
}

/* ===== HELPERS ===== */
function esc(str) {
    if (typeof str !== 'string') return str;
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, c => map[c]);
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getOrders() {
    try { return JSON.parse(localStorage.getItem('nura_orders') || '[]'); } catch { return []; }
}
function saveOrders(orders) {
    try { localStorage.setItem('nura_orders', JSON.stringify(orders)); } catch {}
}
function getCustomers() {
    try { return JSON.parse(localStorage.getItem('nura_customers') || '[]'); } catch { return []; }
}
function getStaff() {
    try { return JSON.parse(localStorage.getItem('nura_staff') || '[]'); } catch { return []; }
}
function saveStaff(staff) {
    try { localStorage.setItem('nura_staff', JSON.stringify(staff)); } catch {}
}

const statusLabels = {
    new: 'Новый',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
};
const paymentLabels = { kaspi: 'Kaspi Pay', halyk: 'Halyk Bank', card: 'Банковская карта' };
const categoryLabels = { women: 'Женщинам', men: 'Мужчинам', accessories: 'Аксессуары' };

/* ===== AUTH ===== */
const DEFAULT_CREDENTIALS = { login: 'admin', password: 'nura2026', role: 'owner' };

function initAuth() {
    // Ensure owner is always in staff list
    const staff = getStaff();
    if (!staff.find(s => s.login === 'admin')) {
        staff.push({ id: 1, login: 'admin', name: 'Владелец', role: 'owner', email: '', phone: '', created: new Date().toISOString() });
        saveStaff(staff);
    }
}

function checkAuth() {
    const session = sessionStorage.getItem('nura_admin_session');
    if (session) {
        try {
            const data = JSON.parse(session);
            return data;
        } catch {}
    }
    return null;
}

function login(username, password) {
    // Check owner
    if (username === DEFAULT_CREDENTIALS.login && password === DEFAULT_CREDENTIALS.password) {
        const session = { login: username, role: 'owner', name: 'Владелец' };
        sessionStorage.setItem('nura_admin_session', JSON.stringify(session));
        return session;
    }
    // Check staff
    const staff = getStaff();
    const member = staff.find(s => s.login === username && s.password === password && s.login !== 'admin');
    if (member) {
        const session = { login: member.login, role: member.role, name: member.name };
        sessionStorage.setItem('nura_admin_session', JSON.stringify(session));
        return session;
    }
    return null;
}

function logout() {
    sessionStorage.removeItem('nura_admin_session');
    location.reload();
}

/* ===== STATE ===== */
let currentPage = 'dashboard';
let currentSession = null;
let orderFilter = 'all';

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    currentSession = checkAuth();

    if (currentSession) {
        showAdmin();
    } else {
        document.getElementById('loginScreen').style.display = '';
    }

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value;
        const session = login(user, pass);
        if (session) {
            currentSession = session;
            showAdmin();
        } else {
            document.getElementById('loginError').textContent = 'Неверный логин или пароль';
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('logoutBtn2').addEventListener('click', logout);

    // Sidebar nav
    document.querySelectorAll('.sidebar__link[data-page]').forEach(link => {
        link.addEventListener('click', () => {
            currentPage = link.dataset.page;
            document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            renderPage();
            // Close sidebar on mobile
            document.getElementById('sidebar').classList.remove('active');
        });
    });

    // Mobile burger
    document.getElementById('adminBurger').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.adm-modal.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Click outside modal
    document.querySelectorAll('.adm-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
});

function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminLayout').style.display = '';

    // Hide staff tab for non-owner
    if (currentSession.role !== 'owner') {
        const staffBtn = document.querySelector('[data-page="staff"]');
        if (staffBtn) staffBtn.style.display = 'none';
    }

    renderPage();
}

/* ===== RENDER PAGE ===== */
function renderPage() {
    const main = document.getElementById('adminMain');
    switch (currentPage) {
        case 'dashboard': renderDashboard(main); break;
        case 'orders': renderOrders(main); break;
        case 'products': renderProductsPage(main); break;
        case 'customers': renderCustomers(main); break;
        case 'warehouse': renderWarehouse(main); break;
        case 'bank': renderBankAccounts(main); break;
        case 'staff': renderStaffPage(main); break;
    }
}

/* ===== DASHBOARD ===== */
function renderDashboard(el) {
    const orders = getOrders();
    const customers = getCustomers();

    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0) + (o.deliveryFee || 0), 0);
    const newOrders = orders.filter(o => o.status === 'new').length;
    const recentOrders = orders.slice(0, 8);

    // Revenue by last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayOrders = orders.filter(o => o.date && o.date.slice(0, 10) === key && o.status !== 'cancelled');
        const rev = dayOrders.reduce((s, o) => s + (o.total || 0), 0);
        days.push({ label: d.toLocaleDateString('ru-RU', { weekday: 'short' }), value: rev });
    }
    const maxRev = Math.max(...days.map(d => d.value), 1);

    el.innerHTML = `
        <div class="page-header"><h1>Дашборд</h1></div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card__label">Всего заказов</div>
                <div class="stat-card__value">${orders.length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__label">Новые заказы</div>
                <div class="stat-card__value">${newOrders}</div>
                ${newOrders > 0 ? '<div class="stat-card__change stat-card__change--up">Ожидают обработки</div>' : ''}
            </div>
            <div class="stat-card">
                <div class="stat-card__label">Выручка</div>
                <div class="stat-card__value">${formatPrice(totalRevenue)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__label">Клиенты</div>
                <div class="stat-card__value">${customers.length}</div>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px">
            <div class="card">
                <div class="card__header">
                    <span class="card__title">Последние заказы</span>
                    <button class="btn btn--outline btn--sm" onclick="currentPage='orders';document.querySelector('[data-page=orders]').classList.add('active');document.querySelector('[data-page=dashboard]').classList.remove('active');renderPage()">Все заказы</button>
                </div>
                <div class="table-responsive">
                    ${recentOrders.length > 0 ? `
                    <table class="adm-table">
                        <thead><tr><th>Заказ</th><th>Клиент</th><th>Сумма</th><th>Статус</th></tr></thead>
                        <tbody>
                            ${recentOrders.map(o => `<tr>
                                <td><strong>${esc(o.id)}</strong><br><span style="font-size:11px;color:var(--gray)">${formatDate(o.date)}</span></td>
                                <td>${esc(o.customer?.name || '')} ${esc(o.customer?.surname || '')}</td>
                                <td>${formatPrice((o.total || 0) + (o.deliveryFee || 0))}</td>
                                <td><span class="status status--${o.status}">${statusLabels[o.status] || o.status}</span></td>
                            </tr>`).join('')}
                        </tbody>
                    </table>` : '<div class="card__body"><div class="empty-state"><p>Заказов пока нет</p></div></div>'}
                </div>
            </div>
            <div class="card">
                <div class="card__header"><span class="card__title">Выручка за 7 дней</span></div>
                <div class="card__body">
                    <div class="chart-bars">
                        ${days.map(d => `
                        <div class="chart-bar">
                            <div class="chart-bar__fill" style="height:${Math.max((d.value / maxRev) * 100, 4)}%"></div>
                            <div class="chart-bar__label">${d.label}</div>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;
}

/* ===== ORDERS ===== */
function renderOrders(el) {
    const orders = getOrders();
    const filtered = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

    const counts = { all: orders.length };
    orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });

    el.innerHTML = `
        <div class="page-header"><h1>Заказы</h1></div>
        <div class="filter-bar">
            ${['all', 'new', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => `
                <button class="filter-bar__btn ${orderFilter === f ? 'active' : ''}" data-filter="${f}">
                    ${f === 'all' ? 'Все' : statusLabels[f]} (${counts[f] || 0})
                </button>`).join('')}
        </div>
        <div class="card">
            <div class="table-responsive">
            ${filtered.length > 0 ? `
            <table class="adm-table">
                <thead><tr><th>Заказ</th><th>Дата</th><th>Клиент</th><th>Товары</th><th>Сумма</th><th>Оплата</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>
                    ${filtered.map((o, i) => `<tr>
                        <td><strong>${esc(o.id)}</strong></td>
                        <td style="white-space:nowrap">${formatDateTime(o.date)}</td>
                        <td>
                            ${esc(o.customer?.name || '')} ${esc(o.customer?.surname || '')}<br>
                            <span style="font-size:11px;color:var(--gray)">${esc(o.customer?.phone || '')}</span>
                        </td>
                        <td>${o.items?.length || 0} шт.</td>
                        <td style="white-space:nowrap"><strong>${formatPrice((o.total || 0) + (o.deliveryFee || 0))}</strong></td>
                        <td>${paymentLabels[o.payment] || o.payment}</td>
                        <td>
                            <select class="order-status-select" data-order-id="${esc(o.id)}" style="padding:4px 8px;font-size:12px;border:1px solid var(--gray-lighter);border-radius:4px">
                                ${Object.keys(statusLabels).map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${statusLabels[s]}</option>`).join('')}
                            </select>
                        </td>
                        <td><button class="btn btn--outline btn--sm order-details-btn" data-order-id="${esc(o.id)}">Детали</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>` : '<div class="card__body"><div class="empty-state"><p>Нет заказов с таким статусом</p></div></div>'}
            </div>
        </div>`;

    // Filter buttons
    el.querySelectorAll('.filter-bar__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            orderFilter = btn.dataset.filter;
            renderOrders(el);
        });
    });

    // Status change
    el.querySelectorAll('.order-status-select').forEach(select => {
        select.addEventListener('change', () => {
            const orders = getOrders();
            const order = orders.find(o => o.id === select.dataset.orderId);
            if (order) {
                order.status = select.value;
                saveOrders(orders);
                renderOrders(el);
            }
        });
    });

    // Order details
    el.querySelectorAll('.order-details-btn').forEach(btn => {
        btn.addEventListener('click', () => showOrderDetails(btn.dataset.orderId));
    });
}

function showOrderDetails(orderId) {
    const orders = getOrders();
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;

    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');

    content.innerHTML = `
        <div class="adm-modal__header">
            <h3>Заказ ${esc(o.id)}</h3>
            <button class="adm-modal__close" onclick="document.getElementById('productModal').classList.remove('active')">&times;</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
            <div>
                <div style="font-size:12px;color:var(--gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Клиент</div>
                <div style="font-size:14px"><strong>${esc(o.customer?.name || '')} ${esc(o.customer?.surname || '')}</strong></div>
                <div style="font-size:13px;color:var(--gray)">${esc(o.customer?.phone || '')}</div>
                <div style="font-size:13px;color:var(--gray)">${esc(o.customer?.email || '')}</div>
            </div>
            <div>
                <div style="font-size:12px;color:var(--gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Доставка</div>
                <div style="font-size:14px">${esc(o.customer?.city || '')} — ${esc(o.customer?.address || '')}</div>
                <div style="font-size:13px;color:var(--gray)">${formatDateTime(o.date)}</div>
            </div>
        </div>
        <table class="adm-table" style="margin-bottom:20px">
            <thead><tr><th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th></tr></thead>
            <tbody>
                ${(o.items || []).map(item => `<tr>
                    <td>${esc(item.brand || '')} ${esc(item.name || '')}</td>
                    <td>${esc(item.size || '')}</td>
                    <td>${item.qty}</td>
                    <td>${formatPrice(item.price * item.qty)}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid var(--gray-lighter);font-size:14px">
            <span>Товары</span><span>${formatPrice(o.total || 0)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:var(--gray)">
            <span>Доставка</span><span>${o.deliveryFee ? formatPrice(o.deliveryFee) : 'Бесплатно'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid var(--gray-lighter);font-size:16px;font-weight:600">
            <span>Итого</span><span>${formatPrice((o.total || 0) + (o.deliveryFee || 0))}</span>
        </div>
        <div style="margin-top:12px;font-size:13px;color:var(--gray)">
            Оплата: <strong>${paymentLabels[o.payment] || o.payment}</strong> &nbsp;|&nbsp;
            Статус: <span class="status status--${o.status}">${statusLabels[o.status]}</span>
        </div>`;

    modal.classList.add('active');
}

/* ===== PRODUCTS ===== */
function renderProductsPage(el) {
    el.innerHTML = `
        <div class="page-header">
            <h1>Товары</h1>
            <div class="page-header__actions">
                <button class="btn btn--primary" id="addProductBtn">+ Добавить товар</button>
            </div>
        </div>
        <div class="card">
            <div class="table-responsive">
            <table class="adm-table">
                <thead><tr><th></th><th>Название</th><th>Категория</th><th>Цена</th><th>Склад</th><th>Бейдж</th><th>Действия</th></tr></thead>
                <tbody>
                    ${PRODUCTS.map(p => {
                        const stock = Stock.get(p.id);
                        return `<tr>
                        <td><div class="product-thumb">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : ''}</div></td>
                        <td><strong>${esc(p.name)}</strong><br><span style="font-size:11px;color:var(--gray)">${esc(p.brand)}</span></td>
                        <td>${categoryLabels[p.category] || p.category}</td>
                        <td style="white-space:nowrap">${formatPrice(p.price)}</td>
                        <td><span style="font-weight:600;${stock <= 0 ? 'color:var(--red)' : stock <= 5 ? 'color:var(--orange)' : ''}">${stock} шт.</span></td>
                        <td>${p.badge ? `<span class="status status--new">${esc(p.badge)}</span>` : '—'}</td>
                        <td>
                            <button class="btn btn--outline btn--sm edit-product-btn" data-id="${p.id}">Изменить</button>
                        </td>
                    </tr>`;
                    }).join('')}
                </tbody>
            </table>
            </div>
        </div>`;

    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    el.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => openProductModal(parseInt(btn.dataset.id, 10)));
    });
}

function openProductModal(productId) {
    const p = productId ? PRODUCTS.find(pr => pr.id === productId) : null;
    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');

    content.innerHTML = `
        <div class="adm-modal__header">
            <h3>${p ? 'Редактировать товар' : 'Добавить товар'}</h3>
            <button class="adm-modal__close" onclick="document.getElementById('productModal').classList.remove('active')">&times;</button>
        </div>
        <form id="productForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Название *</label>
                    <input type="text" id="pName" value="${p ? esc(p.name) : ''}" required>
                </div>
                <div class="form-group">
                    <label>Бренд</label>
                    <input type="text" id="pBrand" value="${p ? esc(p.brand) : 'NŪRA'}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Категория</label>
                    <select id="pCategory">
                        <option value="women" ${p?.category === 'women' ? 'selected' : ''}>Женщинам</option>
                        <option value="men" ${p?.category === 'men' ? 'selected' : ''}>Мужчинам</option>
                        <option value="accessories" ${p?.category === 'accessories' ? 'selected' : ''}>Аксессуары</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Бейдж</label>
                    <select id="pBadge">
                        <option value="" ${!p?.badge ? 'selected' : ''}>Нет</option>
                        <option value="Новинка" ${p?.badge === 'Новинка' ? 'selected' : ''}>Новинка</option>
                        <option value="Sale" ${p?.badge === 'Sale' ? 'selected' : ''}>Sale</option>
                        <option value="Премиум" ${p?.badge === 'Премиум' ? 'selected' : ''}>Премиум</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Цена (₸) *</label>
                    <input type="number" id="pPrice" value="${p ? p.price : ''}" required min="0">
                </div>
                <div class="form-group">
                    <label>Старая цена (₸)</label>
                    <input type="number" id="pOldPrice" value="${p?.oldPrice || ''}" min="0">
                </div>
            </div>
            <div class="form-group">
                <label>URL изображения</label>
                <input type="url" id="pImage" value="${p ? esc(p.image) : ''}" placeholder="https://...">
            </div>
            <div style="display:flex;gap:12px;margin-top:24px">
                <button type="button" class="btn btn--outline" onclick="document.getElementById('productModal').classList.remove('active')">Отмена</button>
                <button type="submit" class="btn btn--primary">${p ? 'Сохранить' : 'Добавить'}</button>
            </div>
        </form>
        <p style="font-size:11px;color:var(--gray);margin-top:16px">Демо-режим: изменения отображаются в панели, но не влияют на основной сайт</p>`;

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // In demo mode, just close the modal
        modal.classList.remove('active');
        renderPage();
    });

    modal.classList.add('active');
}

/* ===== CUSTOMERS ===== */
function renderCustomers(el) {
    const customers = getCustomers();
    const orders = getOrders();

    el.innerHTML = `
        <div class="page-header"><h1>Клиенты</h1></div>
        <div class="card">
            <div class="table-responsive">
            ${customers.length > 0 ? `
            <table class="adm-table">
                <thead><tr><th>Имя</th><th>Телефон</th><th>Email</th><th>Город</th><th>Заказы</th><th>Сумма</th><th>Последний заказ</th></tr></thead>
                <tbody>
                    ${customers.map(c => {
                        const custOrders = orders.filter(o => o.customer?.phone?.replace(/\D/g,'') === c.phone?.replace(/\D/g,''));
                        const totalSpent = custOrders.reduce((s, o) => s + (o.total || 0), 0);
                        return `<tr>
                            <td><strong>${esc(c.name || '')} ${esc(c.surname || '')}</strong></td>
                            <td>${esc(c.phone || '')}</td>
                            <td>${esc(c.email || '—')}</td>
                            <td>${esc(c.city || '')}</td>
                            <td>${custOrders.length}</td>
                            <td style="white-space:nowrap">${formatPrice(totalSpent)}</td>
                            <td>${c.lastOrder ? formatDate(c.lastOrder) : '—'}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>` : `
            <div class="card__body">
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <p>Клиентов пока нет</p>
                    <span style="font-size:13px">Клиенты появятся после первых заказов на сайте</span>
                </div>
            </div>`}
            </div>
        </div>`;
}

/* ===== STAFF ===== */
function renderStaffPage(el) {
    if (currentSession.role !== 'owner') {
        el.innerHTML = '<div class="page-header"><h1>Доступ запрещён</h1></div><p>Управление сотрудниками доступно только владельцу.</p>';
        return;
    }

    const staff = getStaff();

    el.innerHTML = `
        <div class="page-header">
            <h1>Сотрудники</h1>
            <div class="page-header__actions">
                <button class="btn btn--primary" id="addStaffBtn">+ Добавить сотрудника</button>
            </div>
        </div>
        <div class="card">
            <div class="table-responsive">
            <table class="adm-table">
                <thead><tr><th>Имя</th><th>Логин</th><th>Роль</th><th>Email</th><th>Телефон</th><th>Добавлен</th><th>Действия</th></tr></thead>
                <tbody>
                    ${staff.map(s => `<tr>
                        <td><strong>${esc(s.name)}</strong></td>
                        <td>${esc(s.login)}</td>
                        <td><span class="role-badge role-badge--${s.role}">${s.role === 'owner' ? 'Владелец' : s.role === 'admin' ? 'Администратор' : 'Менеджер'}</span></td>
                        <td>${esc(s.email || '—')}</td>
                        <td>${esc(s.phone || '—')}</td>
                        <td>${s.created ? formatDate(s.created) : '—'}</td>
                        <td>
                            ${s.login !== 'admin' ? `
                                <button class="btn btn--outline btn--sm edit-staff-btn" data-login="${esc(s.login)}">Изменить</button>
                                <button class="btn btn--danger btn--sm delete-staff-btn" data-login="${esc(s.login)}" style="margin-left:4px">Удалить</button>
                            ` : '<span style="font-size:11px;color:var(--gray)">Основной</span>'}
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
            </div>
        </div>`;

    document.getElementById('addStaffBtn').addEventListener('click', () => openStaffModal());
    el.querySelectorAll('.edit-staff-btn').forEach(btn => {
        btn.addEventListener('click', () => openStaffModal(btn.dataset.login));
    });
    el.querySelectorAll('.delete-staff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm(`Удалить сотрудника "${btn.dataset.login}"?`)) {
                const staff = getStaff();
                const idx = staff.findIndex(s => s.login === btn.dataset.login);
                if (idx > -1) { staff.splice(idx, 1); saveStaff(staff); }
                renderStaffPage(el);
            }
        });
    });
}

function openStaffModal(loginToEdit) {
    const staff = getStaff();
    const member = loginToEdit ? staff.find(s => s.login === loginToEdit) : null;
    const modal = document.getElementById('staffModal');
    const content = document.getElementById('staffModalContent');

    content.innerHTML = `
        <div class="adm-modal__header">
            <h3>${member ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h3>
            <button class="adm-modal__close" onclick="document.getElementById('staffModal').classList.remove('active')">&times;</button>
        </div>
        <form id="staffForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Имя *</label>
                    <input type="text" id="sName" value="${member ? esc(member.name) : ''}" required>
                </div>
                <div class="form-group">
                    <label>Роль *</label>
                    <select id="sRole">
                        <option value="manager" ${member?.role === 'manager' ? 'selected' : ''}>Менеджер</option>
                        <option value="admin" ${member?.role === 'admin' ? 'selected' : ''}>Администратор</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Логин *</label>
                    <input type="text" id="sLogin" value="${member ? esc(member.login) : ''}" required ${member ? 'readonly style="background:#f4f4f4"' : ''}>
                </div>
                <div class="form-group">
                    <label>${member ? 'Новый пароль' : 'Пароль *'}</label>
                    <input type="password" id="sPassword" placeholder="${member ? 'Оставьте пустым, если не менять' : 'Введите пароль'}" ${member ? '' : 'required'}>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="sEmail" value="${member ? esc(member.email || '') : ''}">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" id="sPhone" value="${member ? esc(member.phone || '') : ''}">
                </div>
            </div>
            <div id="staffFormError" style="color:var(--red);font-size:13px;margin-bottom:12px;min-height:20px"></div>
            <div style="display:flex;gap:12px">
                <button type="button" class="btn btn--outline" onclick="document.getElementById('staffModal').classList.remove('active')">Отмена</button>
                <button type="submit" class="btn btn--primary">${member ? 'Сохранить' : 'Добавить'}</button>
            </div>
        </form>
        <div style="margin-top:20px;padding:16px;background:var(--cream);border-radius:4px;font-size:12px;color:var(--gray)">
            <strong>Роли:</strong><br>
            <strong>Менеджер</strong> — просмотр и обработка заказов, просмотр товаров и клиентов<br>
            <strong>Администратор</strong> — всё, кроме управления сотрудниками
        </div>`;

    document.getElementById('staffForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('staffFormError');
        const name = document.getElementById('sName').value.trim();
        const login = document.getElementById('sLogin').value.trim();
        const password = document.getElementById('sPassword').value;
        const role = document.getElementById('sRole').value;
        const email = document.getElementById('sEmail').value.trim();
        const phone = document.getElementById('sPhone').value.trim();

        if (!name || !login) { errorEl.textContent = 'Заполните обязательные поля'; return; }
        if (!member && !password) { errorEl.textContent = 'Введите пароль'; return; }
        if (login === 'admin') { errorEl.textContent = 'Этот логин зарезервирован'; return; }

        const staff = getStaff();

        if (member) {
            const idx = staff.findIndex(s => s.login === loginToEdit);
            if (idx > -1) {
                staff[idx].name = name;
                staff[idx].role = role;
                staff[idx].email = email;
                staff[idx].phone = phone;
                if (password) staff[idx].password = password;
            }
        } else {
            if (staff.find(s => s.login === login)) { errorEl.textContent = 'Такой логин уже существует'; return; }
            staff.push({
                id: Date.now(),
                login, name, role, password, email, phone,
                created: new Date().toISOString()
            });
        }

        saveStaff(staff);
        modal.classList.remove('active');
        renderPage();
    });

    modal.classList.add('active');
}

/* ===== WAREHOUSE ===== */
function renderWarehouse(el) {
    const stock = Stock.getAll();
    const totalItems = PRODUCTS.reduce((s, p) => s + (stock[p.id] || 0), 0);
    const outOfStock = PRODUCTS.filter(p => (stock[p.id] || 0) <= 0).length;
    const lowStock = PRODUCTS.filter(p => (stock[p.id] || 0) > 0 && (stock[p.id] || 0) <= 5).length;

    el.innerHTML = `
        <div class="page-header"><h1>Склад</h1></div>
        <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
            <div class="stat-card">
                <div class="stat-card__label">Всего единиц</div>
                <div class="stat-card__value">${totalItems}</div>
                <div class="stat-card__change">${PRODUCTS.length} позиций</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__label">Мало на складе</div>
                <div class="stat-card__value" style="color:var(--orange)">${lowStock}</div>
                <div class="stat-card__change" style="color:var(--orange)">${lowStock > 0 ? 'Требуется пополнение' : 'Все в норме'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card__label">Нет в наличии</div>
                <div class="stat-card__value" style="color:var(--red)">${outOfStock}</div>
                <div class="stat-card__change ${outOfStock > 0 ? 'stat-card__change--down' : ''}">${outOfStock > 0 ? 'Срочно пополнить!' : 'Все есть'}</div>
            </div>
        </div>
        <div class="card">
            <div class="card__header"><span class="card__title">Остатки товаров</span></div>
            <div class="table-responsive">
            <table class="adm-table">
                <thead><tr><th></th><th>Товар</th><th>Категория</th><th>Цена</th><th style="width:120px">На складе</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>
                    ${PRODUCTS.map(p => {
                        const qty = stock[p.id] || 0;
                        const sc = qty <= 0 ? 'cancelled' : qty <= 5 ? 'processing' : 'delivered';
                        const st = qty <= 0 ? 'Нет' : qty <= 5 ? 'Мало' : 'В наличии';
                        return `<tr>
                            <td><div class="product-thumb">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : ''}</div></td>
                            <td><strong>${esc(p.name)}</strong></td>
                            <td>${categoryLabels[p.category] || p.category}</td>
                            <td style="white-space:nowrap">${formatPrice(p.price)}</td>
                            <td>
                                <input type="number" class="stock-input" data-id="${p.id}" value="${qty}" min="0"
                                    style="width:80px;padding:6px 10px;font-size:14px;font-weight:600;border:1px solid var(--gray-lighter);border-radius:4px;text-align:center">
                            </td>
                            <td><span class="status status--${sc}">${st}</span></td>
                            <td>
                                <button class="btn btn--outline btn--sm stock-add-btn" data-id="${p.id}" data-add="10">+10</button>
                                <button class="btn btn--outline btn--sm stock-add-btn" data-id="${p.id}" data-add="50" style="margin-left:4px">+50</button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
            </div>
        </div>`;

    el.querySelectorAll('.stock-input').forEach(input => {
        input.addEventListener('change', () => {
            Stock.set(parseInt(input.dataset.id, 10), parseInt(input.value, 10) || 0);
            renderWarehouse(el);
        });
    });
    el.querySelectorAll('.stock-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            Stock.set(id, Stock.get(id) + parseInt(btn.dataset.add, 10));
            renderWarehouse(el);
        });
    });
}

/* ===== BANK ACCOUNTS ===== */
function renderBankAccounts(el) {
    const accounts = getBankAccounts();

    el.innerHTML = `
        <div class="page-header">
            <h1>Банковские счета</h1>
            <div class="page-header__actions">
                <button class="btn btn--primary" id="addBankBtn">+ Добавить счёт</button>
            </div>
        </div>
        ${accounts.length > 0 ? `
        <div class="card">
            <div class="table-responsive">
            <table class="adm-table">
                <thead><tr><th>Банк</th><th>Тип</th><th>Номер счёта</th><th>Владелец</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>
                    ${accounts.map((a, i) => `<tr>
                        <td><strong>${esc(a.bank)}</strong></td>
                        <td>${esc(a.type)}</td>
                        <td style="font-family:monospace;font-size:13px">${esc(a.account)}</td>
                        <td>${esc(a.owner)}</td>
                        <td><span class="status status--${a.active ? 'delivered' : 'cancelled'}">${a.active ? 'Активен' : 'Неактивен'}</span></td>
                        <td>
                            <button class="btn btn--outline btn--sm edit-bank-btn" data-index="${i}">Изменить</button>
                            <button class="btn btn--danger btn--sm delete-bank-btn" data-index="${i}" style="margin-left:4px">Удалить</button>
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
            </div>
        </div>` : `
        <div class="card">
            <div class="card__body">
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    <p>Банковские счета не добавлены</p>
                    <span style="font-size:13px">Добавьте реквизиты для приёма оплат</span>
                </div>
            </div>
        </div>`}
        <div class="card" style="margin-top:24px">
            <div class="card__header"><span class="card__title">Информация</span></div>
            <div class="card__body" style="font-size:13px;color:var(--gray);line-height:1.7">
                <p>Управление банковскими реквизитами для приёма оплат:</p>
                <ul style="margin:12px 0;padding-left:20px">
                    <li><strong>Kaspi Business</strong> — для приёма Kaspi Pay переводов</li>
                    <li><strong>Halyk Bank</strong> — расчётный счёт для epay.kkb.kz</li>
                    <li><strong>Эквайринг</strong> — подключение терминала для Visa/Mastercard</li>
                    <li><strong>Расчётный счёт</strong> — для банковских переводов</li>
                </ul>
            </div>
        </div>`;

    document.getElementById('addBankBtn').addEventListener('click', () => openBankModal());
    el.querySelectorAll('.edit-bank-btn').forEach(btn => {
        btn.addEventListener('click', () => openBankModal(parseInt(btn.dataset.index, 10)));
    });
    el.querySelectorAll('.delete-bank-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Удалить этот банковский счёт?')) {
                const accs = getBankAccounts();
                accs.splice(parseInt(btn.dataset.index, 10), 1);
                saveBankAccounts(accs);
                renderBankAccounts(el);
            }
        });
    });
}

function openBankModal(editIndex) {
    const accounts = getBankAccounts();
    const a = typeof editIndex === 'number' ? accounts[editIndex] : null;
    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');

    content.innerHTML = `
        <div class="adm-modal__header">
            <h3>${a ? 'Редактировать счёт' : 'Добавить банковский счёт'}</h3>
            <button class="adm-modal__close" onclick="document.getElementById('productModal').classList.remove('active')">&times;</button>
        </div>
        <form id="bankForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Банк *</label>
                    <select id="bBank">
                        <option value="Kaspi Bank" ${a?.bank==='Kaspi Bank'?'selected':''}>Kaspi Bank</option>
                        <option value="Halyk Bank" ${a?.bank==='Halyk Bank'?'selected':''}>Halyk Bank</option>
                        <option value="Forte Bank" ${a?.bank==='Forte Bank'?'selected':''}>Forte Bank</option>
                        <option value="Jusan Bank" ${a?.bank==='Jusan Bank'?'selected':''}>Jusan Bank</option>
                        <option value="Bereke Bank" ${a?.bank==='Bereke Bank'?'selected':''}>Bereke Bank</option>
                        <option value="Freedom Bank" ${a?.bank==='Freedom Bank'?'selected':''}>Freedom Bank</option>
                        <option value="Другой" ${a?.bank==='Другой'?'selected':''}>Другой</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Тип счёта *</label>
                    <select id="bType">
                        <option value="Расчётный счёт" ${a?.type==='Расчётный счёт'?'selected':''}>Расчётный счёт</option>
                        <option value="Kaspi Business" ${a?.type==='Kaspi Business'?'selected':''}>Kaspi Business</option>
                        <option value="Эквайринг" ${a?.type==='Эквайринг'?'selected':''}>Эквайринг (терминал)</option>
                        <option value="Карточный счёт" ${a?.type==='Карточный счёт'?'selected':''}>Карточный счёт</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Номер счёта / IBAN / ID *</label>
                <input type="text" id="bAccount" value="${a ? esc(a.account) : ''}" placeholder="KZ00 0000 0000 0000 0000" required>
            </div>
            <div class="form-group">
                <label>Владелец счёта (ФИО / ИП / ТОО) *</label>
                <input type="text" id="bOwner" value="${a ? esc(a.owner) : ''}" placeholder="ТОО «NŪRA»" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>БИН / ИИН</label>
                    <input type="text" id="bBin" value="${a ? esc(a.bin||'') : ''}" placeholder="000000000000" maxlength="12">
                </div>
                <div class="form-group">
                    <label>БИК</label>
                    <input type="text" id="bBik" value="${a ? esc(a.bik||'') : ''}" placeholder="CASPKZKA">
                </div>
            </div>
            <div class="form-group">
                <label>Примечание</label>
                <textarea id="bNote" rows="2" placeholder="Для чего используется этот счёт">${a ? esc(a.note||'') : ''}</textarea>
            </div>
            <div class="form-group" style="display:flex;align-items:center;gap:8px">
                <input type="checkbox" id="bActive" ${!a || a.active ? 'checked' : ''} style="width:auto">
                <label for="bActive" style="margin:0;text-transform:none;font-size:14px;letter-spacing:0">Активен</label>
            </div>
            <div style="display:flex;gap:12px;margin-top:24px">
                <button type="button" class="btn btn--outline" onclick="document.getElementById('productModal').classList.remove('active')">Отмена</button>
                <button type="submit" class="btn btn--primary">${a ? 'Сохранить' : 'Добавить'}</button>
            </div>
        </form>`;

    document.getElementById('bankForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            bank: document.getElementById('bBank').value,
            type: document.getElementById('bType').value,
            account: document.getElementById('bAccount').value.trim(),
            owner: document.getElementById('bOwner').value.trim(),
            bin: document.getElementById('bBin').value.trim(),
            bik: document.getElementById('bBik').value.trim(),
            note: document.getElementById('bNote').value.trim(),
            active: document.getElementById('bActive').checked,
            created: a?.created || new Date().toISOString()
        };
        const accs = getBankAccounts();
        if (typeof editIndex === 'number') { accs[editIndex] = data; } else { accs.push(data); }
        saveBankAccounts(accs);
        modal.classList.remove('active');
        renderPage();
    });

    modal.classList.add('active');
}
