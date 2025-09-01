// script.js — Kaori Artstudio 全站共用腳本
// 功能：抽屜式手機選單 + Lightbox
// 需求：CSS 已具備 .menu.open 與 body.nav-open 樣式

(function () {
    // ========= 小工具 =========
    const qs  = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    // ========= 抽屜式手機選單 =========
    function initMobileMenu() {
      const toggle = qs('.menu-toggle');
      const menu   = qs('#site-menu'); // 統一用這個 id
  
      if (!toggle || !menu) return;
  
      // 可聚焦元素（用於簡易的 focus trap）
      const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  
      const openMenu = () => {
        menu.classList.add('open');
        document.body.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
  
        // 把焦點移到選單第一個可聚焦元素
        const first = qs(focusableSelectors, menu) || menu;
        first.focus({ preventScroll: true });
      };
  
      const closeMenu = () => {
        menu.classList.remove('open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        // 焦點回到漢堡按鈕
        toggle.focus({ preventScroll: true });
      };
  
      const toggleMenu = (e) => {
        if (e) e.stopPropagation();
        menu.classList.contains('open') ? closeMenu() : openMenu();
      };
  
      // 事件：按鈕
      toggle.addEventListener('click', toggleMenu);
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu(e);
        }
        if (e.key === 'Escape') closeMenu();
      });
  
      // 事件：點選選單內連結 → 關閉
      menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeMenu();
      });
  
      // 事件：點擊選單外 → 關閉
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
          if (menu.classList.contains('open')) closeMenu();
        }
      });
  
      // 事件：Esc 關閉（全頁）
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          closeMenu();
        }
      });
  
      // 簡易 focus trap：選單開啟時，Tab 只在選單內循環
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
        const focusable = qsa(focusableSelectors, menu);
        if (focusable.length === 0) return;
  
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
  
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }
  
    // ========= Lightbox =========
    function initLightbox() {
      const links = qsa('.lightbox-link');
      if (links.length === 0) return; // 沒有圖就不用初始化
  
      // 取得或動態建立 overlay
      let overlay = qs('#lightbox');
      let overlayImg;
  
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'lightbox';
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('aria-hidden', 'true');
  
        overlayImg = document.createElement('img');
        overlayImg.id = 'lightbox-img';
        overlayImg.alt = '放大圖片';
  
        overlay.appendChild(overlayImg);
        document.body.appendChild(overlay);
      } else {
        overlayImg = qs('#lightbox-img', overlay);
      }
  
      const open = (src) => {
        overlayImg.src = src;
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
  
        // 避免背景滾動（若你希望開圖時也鎖住）
        document.body.classList.add('nav-open');
      };
  
      const close = () => {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        overlayImg.src = '';
        document.body.classList.remove('nav-open');
      };
  
      links.forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const href = a.getAttribute('href');
          if (href) open(href);
        });
      });
  
      overlay.addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') close();
      });
    }
  
    // ========= iOS 觸控高亮處理 =========
    document.addEventListener('touchstart', () => {}, { passive: true });
  
    // ========= 啟動 =========
    // 不強制等 DOMContentLoaded，避免有些頁面很小但已經載入完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initLightbox();
      });
    } else {
      initMobileMenu();
      initLightbox();
    }
  })();
  