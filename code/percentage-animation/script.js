document.addEventListener("DOMContentLoaded", () => {
    // Generate 100 cells for the grid
    const grid100 = document.getElementById("grid100");
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        grid100.appendChild(cell);
    }

    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子知道手机充到 75% 是什么意思，但不会把百分比和分数、小数互相转换。',
            en: 'Children understand 75% phone battery, but struggle converting between percentage, fractions, and decimals.'
        },
        scene2: {
            cn: '手机电量75%就是100格里充了75格。打8折（20% OFF）就是省掉20%的钱。',
            en: '75% battery = 75 out of 100 units filled. 20% OFF = save 20 out of every 100 dollars.'
        },
        scene3: {
            cn: '75% = $\\frac{75}{100}$ = $\\frac{3}{4}$ = 0.75 ——三种写法表示同一个量。',
            en: '75% = $\\frac{75}{100}$ = $\\frac{3}{4}$ = 0.75 — three ways to write the same amount.'
        },
        scene4: {
            cn: '百分比 = $\\frac{\\text{部分}}{\\text{整体}}$ × 100%。"求百分之几"就是乘以对应的小数。',
            en: 'Percentage = $\\frac{\\text{Part}}{\\text{Whole}}$ × 100%. "Find x%" means multiply by the decimal form.'
        },
        scene5: {
            cn: '记住：百分比就是"每一百里有几个"，可以自由转换为分数和小数！',
            en: 'Remember: Percent means "per hundred". Convert freely between %, fractions, and decimals!'
        }
    };

    // ============================================================
    // Language state: 'cn', 'en', or 'both'
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
    
    // Battery fills
    tl.to("#batteryWrapper", { opacity: 1, duration: 0.5 }, 5.5);
    
    const batObj = { val: 0 };
    tl.to(batObj, {
        val: 100, 
        duration: 4, 
        ease: "linear",
        onUpdate: function() {
            const v = Math.round(batObj.val);
            document.getElementById("batteryFill").style.width = v + "%";
            document.getElementById("batteryText").innerText = v + "%";
            if (v >= 100) {
                document.getElementById("batteryFill").style.backgroundColor = "#27ae60"; // green
                document.getElementById("batteryText").innerText = "Fully Charged";
                document.getElementById("batteryText").style.fontSize = "1.5rem";
            }
        }
    }, 6);

    // Discount tag
    tl.to("#batteryWrapper", { display: "none", opacity: 0, duration: 0.5 }, 11);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "20% OFF = save 20 out of every 100 dollars", 11.5);
    tl.to("#tagWrapper", { display: "flex", opacity: 1, duration: 0.5 }, 11.5);
    
    tl.add(() => document.getElementById("originalPrice").classList.add("strikethrough"), 13);
    tl.to("#discountAmount", { opacity: 1, y: 0, duration: 0.5 }, 14);
    tl.to("#finalPrice", { opacity: 1, y: 0, duration: 0.5 }, 15.5);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Grid 100
    tl.to("#grid100", { opacity: 1, duration: 0.5 }, 21);
    
    // Shade 75 cells
    tl.add(() => {
        const cells = document.querySelectorAll(".grid-cell");
        for (let i = 0; i < 75; i++) {
            cells[i].classList.add("shaded");
        }
    }, 22);

    // Text appearances
    tl.to("#conv-pct", { opacity: 1, y: 0, duration: 0.4 }, 23.5);
    tl.to("#conv-eq1", { opacity: 1, y: 0, duration: 0.4 }, 24.5);
    tl.to("#conv-frac1", { opacity: 1, y: 0, duration: 0.4 }, 24.5);
    
    tl.to("#conv-eq2", { opacity: 1, y: 0, duration: 0.4 }, 26.5);
    tl.to("#conv-frac2", { opacity: 1, y: 0, duration: 0.4 }, 26.5);
    
    // Bar model below
    tl.to("#barModel4", { opacity: 1, duration: 0.5 }, 28);
    
    tl.to("#conv-eq3", { opacity: 1, y: 0, duration: 0.4 }, 30);
    tl.to("#conv-dec", { opacity: 1, y: 0, duration: 0.4 }, 30);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#ab-eq1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 42);
    tl.to("#ab-eq2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 44);
    tl.to("#ab-eq3", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 46);

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
