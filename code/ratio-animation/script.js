document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子会把比例和分数搞混。比例是"部分对部分"的比较，分数是"部分对整体"。',
            en: 'Children confuse ratio with fractions. Ratio = part-to-part comparison; fraction = part-to-whole.'
        },
        scene2: {
            cn: '3颗红珠和5颗蓝珠——红对蓝的比是 3:5。但红珠占总数的 3/8，不是 3/5！',
            en: '3 red and 5 blue — red to blue ratio is 3:5. But red is 3/8 of total, NOT 3/5!'
        },
        scene3: {
            cn: '3:5 的每一"份"就是一个单位。总数÷份数=每份的值。等值比：3:5 = 6:10 = 9:15。',
            en: 'Each "part" in 3:5 is one unit. Total ÷ parts = value per unit. Equivalent ratios: 3:5 = 6:10 = 9:15.'
        },
        scene4: {
            cn: '比例就是"几份对几份"。求实际数量：先算一份是多少，再乘以份数。',
            en: 'Ratio = "parts to parts". To find actual values: find 1 unit first, then multiply.'
        },
        scene5: {
            cn: '记住：比例看的是部分对部分，求值先找1份！',
            en: 'Remember: Ratio is part-to-part. Always find 1 unit first!'
        }
    };

    // ============================================================
    // Generate Beads dynamically
    // ============================================================
    const beadsArea = document.getElementById("beadsArea");
    for(let i=0; i<3; i++) {
        let bead = document.createElement("div");
        bead.className = "bead red";
        beadsArea.appendChild(bead);
    }
    let spacer = document.createElement("div");
    spacer.className = "bead spacer";
    beadsArea.appendChild(spacer);
    for(let i=0; i<5; i++) {
        let bead = document.createElement("div");
        bead.className = "bead blue";
        beadsArea.appendChild(bead);
    }

    // ============================================================
    // Language state
    // ============================================================
    let currentLang = 'both';
    let currentSceneKey = 'scene1';

    const subtitleEl = document.getElementById("subtitle-text");

    function renderSubtitle(sceneKey) {
        currentSceneKey = sceneKey;
        const data = subtitles[sceneKey];
        if (!data) return;

        let html = '';
        if (currentLang === 'cn') {
            html = `<div class="subtitle-line-cn">${data.cn}</div>`;
        } else if (currentLang === 'en') {
            html = `<div class="subtitle-line-en">${data.en}</div>`;
        } else {
            html = `<div class="subtitle-line-cn">${data.cn}</div><div class="subtitle-line-en">${data.en}</div>`;
        }

        subtitleEl.innerHTML = html;
        renderMathInElement(subtitleEl, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
            ]
        });
    }

    renderSubtitle('scene1');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            renderSubtitle(currentSceneKey);
            showToast(currentLang === 'cn' ? '🇨🇳 中文字幕' : currentLang === 'en' ? '🇬🇧 English Subtitles' : '🇨🇳🇬🇧 双语 Bilingual');
        });
    });

    // ============================================================
    // GSAP Master Timeline
    // ============================================================
    const tl = gsap.timeline({ paused: true });

    gsap.set(".scene", { autoAlpha: 0 });
    gsap.set("#scene1", { autoAlpha: 1 });

    function setSubtitle(sceneKey, time) {
        tl.add(() => renderSubtitle(sceneKey), time);
    }

    // SCENE 1: Intro (0-5s)
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2: Concrete (5-20s)
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Show beads
    tl.to(".bead", { opacity: 1, scale: 1, stagger: 0.1, duration: 0.3, ease: "back.out(1.5)" }, 6);
    tl.to(".spacer", { opacity: 1, duration: 0.5 }, 8);
    tl.to("#ratioConcrete", { opacity: 1, y: -10, duration: 0.5 }, 9);

    // Total
    tl.to("#totalBracket", { opacity: 1, duration: 0.5 }, 11);
    tl.to("#fracLabels", { opacity: 1, y: -10, duration: 0.5 }, 13);

    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Row 1
    tl.to("#barRow1", { opacity: 1, x: 0, duration: 0.5 }, 21);
    tl.to("#barRow1 .b-block", { opacity: 1, stagger: 0.1, duration: 0.1 }, 22);
    tl.to("#barRow1 .r-text", { opacity: 1, duration: 0.5 }, 23);

    // Calc
    tl.to("#calcBox", { opacity: 1, y: -10, duration: 0.5 }, 26);

    // Row 2 & 3
    tl.to("#barRow2", { opacity: 1, x: 0, duration: 0.5 }, 30);
    tl.to("#barRow2 .b-block", { opacity: 1, stagger: 0.05, duration: 0.1 }, 31);
    tl.to("#barRow2 .r-text", { opacity: 1, duration: 0.5 }, 32);

    tl.to("#barRow3", { opacity: 1, x: 0, duration: 0.5 }, 34);
    tl.to("#barRow3 .b-block", { opacity: 1, stagger: 0.05, duration: 0.1 }, 35);
    tl.to("#barRow3 .r-text", { opacity: 1, duration: 0.5 }, 36);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#ab1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 42);
    tl.to("#ab2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 45);
    tl.to("#ab3", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 48);

    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // SCENE 5: Summary (55-60s)
    setSubtitle('scene5', 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);
    
    tl.to(".summary-icon", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 55.5);
    tl.to(".logo-text", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.2);
    tl.to(".slogan-en", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.8);

    // ============================================================
    // Progress tracking + Controls
    // ============================================================
    const scenes = [
        { name: "Scene 1: 介绍 Introduction", start: 0, end: 5 },
        { name: "Scene 2: 具象 Concrete", start: 5, end: 20 },
        { name: "Scene 3: 形象 Pictorial", start: 20, end: 40 },
        { name: "Scene 4: 抽象 Abstract", start: 40, end: 55 },
        { name: "Scene 5: 总结 Summary", start: 55, end: 60 },
    ];
    const TOTAL_DURATION = 60;

    const progressFill = document.getElementById("progressFill");
    const sceneLabel = document.getElementById("sceneLabel");
    const countdownLabel = document.getElementById("countdownLabel");
    const toastEl = document.getElementById("toast");

    let toastTimer = null;
    function showToast(msg) {
        clearTimeout(toastTimer);
        toastEl.textContent = msg;
        toastEl.classList.add("show");
        toastTimer = setTimeout(() => {
            toastEl.classList.remove("show");
        }, 1800);
    }

    function updateProgress() {
        const currentTime = tl.time();
        const progress = Math.min(currentTime / TOTAL_DURATION * 100, 100);
        progressFill.style.width = progress + "%";

        let current = scenes[scenes.length - 1];
        for (const s of scenes) {
            if (currentTime < s.end) {
                current = s;
                break;
            }
        }

        sceneLabel.textContent = current.name;
        const remaining = Math.max(0, Math.ceil(current.end - currentTime));
        if (remaining > 0 && currentTime < TOTAL_DURATION) {
            countdownLabel.textContent = `下一步：${remaining}s`;
        } else {
            countdownLabel.textContent = "✓ 完成";
        }
    }

    gsap.ticker.add(updateProgress);

    document.getElementById("playBtn").addEventListener("click", () => { tl.play(); showToast("▶ 播放中..."); });
    document.getElementById("pauseBtn").addEventListener("click", () => { tl.pause(); showToast("⏸ 已暂停 — 可以向孩子讲解"); });
    document.getElementById("restartBtn").addEventListener("click", () => { tl.restart(); showToast("↻ 重新开始"); });
});
