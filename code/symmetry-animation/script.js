document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子能认出蝴蝶是对称的，但不会找"对称轴"，也分不清哪些图形有多条对称轴。',
            en: 'Children can recognize a butterfly is symmetric, but struggle to find the "line of symmetry" and identify shapes with multiple axes.'
        },
        scene2: {
            cn: '把纸对折、剪一个形状、展开——两边完全一样！这条折痕就是"对称轴"。',
            en: 'Fold paper, cut a shape, unfold — both sides match! The fold line is the "line of symmetry".'
        },
        scene3: {
            cn: '正方形有4条对称轴，长方形只有2条（对角线不算！），圆有无数条。',
            en: 'Square = 4 axes. Rectangle = 2 only (diagonals don\'t work!). Circle = infinite axes.'
        },
        scene4: {
            cn: '对称轴把图形分成完全镜像的两半。判断方法：沿线对折，两边能否完全重合？',
            en: 'A line of symmetry creates two mirror-image halves. Test: fold along the line — do both sides match perfectly?'
        },
        scene5: {
            cn: '记住：对折能重合，就是对称！',
            en: 'Remember: If it folds to match, it\'s symmetric!'
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
    gsap.set("#paperRight", { rotationY: 180 }); // start folded

    function setSubtitle(sceneKey, time) {
        tl.add(() => renderSubtitle(sceneKey), time);
    }

    // SCENE 1: Intro (0-5s)
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2: Concrete (5-20s)
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Paper fold and cut
    tl.to("#paper", { opacity: 1, duration: 0.5 }, 5.5);
    tl.to("#heartLeft", { opacity: 1, duration: 0.5 }, 6.5); // cut shape
    tl.to("#heartRight", { opacity: 1, duration: 0 }, 7.5); // cut shape matches
    tl.to("#paperRight", { rotationY: 0, duration: 1, ease: "power2.inOut" }, 7.5); // unfold
    
    // Hide paper, show butterfly
    tl.to("#paper", { opacity: 0, duration: 0.5 }, 11);
    tl.to("#butterflyContainer", { opacity: 1, duration: 0.5 }, 11.5);
    tl.to("#mirror", { opacity: 1, duration: 0.5 }, 12.5); // show mirror line
    tl.to("#wingRight", { opacity: 1, duration: 0.5 }, 13.5); // mirror appears
    
    // Animate butterfly wings flapping
    tl.to(".wing-left", { rotationY: 40, duration: 0.3, yoyo: true, repeat: 7 }, 15);
    tl.to(".wing-right", { rotationY: -40, duration: 0.3, yoyo: true, repeat: 7 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Square lines
    tl.to("#sq-v", { opacity: 1, duration: 0.3 }, 21);
    tl.to("#sq-h", { opacity: 1, duration: 0.3 }, 22);
    tl.to("#sq-d1", { opacity: 1, duration: 0.3 }, 23);
    tl.to("#sq-d2", { opacity: 1, duration: 0.3 }, 24);
    
    // Switch to rectangle
    tl.to("#squareWrapper", { display: "none", opacity: 0, duration: 0.5 }, 26);
    tl.add(() => document.getElementById("scene3-text").innerHTML = "Rectangle = 2 only (diagonals don't work!).", 26.5);
    tl.to("#rectWrapper", { display: "flex", opacity: 1, duration: 0.5 }, 26.5);
    
    tl.to("#re-v", { opacity: 1, duration: 0.3 }, 27.5);
    tl.to("#re-h", { opacity: 1, duration: 0.3 }, 28.5);
    tl.to("#re-d1", { opacity: 1, duration: 0.3 }, 29.5);
    // Error shake for diagonal on rectangle
    tl.to("#rectangleShape", { x: -10, duration: 0.1, yoyo: true, repeat: 3 }, 30);
    
    // Switch to circle
    tl.to("#rectWrapper", { display: "none", opacity: 0, duration: 0.5 }, 32);
    tl.add(() => document.getElementById("scene3-text").innerHTML = "Circle = infinite axes.", 32.5);
    tl.to("#circleWrapper", { display: "flex", opacity: 1, duration: 0.5 }, 32.5);
    
    // Multiple lines pop in
    tl.to('[id^="ci-l"]', { opacity: 1, duration: 0.1, stagger: 0.1 }, 33.5);
    // Spin circle
    tl.to("#circleWrapper", { rotation: 180, duration: 3, ease: "linear" }, 35);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".fact-family-title", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 41);
    
    // Table rows fade in
    tl.to("#row1", { opacity: 1, x: 0, duration: 0.4 }, 43);
    tl.to("#row2", { opacity: 1, x: 0, duration: 0.4 }, 45);
    tl.to("#row3", { opacity: 1, x: 0, duration: 0.4 }, 47);
    tl.to("#row4", { opacity: 1, x: 0, duration: 0.4 }, 49);

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
