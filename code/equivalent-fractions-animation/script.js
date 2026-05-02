document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子常常困惑：1/2 和 2/4 明明数字不一样，怎么会相等？我们用折纸来证明。',
            en: 'Children wonder: 1/2 and 2/4 have different numbers — how can they be equal? Let\'s prove it.'
        },
        scene2: {
            cn: '第一步（具象）：第一张纸条折一半，涂1份（1/2）。第二张折4份，涂2份（2/4）。叠在一起，蓝色完全重合！',
            en: 'Step 1 (Concrete): First strip fold in half, shade 1 (1/2). Second fold into 4, shade 2 (2/4). Stack them — blue parts match perfectly!'
        },
        scene3: {
            cn: '第二步（形象）：把纸条转为模型图。无论是分2份取1、分4份取2、还是分6份取3，蓝色部分长度一样。这就是等值分数。',
            en: 'Step 2 (Pictorial): Convert to bar models. 1 of 2, 2 of 4, or 3 of 6, shaded length is identical. These are equivalent fractions.'
        },
        scene4: {
            cn: '第三步（抽象）：分子分母同时乘相同的数，分数大小不变。就像切蛋糕，切更细拿更多，总量没变。',
            en: 'Step 3 (Abstract): Multiply numerator and denominator by the same number — value stays the same. Like cutting a cake into more pieces but taking more.'
        },
        scene5: {
            cn: '记住：上下同乘，大小不变！',
            en: 'Remember: Multiply top and bottom by the same number — value unchanged!'
        }
    };

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
    
    // Show Strip A
    tl.to("#stripA", { opacity: 1, y: 10, duration: 0.5 }, 6);
    tl.to("#labelA", { opacity: 1, duration: 0.5 }, 7);

    // Show Strip B
    tl.to("#stripB", { opacity: 1, y: 10, duration: 0.5 }, 9);
    tl.to("#labelB", { opacity: 1, duration: 0.5 }, 10);

    // Stack them
    tl.to("#stripB", { y: -70, opacity: 0.7, duration: 1.5, ease: "power1.inOut" }, 13);
    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to("#barRow1", { opacity: 1, x: 10, duration: 0.5 }, 22);
    tl.to("#barRow2", { opacity: 1, x: 10, duration: 0.5 }, 25);
    tl.to("#barRow3", { opacity: 1, x: 10, duration: 0.5 }, 28);

    // Line and match text
    tl.to("#matchLine", { opacity: 1, duration: 0.5 }, 31);
    tl.to("#sameValue", { opacity: 1, duration: 0.5 }, 32);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#ab1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 42);
    tl.to("#ab2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 45);
    
    tl.to("#ruleBox", { opacity: 1, y: 0, duration: 0.5 }, 48);

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
