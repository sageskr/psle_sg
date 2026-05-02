document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子害怕"x"，以为代数是全新的东西。其实他们从P1就在做代数了——"□ + 3 = 7"里的□就是x！',
            en: 'Children fear "x", thinking algebra is entirely new. But they\'ve been doing it since P1 — the □ in "□ + 3 = 7" IS x!'
        },
        scene2: {
            cn: '天平两边要平衡——左边盒子+3个砝码 = 右边7个砝码。两边同时拿走3个，盒子=4个砝码。',
            en: 'The scale must balance — box + 3 weights = 7 weights. Remove 3 from both sides → box = 4 weights.'
        },
        scene3: {
            cn: '模型图让等式变得直观。2x+1=9：去掉1，剩下2个x=8，每个x=4。关键原则：等号两边做相同的操作。',
            en: 'Bar models make equations visual. 2x+1=9: remove 1, leaving 2x=8, so x=4. Key: do the same operation to both sides.'
        },
        scene4: {
            cn: '解方程的核心：等号两边做相同操作，逐步"剥洋葱"，把x孤立出来。',
            en: 'Solving equations: do the same to both sides, "peel the onion" step by step to isolate x.'
        },
        scene5: {
            cn: '记住：等号就是天平，两边必须做同样的事！',
            en: 'Remember: The equals sign is a balance — do the same to both sides!'
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
    
    // Scale balance animation (wiggle and settle)
    tl.from("#scaleBeam", { rotation: -10, duration: 1.5, ease: "elastic.out(1, 0.3)" }, 6);
    
    // Action 1: Remove 3 from both sides
    tl.to(".w-remove", { y: -50, opacity: 0, stagger: 0.1, duration: 0.5 }, 9);
    tl.to("#scaleEq", { innerText: "x = 4" }, 10);
    
    // Balance wiggles again to show it's still balanced
    tl.to("#scaleBeam", { rotation: 5, duration: 0.2 }, 10);
    tl.to("#scaleBeam", { rotation: -5, duration: 0.2 }, 10.2);
    tl.to("#scaleBeam", { rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 10.4);

    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 12);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Eq 1
    tl.from("#barEq1", { opacity: 0, y: 20, duration: 0.5 }, 21);
    tl.to(".r-hide", { opacity: 0, duration: 0.5 }, 24);
    tl.to("#ans1", { innerText: "4", width: "100px", duration: 0.5 }, 24.5);
    tl.to("#hint1", { innerText: "x = 4" }, 25);

    // Eq 2
    tl.to("#barEq2", { opacity: 1, y: 0, duration: 0.5 }, 28);
    tl.to(".r2-hide", { opacity: 0, duration: 0.5 }, 31);
    tl.to("#ans2", { innerText: "8", width: "160px", duration: 0.5 }, 31.5);
    tl.to("#hint2", { innerText: "2x = 8" }, 32);

    tl.to("#ans2", { innerText: "4 | 4", duration: 0.5 }, 35);
    tl.to("#hint2", { innerText: "x = 4" }, 35.5);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".step1", { opacity: 1, y: 0, stagger: 1, duration: 0.5 }, 41);
    tl.to(".step2", { opacity: 1, y: 0, stagger: 1, duration: 0.5 }, 46);

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
