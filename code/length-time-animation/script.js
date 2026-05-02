document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子常常用手掌来比较长短，但不同人手掌大小不同。我们需要学会用统一的"单位"来测量。',
            en: 'Children use hands to compare lengths, but hand sizes differ. We need standard units for fair comparisons.'
        },
        scene2: {
            cn: '同一本书用回形针量是5个，用橡皮量是3个。书没变，但数字变了！所以我们需要一个大家都认同的"标准单位"——厘米 (cm)。',
            en: 'The same book measures 5 paper clips but 3 erasers. The book didn\'t change, but numbers did! We need a standard unit — centimetre (cm).'
        },
        scene3: {
            cn: '将实物转化为图表。长度用尺子上的数字线表示；时间用钟面表示。短针指"时"，长针指"分"。',
            en: 'Transform objects into diagrams. Length is shown on a ruler; Time is shown on a clock. Short hand = hours, long hand = minutes.'
        },
        scene4: {
            cn: '长度比较直接看数字大小（同单位下）；时间用数字表示——3:00 是3点整，3:30 是3点半。',
            en: 'Compare lengths by numbers (same units); Time in digits — 3:00 means 3 o\'clock, 3:30 means half past 3.'
        },
        scene5: {
            cn: '记住：用统一的单位测量，才能公平比较！',
            en: 'Remember: Use standard units for fair comparison!'
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
    
    // Show clips
    tl.to(".clips-row", { opacity: 1, duration: 0.5 }, 6);
    tl.to(".clips-row .clip", { y: -5, duration: 0.3, stagger: 0.1, yoyo: true, repeat: 1 }, 6.5);
    tl.to("#clipsText", { opacity: 1, duration: 0.5 }, 7.5);

    // Show erasers
    tl.to(".erasers-row", { opacity: 1, duration: 0.5 }, 9);
    tl.to(".erasers-row .eraser", { y: -5, duration: 0.3, stagger: 0.2, yoyo: true, repeat: 1 }, 9.5);
    tl.to("#vsText", { opacity: 1, duration: 0.5 }, 11);
    tl.to("#erasersText", { opacity: 1, duration: 0.5 }, 11.5);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Ruler
    tl.to("#rulerArea", { opacity: 1, duration: 0.5 }, 21);
    tl.to("#rulerFill", { width: "150px", duration: 1.5, ease: "power1.inOut" }, 22);
    tl.to("#rulerLabel", { opacity: 1, y: -5, duration: 0.5 }, 23.5);

    // Clock
    tl.to("#clockArea", { opacity: 1, duration: 0.5 }, 26);
    tl.to("#clockLabel", { opacity: 1, y: -5, duration: 0.5 }, 27);
    
    // Minute hand sweeps to 6
    tl.to("#minuteHand", { rotation: 180, duration: 1.5, ease: "power1.inOut" }, 30);
    // Hour hand moves slightly between 3 and 4
    tl.to("#hourHand", { rotation: 105, duration: 1.5, ease: "power1.inOut" }, 30);
    tl.add(() => document.getElementById("clockLabel").innerText = "half past 3", 31.5);

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
