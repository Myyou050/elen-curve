/* ============================================================
   ELEN CURVE — script.js
   Carrega produtos e banners dinamicamente dos arquivos JSON
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  /* ====== HELPERS ====== */
  const fmtBRL = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
  const stars  = n => '★'.repeat(n) + '☆'.repeat(5 - n);

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ====== BADGE COLOR MAP ====== */
  function badgeClass(badge) {
    if (!badge) return '';
    if (badge === 'Novidade')      return 'new';
    if (badge === 'Mais Vendido')  return 'hot';
    return 'promo'; // desconto %
  }

  /* ====== LOAD JSON ====== */
  async function loadJSON(path) {
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error('not found');
      return await r.json();
    } catch {
      return null;
    }
  }

  /* ====== CONFIGURAÇÕES ====== */
  const config = await loadJSON('_data/configuracoes.json');
  if (config) {
    // Top bar
    const tb = document.getElementById('topBarText');
    if (tb && config.topbar) tb.textContent = config.topbar;

    // Logo
    const logoNome = document.getElementById('logoNome');
    if (logoNome && config.nome_loja) logoNome.textContent = config.nome_loja;
    const logoSlogan = document.getElementById('logoSlogan');
    if (logoSlogan && config.slogan) logoSlogan.textContent = config.slogan.toUpperCase();

    // Footer
    const footerNome = document.getElementById('footerNome');
    if (footerNome && config.nome_loja) footerNome.textContent = config.nome_loja;

    // Frete grátis no trust bar
    const freteEl = document.getElementById('freteValor');
    if (freteEl && config.frete_gratis) freteEl.textContent = `Acima de R$ ${Number(config.frete_gratis).toFixed(2).replace('.', ',')}`;

    // Cores dinâmicas
    if (config.cores) {
      const root = document.documentElement;
      if (config.cores.principal) root.style.setProperty('--rose',      config.cores.principal);
      if (config.cores.escura)    root.style.setProperty('--rose-dark',  config.cores.escura);
      if (config.cores.dourada)   root.style.setProperty('--gold',       config.cores.dourada);
    }

    // WhatsApp
    const wppLink = document.getElementById('linkWhatsapp');
    if (wppLink && config.whatsapp) wppLink.href = `https://wa.me/${config.whatsapp}`;

    // Instagram
    const igLink = document.getElementById('linkInstagram');
    if (igLink && config.instagram) igLink.href = `https://instagram.com/${config.instagram.replace('@', '')}`;

    // Email
    const emailEl = document.getElementById('emailContato');
    if (emailEl && config.email) {
      emailEl.textContent = config.email;
      emailEl.href = `mailto:${config.email}`;
    }
  }

  /* ====== BANNERS ====== */
  const bannersData = await loadJSON('_data/banners.json') || [];
  const banners = bannersData.filter(b => b.ativo).sort((a, b) => a.ordem - b.ordem);

  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');

  const gradients = [
    'linear-gradient(135deg,#2d1b1b 0%,#5c3030 50%,#8b4a4a 100%)',
    'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#533483 100%)',
    'linear-gradient(135deg,#1c1c1c 0%,#3d2b1f 50%,#6b4423 100%)',
  ];

  banners.forEach((b, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.background = gradients[i % gradients.length];
    slide.innerHTML = `
      <div class="slide-bg" style="background-image:url('${b.imagem}');"></div>
      <div class="slide-content">
        ${b.label ? `<p class="slide-label">${b.label}</p>` : ''}
        <h1 class="slide-title">${b.titulo.replace('/', '/<br><em>').replace(' OFF', '</em> OFF')}</h1>
        ${b.subtitulo ? `<p class="slide-subtitle">${b.subtitulo}</p>` : ''}
        <div class="slide-ctas">
          <a href="${b.cta1_link || '#'}" class="btn-primary">${b.cta1_texto}</a>
          ${b.cta2_texto ? `<a href="${b.cta2_link || '#'}" class="btn-outline">${b.cta2_texto}</a>` : ''}
        </div>
      </div>
      ${b.badge ? `<div class="slide-badge ${b.badge_cor || ''}">${b.badge}</div>` : ''}
    `;
    track.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });

  // Carousel logic
  let current = 0;
  const total = banners.length || 1;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); startAuto(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dotsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dot')) { goTo(+e.target.dataset.index); startAuto(); }
  });

  // Touch swipe
  let touchX = 0;
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  });

  startAuto();

  /* ====== PRODUTOS ====== */
  const todosProdutos = await loadJSON('_data/produtos.json') || [];
  const produtos = todosProdutos.filter(p => p.ativo);

  // Conta por categoria
  const cats = ['vestidos','blusas','conjuntos','calcas','acessorios'];
  cats.forEach(cat => {
    const el = document.getElementById(`cnt-${cat}`);
    if (el) {
      const n = produtos.filter(p => p.categoria === cat).length;
      el.textContent = `${n} ${n === 1 ? 'peça' : 'peças'}`;
    }
  });

  // Renderiza card de produto
  function renderCard(p) {
    const temDesconto = p.preco_original && p.preco_original > p.preco;
    const categorias  = [p.categoria];
    if (p.badge === 'Novidade') categorias.push('novidades');
    if (p.badge && p.badge.includes('%')) categorias.push('promocoes');

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.cat = categorias.join(' ');

    const tamanhos = Array.isArray(p.tamanhos) ? p.tamanhos : ['P','M','G'];

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${p.foto}" alt="${p.nome}" loading="lazy" />
        <div class="product-badges">
          ${p.badge ? `<span class="badge-tag ${badgeClass(p.badge)}">${p.badge}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="action-btn fav-btn" title="Favoritar" data-id="${p.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="action-btn quick-view" title="Ver rápido"
            data-id="${p.id}"
            data-name="${p.nome}"
            data-price="${p.preco}"
            data-old="${p.preco_original || p.preco}"
            data-cat="${p.categoria}"
            data-img="${p.foto}"
            data-tamanhos="${tamanhos.join(',')}"
            data-descricao="${p.descricao || ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-cat">${p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1)}</p>
        <h3 class="product-name">${p.nome}</h3>
        <div class="product-rating">${stars(p.estrelas || 5)} <span>(${p.avaliacoes || 0})</span></div>
        <div class="product-prices">
          ${temDesconto ? `<span class="price-old">${fmtBRL(p.preco_original)}</span>` : ''}
          <span class="price-current">${fmtBRL(p.preco)}</span>
        </div>
        ${p.parcelamento ? `<p class="price-parcela">${p.parcelamento}</p>` : ''}
        <button class="btn-buy" data-id="${p.id}" data-name="${p.nome}" data-price="${p.preco}">
          Adicionar à Sacola
        </button>
      </div>
    `;
    return card;
  }

  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  if (!produtos.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:3rem;">Nenhum produto cadastrado ainda.</p>';
  } else {
    produtos.forEach(p => grid.appendChild(renderCard(p)));
  }

  // Re-attach events after dynamic render
  attachProductEvents();

  /* ====== FILTER ====== */
  const filterTabs = document.querySelectorAll('.filter-tab');

  function applyFilter(filter) {
    document.querySelectorAll('.product-card').forEach(card => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
    filterTabs.forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
  }

  filterTabs.forEach(tab => tab.addEventListener('click', () => applyFilter(tab.dataset.filter)));

  // Category cards + nav + CTA buttons
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      const f = el.dataset.filter;
      if (f) {
        applyFilter(f);
        setTimeout(() => document.getElementById('produtos').scrollIntoView({ behavior:'smooth', block:'start' }), 100);
      }
    });
  });

  document.querySelectorAll('[data-filter-trigger]').forEach(el => {
    el.addEventListener('click', () => applyFilter(el.dataset.filterTrigger));
  });

  /* ====== CART ====== */
  const cart = {};

  function cartQty()   { return Object.values(cart).reduce((s, i) => s + i.qty, 0); }
  function cartValue() { return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0); }

  function renderCart() {
    const cartItems  = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount  = document.getElementById('cartCount');
    const cartTotalEl= document.getElementById('cartTotal');
    const items = Object.values(cart);

    const qty = cartQty();
    cartCount.textContent = qty;
    cartCount.style.display = qty ? 'flex' : 'none';

    if (!items.length) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d4b8b8" stroke-width="1.2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Sua sacola está vazia</p>
          <button class="btn-primary" id="shopNowBtn" style="font-size:.8rem;padding:.65rem 1.5rem;">Ver produtos</button>
        </div>`;
      document.getElementById('shopNowBtn')?.addEventListener('click', () => {
        closeCart();
        document.getElementById('produtos').scrollIntoView({ behavior:'smooth' });
      });
      cartFooter.style.display = 'none';
    } else {
      cartItems.innerHTML = items.map(item => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.img || ''}" alt="${item.name}" style="background:var(--light-gray);" onerror="this.style.background='var(--light-gray)';this.src='';" />
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${fmtBRL(item.price)}</p>
            <span style="font-size:.75rem;color:var(--text-muted)">Qtd: ${item.qty}</span>
            <a href="#" class="cart-item-remove" data-id="${item.id}">Remover</a>
          </div>
        </div>`).join('');
      cartFooter.style.display = 'block';
      cartTotalEl.textContent = fmtBRL(cartValue());

      cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          delete cart[btn.dataset.id];
          renderCart();
        });
      });
    }
  }

  function openCart()  {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  function addToCart(id, name, price, img) {
    price = parseFloat(price);
    if (cart[id]) cart[id].qty++;
    else cart[id] = { id, name, price, img: img || '', qty: 1 };
    renderCart();
    showToast(`✓ ${name} adicionado à sacola!`);
    const btn = document.getElementById('cartBtn');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = '', 300);
  }

  /* ====== FAVORITES ====== */
  const favorites = new Set();

  /* ====== PRODUCT EVENTS (attached after dynamic render) ====== */
  function attachProductEvents() {
    // Add to cart
    document.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const img  = card?.querySelector('img')?.src || '';
        addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price, img);
        btn.textContent = '✓ Adicionado!';
        btn.style.background = 'var(--rose)';
        setTimeout(() => { btn.textContent = 'Adicionar à Sacola'; btn.style.background = ''; }, 1800);
      });
    });

    // Favorites
    document.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (favorites.has(id)) { favorites.delete(id); btn.classList.remove('active'); showToast('Removido dos favoritos'); }
        else { favorites.add(id); btn.classList.add('active'); showToast('♥ Adicionado aos favoritos!'); }
        const fc = document.getElementById('favCount');
        fc.textContent = favorites.size;
        fc.style.display = favorites.size ? 'flex' : 'none';
      });
    });

    // Quick View
    document.querySelectorAll('.quick-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, name, price, old: oldPrice, cat, img, tamanhos, descricao } = btn.dataset;
        const sizes    = tamanhos ? tamanhos.split(',') : ['P','M','G'];
        const parcelas = (parseFloat(price) / 3).toFixed(2).replace('.', ',');
        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
          <img class="modal-img" src="${img}" alt="${name}" />
          <div class="modal-info">
            <p class="modal-cat">${cat}</p>
            <h2 class="modal-name">${name}</h2>
            <div class="product-rating">★★★★★</div>
            <div class="modal-prices">
              ${parseFloat(oldPrice) > parseFloat(price) ? `<span class="modal-price-old">${fmtBRL(oldPrice)}</span>` : ''}
              <span class="modal-price-current">${fmtBRL(price)}</span>
              <span class="modal-parcela">ou 3x de R$ ${parcelas} sem juros</span>
            </div>
            ${descricao ? `<p style="font-size:.84rem;color:var(--text-muted);line-height:1.6;">${descricao}</p>` : ''}
            <div class="modal-sizes">
              <label>Tamanho</label>
              <div class="size-btns">
                ${sizes.map((s, i) => `<button class="size-btn${i===1?' active':''}">${s}</button>`).join('')}
              </div>
            </div>
            <button class="modal-buy" data-id="${id}" data-name="${name}" data-price="${price}" data-img="${img}">
              Adicionar à Sacola
            </button>
            <p style="font-size:.72rem;color:var(--text-muted);display:flex;align-items:center;gap:.4rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Compra 100% segura via Mercado Pago
            </p>
          </div>`;

        modalContent.querySelectorAll('.size-btn').forEach(sb => {
          sb.addEventListener('click', () => {
            modalContent.querySelectorAll('.size-btn').forEach(x => x.classList.remove('active'));
            sb.classList.add('active');
          });
        });

        const mb = modalContent.querySelector('.modal-buy');
        mb.addEventListener('click', () => {
          addToCart(mb.dataset.id, mb.dataset.name, mb.dataset.price, mb.dataset.img);
          closeModal();
          openCart();
        });

        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeCart(); } });

  /* ====== SEARCH ====== */
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const q = e.target.value.trim().toLowerCase();
    if (!q) return;
    let found = false;
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
      const cats = card.dataset.cat || '';
      const show = name.includes(q) || cats.includes(q);
      card.classList.toggle('hidden', !show);
      if (show) found = true;
    });
    filterTabs.forEach(t => t.classList.remove('active'));
    document.getElementById('produtos').scrollIntoView({ behavior:'smooth', block:'start' });
    showToast(found ? `Resultados para "${e.target.value}"` : 'Nenhum produto encontrado');
  });

  /* ====== HEADER SCROLL ====== */
  window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ====== MOBILE NAV ====== */
  const hamburger = document.getElementById('hamburgerBtn');
  const mainNav   = document.getElementById('mainNav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mainNav.classList.remove('open');
  }));

  /* ====== NEWSLETTER ====== */
  document.getElementById('nlBtn').addEventListener('click', () => {
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email || !email.includes('@')) { showToast('Por favor, insira um e-mail válido'); return; }
    showToast('🎉 Cupom de 10% OFF enviado para o seu e-mail!');
    document.getElementById('newsletterEmail').value = '';
  });

  /* ====== LOAD MORE ====== */
  document.getElementById('loadMoreBtn')?.addEventListener('click', function() {
    showToast('Todos os produtos já estão sendo exibidos!');
    this.textContent = 'Todos os produtos exibidos ✓';
    this.style.borderColor = 'var(--gold)';
    this.style.color = 'var(--gold)';
    this.disabled = true;
  });

  /* ====== INTERSECTION OBSERVER — animação ao scroll ====== */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .category-card, .trust-item').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .5s ease ${i * 0.05}s, transform .5s ease ${i * 0.05}s`;
      obs.observe(el);
    });
  }

  /* ====== SMOOTH SCROLL ====== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });

  /* ====== INITIAL RENDER ====== */
  renderCart();

});
