document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '很多孩子在加减法中不理解"进位"和"退位"。例如 47+35，个位 7+5=12，需要"进1"到十位。我们用十格阵帮助孩子看懂这个过程。',
            en: 'Many children struggle with "carrying" and "borrowing". For example, 47+35: ones place 7+5=12, needing to carry 1 to the tens. Let\'s visualize this.'
        },
        scene2: {
            cn: '第一步（具象）：把47和35的散块放在一起。7+5=12，拿10个散块拼成一条"十格条"，剩下2个散块。十位原来4+3=7，再加新的1条，变成8条。',
            en: 'Step 1 (Concrete): Combine loose cubes. 7+5=12, snap 10 cubes into a new ten-stick, leaving 2 cubes. Tens: 4+3=7, plus new stick = 8 tens.'
        },
        scene3: {
            cn: '第二步（形象）：将数字拆成"十位"和"个位"。个位合并后超过10，就拿出10往上一层走。这就是"进位"的本质——把10个一变成1个十。',
            en: 'Step 2 (Pictorial): Split numbers into tens and ones. When ones exceed 10, move 10 up to the tens row. This IS regrouping: 10 ones -> 1 ten.'
        },
        scene4: {
            cn: '第三步（抽象）：竖式计算只是把刚才模型图的过程用数字写出来。个位满十进一，这个"1"就是刚才拼成的那根十格条。',
            en: 'Step 3 (Abstract): Vertical algorithm is the model process in numbers. When ones reach 10, carry 1 — that "1" is the ten-stick we just formed.'
        },
        scene5: {
            cn: '记住：进位就是把10个散块换成1根十格条！',
            en: 'Remember: Regrouping means trading 10 ones for 1 ten!'
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
        // Re-render KaTeX if any math exists
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
    
    tl.to(".group-47", { opacity: 1, duration: 0.5, x: 20 }, 6);
    tl.to(".plus-sign", { opacity: 1, duration: 0.5 }, 7);
    tl.to(".group-35", { opacity: 1, duration: 0.5, x: -20 }, 8);

    // Combine loose cubes (7 + 5)
    tl.to("#ones47 .cube", { y: -30, x: 50, duration: 1, stagger: 0.1 }, 10);
    tl.to("#ones35 .cube", { y: -30, x: -50, duration: 1, stagger: 0.1 }, 10);
    
    // 10 snap into new stick
    tl.to(["#ones47 .cube:nth-child(-n+7)", "#ones35 .cube:nth-child(-n+3)"], {
        x: 100, y: -80, opacity: 0, duration: 0.5
    }, 12);
    tl.to("#newStick", { opacity: 1, scale: 1.1, duration: 0.5 }, 12.5);
    
    // Move stick to tens
    tl.to("#newStick", { rotation: 0, x: -140, y: -20, scale: 1, duration: 1 }, 14);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Bars appear side by side
    tl.to(["#bar47", "#bar35"], { opacity: 1, duration: 0.5, y: -10 }, 21);

    // Split
    tl.to(["#bar47", "#bar35"], { opacity: 0, duration: 0.2 }, 23);
    tl.to(["#bar40", "#bar30", "#bar7", "#bar5"], { opacity: 1, duration: 0.5, stagger: 0.1 }, 23.2);

    // Ones merge 7+5 = 12
    tl.to(["#bar7", "#bar5"], { x: 50, opacity: 0, duration: 1 }, 25);
    tl.to("#bar12", { opacity: 1, duration: 0.5 }, 26);

    // Split 12 into 10 + 2
    tl.to("#bar12", { opacity: 0, duration: 0.2 }, 28);
    tl.to(["#bar10New", "#bar2Rem"], { opacity: 1, duration: 0.5 }, 28.2);

    // 10 slides up
    tl.to("#bar10New", { y: -60, x: -10, duration: 1 }, 30);

    // Combine tens
    tl.to(["#bar40", "#bar30", "#bar10New"], { opacity: 0, duration: 0.5 }, 33);
    // Combine to 82
    tl.to("#bar2Rem", { opacity: 0, duration: 0.5 }, 33);
    tl.to("#bar82", { opacity: 1, y: -50, scale: 1.1, duration: 0.5 }, 33.5);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    // Setup numbers
    const algoSpans = document.querySelectorAll(".algo-row:not(.carry-row):not(.result) span");
    tl.to(algoSpans, { opacity: 1, y: -10, duration: 0.5, stagger: 0.1 }, 41);

    // Ones column highlight
    tl.to("#onesHighlight", { opacity: 1, duration: 0.5 }, 44);
    tl.to("#resOnes", { opacity: 1, duration: 0.5 }, 45); // 7+5=12
    tl.to("#carry1", { opacity: 1, y: -10, duration: 0.5, scale: 1.5, ease: "back.out(1.7)" }, 46);

    // Tens column highlight
    tl.to("#onesHighlight", { opacity: 0, duration: 0.3 }, 48);
    tl.to("#tensHighlight", { opacity: 1, duration: 0.5 }, 48.5);
    tl.to("#carry1", { scale: 1, duration: 0.2 }, 49);
    tl.to("#resTens", { opacity: 1, duration: 0.5 }, 50); // 1+4+3=8

    tl.to("#tensHighlight", { opacity: 0, duration: 0.5 }, 52);

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
