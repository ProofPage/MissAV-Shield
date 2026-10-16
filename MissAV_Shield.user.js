// ==UserScript==
// @name         MissAV Shield — Clean & Seamless Player
// @namespace    https://github.com/ProofPage/MissAV-Shield
// @version      1.0.0
// @description  Removes ads, action bars, and sponsored widgets while enabling continuous background playback and fully expanded titles and descriptions on MissAV.
// @author       Page
// @homepageURL  https://github.com/ProofPage/MissAV-Shield
// @supportURL   https://github.com/ProofPage/MissAV-Shield/issues
// @updateURL    https://raw.githubusercontent.com/ProofPage/MissAV-Shield/main/MissAV_Shield.user.js
// @downloadURL  https://raw.githubusercontent.com/ProofPage/MissAV-Shield/main/MissAV_Shield.user.js
// @match        https://missav123.com/*
// @match        https://missav.ws/*
// @match        https://missav.live/*
// @match        https://missav.ai/*
// @match        https://missav.com/*
// @match        https://thisav.com/*
// @match        *://missav.fans/*
// @match        *://missav.media/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(() => {
    'use strict';

    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    /* ==========================================================================
       1. [Background Play] Bypass tab-blur and visibility auto-pause triggers
       ========================================================================== */
    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
        document.hasFocus = () => true;
    } catch (e) {}

    // Drop site-registered blur & visibilitychange listeners
    const originalDocAddEventListener = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function (type, listener, options) {
        if (type === 'visibilitychange' || type === 'blur') {
            return;
        }
        return originalDocAddEventListener.call(this, type, listener, options);
    };

    const originalWinAddEventListener = Window.prototype.addEventListener;
    Window.prototype.addEventListener = function (type, listener, options) {
        if (type === 'blur') {
            return;
        }
        return originalWinAddEventListener.call(this, type, listener, options);
    };

    /* ==========================================================================
       2. [Remove Ads & Popups] Neutralize ad scripts & popups
       ========================================================================== */
    win.open = () => null;

    win.StripchatSpot = function () {
        return { mount: () => {} };
    };

    let fakeHtmlAds = [];
    Object.defineProperty(win, 'htmlAds', {
        get: () => fakeHtmlAds,
        set: () => {},
        configurable: true
    });

    /* ==========================================================================
       3. [Selectors] Ads, Trackers & Action Menu Bar Removal
       ========================================================================== */
    const removeSelectors = [
        // --- 3-1. Action Menu Bar & Side Panels ---
        'div.flex.flex-wrap.justify-center.space-x-4',
        'div[x-show="showPanel === \'share\'"]',
        'div[x-show="showPanel === \'playlist\'"]',

        // --- 3-2. "Show more" button (description is fully expanded by default) ---
        'a.text-nord13.font-medium.flex.items-center',

        // --- 3-3. Ads, Promos & Widgets ---
        '.under_player',
        '#html-ads',
        '#inpage',
        '[x-ref="stripchat"]',
        'div.ts-outstream-video',
        'ul.mb-4.list-none.text-nord14',          // Text sponsor list (Casino, VPN, etc.)
        'a[href*="myavlive.com"]',                 // Live Cam / "라이브 섹스"
        'a[rel*="sponsored"]',                     // Sponsor affiliate links
        'a[href*="bit.ly"]',                       // Shortened ad links
        '.fixed.right-2.bottom-2',                 // Floating bottom-right banner
        'div[class*="fixed"][class*="bottom-"]',
        'div[class^="root"]',
        'div.space-y-6.mb-6 > div.hidden.lg\\:block',
        'div.space-y-5.mb-5 > div',
        'div[style*="width: 300px"][style*="height: 250px"]',
        'div[style*="width: 300px"][style*="height: 100px"]',
        'iframe[src*="myavlive.com"]',
        'iframe[src*="rallytrck.website"]',
        'iframe[src*="stripchat"]',
        'iframe:not([src*="surrit.com"]):not([src*="missav"]):not([src="about:blank"])',
        '.prose',
        'img[alt="MissAV takeover Fanza"]'
    ].join(',\n');

    /* ==========================================================================
       4. [CSS Injection] Layout Tuning, Full Title, Auto-Expand Description & AdBlock
       ========================================================================== */
    GM_addStyle(`
        /* 4-1. Title & Details Spacing Optimization */
        .order-first h1.text-base.lg\\:text-lg.text-nord6 {
            margin-bottom: 1.5rem !important;
            line-height: 1.6 !important;
        }

        /* 4-2. Auto-Expand Full Description (No "Show more" needed) */
        div.mb-1.text-secondary.break-all {
            -webkit-line-clamp: unset !important;
            display: block !important;
            overflow: visible !important;
            max-height: none !important;
            margin-bottom: 0.75rem !important;
            line-height: 1.6 !important;
        }

        /* 4-3. Full Title Display */
        div.my-2.text-sm.text-nord4.truncate,
        .truncate {
            white-space: normal !important;
            text-overflow: unset !important;
            overflow: visible !important;
            -webkit-line-clamp: unset !important;
            display: block !important;
        }

        div.max-h-14.overflow-y-hidden.text-sm {
            max-height: none !important;
            overflow: visible !important;
        }

        /* 4-4. Hide Action Menu, "Show more" Button & Ads Instantly */
        ${removeSelectors} {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            min-height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `);

    /* ==========================================================================
       5. [DOM Cleanup & Player Hook]
       ========================================================================== */
    function cleanElements() {
        const elements = document.querySelectorAll(removeSelectors);
        elements.forEach(el => {
            if (el.tagName.toLowerCase() === 'iframe') {
                el.src = 'about:blank';
            }
            el.remove();
        });

        const scripts = document.querySelectorAll('script[src*="creative.myavlive.com"], script[src*="mayzaent.com"], script#SCSpotScript');
        scripts.forEach(s => s.remove());
    }

    function hookBackgroundPlayback() {
        const video = document.querySelector('video');
        if (video && !video.dataset.bgHooked) {
            video.dataset.bgHooked = 'true';
            video.addEventListener('pause', () => {
                if (!document.hasFocus() || document.hidden) {
                    video.play().catch(() => {});
                }
            });
        }

        if (win.player && win.player.pause && !win.player._safePause) {
            win.player._safePause = win.player.pause;
            win.player.pause = function (...args) {
                if (document.hasFocus()) {
                    return win.player._safePause.apply(this, args);
                }
            };
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        cleanElements();
        hookBackgroundPlayback();

        const observer = new MutationObserver(() => {
            cleanElements();
            hookBackgroundPlayback();
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    });
})();
