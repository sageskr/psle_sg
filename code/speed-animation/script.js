document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '速度、时间、路程的关系是小六数学的难点。孩子往往只会套用三角形公式，但不理解"速度是单位时间内的路程"。我们将通过 CPA 拆解这一核心概念。',
            en: 'The relationship between Speed, Time, and Distance is a key challenge in P6 Math. Students often memorize the triangle formula without understanding that "speed means distance covered in one unit of time". We will use CPA to break it down.'
        },
        scene2: {
            cn: '第一步（具象）：通过小车行驶的直观动作，让孩子看到路程随时间的增加而累积。强调"1小时走了多远"，建立对速度（Speed）的初步感性认识。',
            en: 'Step 1 (Concrete): Through the visual action of a toy car driving, children see distance accumulate over time. Emphasize "how far in 1 hour" to build an intuitive sense of Speed.'
        },
        scene3: {
            cn: '第二步（形象）：这是核心建模过程。将抽象的路程转化为长方形块（Bar Model）。通过平分模型，孩子能视觉化地理解"路程 ÷ 时间 = 速度"，即每一份代表单位时间内的路程。',
            en: 'Step 2 (Pictorial): This is the key modeling step. Transform the abstract distance into a Bar Model. By partitioning equally, children visualize "Distance ÷ Time = Speed" — each unit represents distance in one unit of time.'
        },
        scene4: {
            cn: '第三步（抽象）：在理解模型的基础上引入公式。解释乘除法关系的来源，让孩子明白公式只是模型逻辑的简化表达，从而灵活运用，不再记错位置。',
            en: 'Step 3 (Abstract): Introduce formulas after understanding the model. Explain the multiplication/division relationship so children see that formulas are just shorthand for the model logic — no more mixing up positions.'
        },
        scene5: {
            cn: '记住：速度就是单位时间内的路程。',
            en: 'Remember: Speed is just Distance in 1 Unit of Time.'
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

    // Show Scene 1 subtitle immediately (before Play)
    renderSubtitle('scene1');

    // ============================================================
    // Language toggle
    // ============================================================
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
    // GSAP Master Timeline — paused until user clicks Play
    // ============================================================
    const tl = gsap.timeline({ paused: true });

    gsap.set(".scene", { autoAlpha: 0 });
    gsap.set("#scene1", { autoAlpha: 1 });

    // Helper: update subtitle at a specific time
    function setSubtitle(sceneKey, time) {
        tl.add(() => renderSubtitle(sceneKey), time);
    }

    // ============================================================
    // SCENE 1: Introduction (0s → 5s)
    // ============================================================
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // ============================================================
    // SCENE 2: Concrete (5s → 20s)
    // ============================================================
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);

    gsap.set(".marker", { opacity: 0, y: 10 });
    tl.to("#marker-0", { opacity: 1, y: 0, duration: 0.3 }, 5.5);

    gsap.set("#scene2-text", { opacity: 0 });
    tl.to("#car", { left: "36.67%", duration: 4, ease: "none" }, 6);
    tl.to("#clockHand", { rotation: 360, duration: 4, ease: "none" }, 6);
    tl.to("#marker-60", { opacity: 1, y: 0, duration: 0.3 }, 8);

    tl.add(() => {
        document.getElementById("clockLabel").textContent = "1 hr";
    }, 10);
    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 10);

    tl.to("#car", { left: "68.33%", duration: 3, ease: "none" }, 11);
    tl.to("#clockHand", { rotation: 720, duration: 3, ease: "none" }, 11);
    tl.to("#marker-120", { opacity: 1, y: 0, duration: 0.3 }, 12.5);
    tl.add(() => {
        document.getElementById("clockLabel").textContent = "2 hr";
    }, 14);

    tl.to("#car", { left: "95%", duration: 3, ease: "none" }, 14.5);
    tl.to("#clockHand", { rotation: 1080, duration: 3, ease: "none" }, 14.5);
    tl.to("#marker-180", { opacity: 1, y: 0, duration: 0.3 }, 16);
    tl.add(() => {
        document.getElementById("clockLabel").textContent = "3 hr";
    }, 17.5);

    tl.add(() => {
        document.getElementById("scene2-text").textContent = "180 km covered in 3 hours";
    }, 17.5);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // ============================================================
    // SCENE 3: Pictorial (20s → 40s)
    // ============================================================
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to("#barLabelTop", { opacity: 1, duration: 0.6 }, 21);
    tl.to("#distanceBar", { opacity: 1, duration: 0.8, ease: "power2.out" }, 21.5);

    tl.to("#unit1", { opacity: 1, duration: 0.6 }, 24);
    tl.to("#unit2", { opacity: 1, duration: 0.6 }, 25);
    tl.to("#unit3", { opacity: 1, duration: 0.6 }, 26);

    tl.to(".unit-label", { opacity: 1, duration: 0.5, stagger: 0.3 }, 28);
    tl.to(".unit-time", { opacity: 1, duration: 0.5, stagger: 0.3 }, 29);

    tl.to("#speedLabel", { opacity: 1, duration: 0.6 }, 31);

    gsap.set("#scene3-text", { opacity: 0 });
    tl.to("#scene3-text", { opacity: 1, duration: 0.6 }, 33);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // ============================================================
    // SCENE 4: Abstract (40s → 55s)
    // ============================================================
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#formula1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 41);
    tl.to("#formula2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 44);
    tl.to("#formula3", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 47);

    gsap.set(".final-formula", { opacity: 0, scale: 0 });
    tl.to(".equation-chain", { opacity: 0, duration: 0.5 }, 51);
    tl.to(".final-formula", {
        opacity: 1, scale: 1, autoAlpha: 1,
        duration: 1, ease: "back.out(1.7)"
    }, 51.5);

    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // ============================================================
    // SCENE 5: Summary (55s → 60s)
    // ============================================================
    setSubtitle('scene5', 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);

    gsap.set(".summary-car, .logo-text, .slogan-en", { y: 20, opacity: 0 });
    tl.to(".summary-car", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 55.5);
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

    // Playback controls
    document.getElementById("playBtn").addEventListener("click", () => {
        tl.play();
        showToast("▶ 播放中...");
    });
    document.getElementById("pauseBtn").addEventListener("click", () => {
        tl.pause();
        showToast("⏸ 已暂停 — 可以向孩子讲解");
    });
    document.getElementById("restartBtn").addEventListener("click", () => {
        tl.restart();
        showToast("↻ 重新开始");
    });
});
