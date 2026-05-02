document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子经常以为角的大小取决于线的长短，其实角只看"张开的程度"。',
            en: 'Children often think angle size depends on line length. Actually, it\'s about "how much it opens".'
        },
        scene2: {
            cn: '第一步（具象）：扇子打开的程度就是"角度"。十字路口=垂直，铁轨=平行。',
            en: 'Step 1 (Concrete): The fan\'s opening IS the angle. Crossroad=perpendicular; tracks=parallel.'
        },
        scene3: {
            cn: '第二步（形象）：角分三类——锐角（<90°）、直角（=90°）、钝角（>90°）。垂直线交成90°，平行线永不相交。',
            en: 'Step 2 (Pictorial): Three types — acute (<90°), right (=90°), obtuse (>90°). Perpendicular=90° cross; parallel=never meet.'
        },
        scene4: {
            cn: '第三步（抽象）：判断角的大小只看张开程度，不看边的长短。',
            en: 'Step 3 (Abstract): Angle size depends on opening, NOT on line length.'
        },
        scene5: {
            cn: '记住：角的大小看张开程度，不看线的长短！',
            en: 'Remember: Angle size = how much it turns, NOT how long the lines are!'
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
    
    // Fan opening
    const fanLabel = document.getElementById("fanLabel");
    tl.to({val: 0}, {
        val: 180,
        duration: 4,
        ease: "none",
        onUpdate: function() {
            const angle = Math.round(this.targets()[0].val);
            gsap.set("#fanMoving", { rotation: -angle }); // Stick rotates CCW
            
            // Adjust arc. Easiest way in pure CSS without canvas is conic-gradient, 
            // but for simplicity we can use transform or clip-path. We'll just update label for now to simulate.
            fanLabel.innerText = angle + "°";
            if (angle === 90) fanLabel.innerHTML = "90°<br><span style='font-size:0.8rem;color:#e74c3c'>Right Angle!</span>";
        }
    }, 6);
    
    tl.to("#fanArea", { opacity: 0, scale: 0.5, y: -50, duration: 0.5 }, 11);

    // Show real world
    tl.to("#realWorld", { opacity: 1, duration: 0.5 }, 11.5);
    tl.from(".rw-item", { scale: 0, stagger: 0.5, duration: 0.5, ease: "back.out" }, 11.5);

    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 13);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Show angle types
    tl.from(".a-type", { opacity: 0, y: 20, stagger: 0.8, duration: 0.5 }, 21);

    // Show line types
    tl.to("#angleTypes", { scale: 0.7, y: -50, duration: 0.5 }, 25);
    tl.to("#lineTypes", { opacity: 1, duration: 0.5 }, 25.5);
    tl.from(".l-type", { opacity: 0, scale: 0.5, stagger: 1, duration: 0.5 }, 26);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#ab1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 42);
    tl.to("#ab2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 45);
    tl.to("#ab3", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 48);
    tl.to("#ab4", { opacity: 1, scale: 1.5, duration: 0.6, ease: "back.out(1.7)" }, 51);

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
