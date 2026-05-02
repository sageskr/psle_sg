document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子觉得 0.3 比 0.15 小——因为3<15。其实小数的大小比较要对齐小数点，按位比较。',
            en: 'Children think 0.3 < 0.15 because 3<15. Actually, compare decimals by aligning the decimal point.'
        },
        scene2: {
            cn: '100格板上，0.30 涂了30格，0.15 涂了15格。一目了然：0.30 更大！',
            en: 'On a 100-grid: 0.30 shades 30 squares, 0.15 shades 15. Clearly 0.30 is bigger!'
        },
        scene3: {
            cn: '0.3 = 3/10 = 30/100。转化为同分母后，30/100 > 15/100。',
            en: '0.3 = 3/10 = 30/100. With the same denominator: 30/100 > 15/100.'
        },
        scene4: {
            cn: '0.3 和 0.30 是同一个数！比较小数时，先补零对齐位数，再按位比较。',
            en: '0.3 and 0.30 are the same number! To compare decimals, pad with zeros then compare digit by digit.'
        },
        scene5: {
            cn: '记住：小数就是分数的另一种写法，比大小要对齐小数点！',
            en: 'Remember: Decimals are fractions in disguise. Always align the decimal point!'
        }
    };

    // ============================================================
    // Generate Grids dynamically
    // ============================================================
    const grid30 = document.getElementById("grid30");
    const grid15 = document.getElementById("grid15");
    
    for(let i=0; i<100; i++) {
        let cell = document.createElement("div");
        cell.className = "cell " + (i < 30 ? "s30" : "");
        grid30.appendChild(cell);

        let cell2 = document.createElement("div");
        cell2.className = "cell " + (i < 15 ? "s15" : "");
        grid15.appendChild(cell2);
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
    
    // Grid 30
    tl.to("#label30", { opacity: 1, duration: 0.5 }, 6);
    tl.to(".s30", { opacity: 1, stagger: 0.02, duration: 0.1 }, 6.5);
    
    // VS
    tl.to("#vsConcrete", { opacity: 1, scale: 1.2, duration: 0.5 }, 8);

    // Grid 15
    tl.to("#label15", { opacity: 1, duration: 0.5 }, 9);
    tl.to(".s15", { opacity: 1, stagger: 0.02, duration: 0.1 }, 9.5);

    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 12);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Bar 10
    tl.to(".bar-container:nth-child(1)", { opacity: 1, duration: 0.5 }, 21);
    tl.to("#fill10", { width: "30%", duration: 1, ease: "power2.out" }, 22);

    // Bar 100
    tl.to(".bar-container:nth-child(2)", { opacity: 1, duration: 0.5 }, 25);
    tl.to("#fill100", { width: "15%", duration: 1, ease: "power2.out" }, 26);

    // Comparison
    tl.to("#barComp", { opacity: 1, duration: 0.5 }, 30);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    // Show table
    tl.from(".pv-table", { y: -20, opacity: 0, duration: 0.5 }, 41);

    // Pad zero
    tl.to("#padZero", { opacity: 1, duration: 0.5 }, 44);
    tl.to("#padZero", { color: "#2ecc71", duration: 0.5 }, 45); // Turn green to show it's valid

    // Show inequality
    tl.to("#ab1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 47);
    
    // Show rule
    tl.to("#ruleBox", { opacity: 1, y: 0, duration: 0.5 }, 49);

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
