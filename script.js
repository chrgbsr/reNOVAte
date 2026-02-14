/* ============================================================
   reNOVAtion — Script
   Waitlist & contributor logic with Google Sheets + localStorage
   ============================================================ */

(function () {
    'use strict';

    // =====================================================
    // 🔗 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
    // =====================================================
    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHUsd8K7CoT859Y3N_tD5mTfQfgqtuRQQ1BLphWiIsDYhRPZgsgcDrtEQKiP-uRpFK/exec';
    // =====================================================

    var KEYS = {
        WAITLIST_COUNT: 'renovation_waitlist_count',
        WAITLIST_EMAILS: 'renovation_waitlist_emails',
        CONTRIBUTOR_COUNT: 'renovation_contributor_count',
        CONTRIBUTORS: 'renovation_contributors',
    };

    // State
    var waitlistCount = parseInt(localStorage.getItem(KEYS.WAITLIST_COUNT) || '0', 10);
    var contributorCount = parseInt(localStorage.getItem(KEYS.CONTRIBUTOR_COUNT) || '0', 10);

    // DOM
    var $ = function (s) { return document.querySelector(s); };
    var heroWaitlistNum = $('#hero-waitlist-count');
    var heroContribNum = $('#hero-contributor-count');
    var waitlistForm = $('#waitlist-form');
    var emailInput = $('#email-input');
    var waitlistBtn = $('#waitlist-btn');
    var waitlistSuccess = $('#waitlist-success');
    var contributeBtn = $('#contribute-btn');
    var modal = $('#contributor-modal');
    var modalClose = $('#modal-close');
    var contributorForm = $('#contributor-form');
    var contributorSuccess = $('#contributor-success');

    // --- Send data to Google Sheets ---
    function sendToSheet(data, callback) {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            console.warn('Google Script URL not set — data saved locally only.');
            if (callback) callback(true);
            return;
        }

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(function () {
                if (callback) callback(true);
            })
            .catch(function (err) {
                console.error('Sheet submit error:', err);
                // still show success — data is in localStorage as backup
                if (callback) callback(true);
            });
    }

    // --- Animate counter ---
    function animateNum(el, target, duration) {
        duration = duration || 800;
        var start = parseInt(el.textContent, 10) || 0;
        if (start === target) { el.textContent = target; return; }
        var diff = target - start;
        var t0 = performance.now();

        (function tick(now) {
            var progress = Math.min((now - t0) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + diff * eased);
            if (progress < 1) requestAnimationFrame(tick);
        })(t0);
    }

    // --- Init counters ---
    animateNum(heroWaitlistNum, waitlistCount);
    animateNum(heroContribNum, contributorCount);

    // --- Email check ---
    function validEmail(s) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    }

    // --- Waitlist ---
    waitlistForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = emailInput.value.trim();

        if (!validEmail(email)) {
            emailInput.style.borderColor = '#ef4444';
            emailInput.focus();
            setTimeout(function () { emailInput.style.borderColor = ''; }, 1500);
            return;
        }

        var emails = JSON.parse(localStorage.getItem(KEYS.WAITLIST_EMAILS) || '[]');

        if (emails.indexOf(email) !== -1) {
            waitlistForm.style.display = 'none';
            waitlistSuccess.querySelector('span').textContent = "You're already on the list!";
            waitlistSuccess.style.display = 'flex';
            return;
        }

        // Loading state
        var label = waitlistBtn.querySelector('.btn-label');
        var loading = waitlistBtn.querySelector('.btn-loading');
        label.style.display = 'none';
        loading.style.display = 'inline';
        waitlistBtn.disabled = true;

        // Send to Google Sheets
        sendToSheet({ type: 'waitlist', email: email }, function () {
            // Save locally
            emails.push(email);
            localStorage.setItem(KEYS.WAITLIST_EMAILS, JSON.stringify(emails));
            waitlistCount++;
            localStorage.setItem(KEYS.WAITLIST_COUNT, String(waitlistCount));
            animateNum(heroWaitlistNum, waitlistCount);

            // Show success
            waitlistForm.style.display = 'none';
            waitlistSuccess.style.display = 'flex';
        });
    });

    // --- Modal ---
    contributeBtn.addEventListener('click', function () {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- Contributor form ---
    contributorForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = $('#contrib-name').value.trim();
        var email = $('#contrib-email').value.trim();
        var role = $('#contrib-role').value;
        var github = $('#contrib-github').value.trim();

        if (!name || !validEmail(email) || !role) return;

        var list = JSON.parse(localStorage.getItem(KEYS.CONTRIBUTORS) || '[]');
        var exists = list.some(function (c) { return c.email === email; });

        // Send to Google Sheets
        sendToSheet({
            type: 'contributor',
            name: name,
            email: email,
            role: role,
            github: github
        }, function () {
            // Save locally
            if (!exists) {
                list.push({ name: name, email: email, role: role, github: github, date: new Date().toISOString() });
                localStorage.setItem(KEYS.CONTRIBUTORS, JSON.stringify(list));
                contributorCount++;
                localStorage.setItem(KEYS.CONTRIBUTOR_COUNT, String(contributorCount));
                animateNum(heroContribNum, contributorCount);
            }

            // Show success
            contributorForm.style.display = 'none';
            contributorSuccess.style.display = 'flex';

            setTimeout(function () {
                closeModal();
                setTimeout(function () {
                    contributorForm.style.display = '';
                    contributorSuccess.style.display = 'none';
                    contributorForm.reset();
                }, 300);
            }, 2000);
        });
    });

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            e.preventDefault();
            var target = document.querySelector(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // --- Nav shrink on scroll ---
    window.addEventListener('scroll', function () {
        var nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(17,17,24,0.95)';
        } else {
            nav.style.background = 'rgba(17,17,24,0.85)';
        }
    });
})();
