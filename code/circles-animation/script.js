document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子记不住圆的公式，也不理解 π 是什么。我们用车轮滚动和"切派拼长方形"来说明。',
            en: 'Children can\'t remember circle formulas or understand π. We\'ll use a rolling wheel and "cut-rearrange" to explain.'
        },
        scene2: {
            cn: '车轮滚一圈的距离就是周长。周长÷直径≈3.14——这个不变的比值叫做 π。',
            en: 'Distance the wheel rolls in one turn = circumference. C ÷ d ≈ 3.14 — this constant ratio is π.'
        },
        scene3: {
            cn: '把圆切成小扇形，交替排列拼成近似长方形。高=半径r，宽=半周长πr。面积=πr×r=πr²。',
            en: 'Cut the circle into thin sectors, rearrange into a near-rectangle. Height=r, width=πr. Area = πr × r = πr².'
        },
        scene4: {
            cn: '周长=πd=2πr，面积=πr²。π≈3.14 或用 22/7。',
            en: 'Circumference = πd = 2πr. Area = πr². Use π ≈ 3.14 or 22/7.'
        },
        scene5: {
            cn: '记住：π 是圆的灵魂——周长=2πr，面积=πr²！',
            en: 'Remember: π is the heart of every circle — C=2πr, A=πr²!'
        }
    };

    // ============================================================
    // Geometry Setup
    // ============================================================
    const numSlices = 16;
    const pieContainer = document.getElementById("pieContainer");
    const rectContainer = document.getElementById("rectContainer");

    const anglePerSlice = 360 / numSlices;

    for (let i = 0; i < numSlices; i++) {
        // --- Pie slice ---
        let pSlice = document.createElement("div");
        pSlice.className = "slice";
        pSlice.id = `pslice${i}`;
        
        const halfAngleRad = (anglePerSlice / 2) * (Math.PI / 180);
        const topWidth = 80 * Math.tan(halfAngleRad);
        const y1 = 80 - topWidth;
        const y2 = 80 + topWidth;
        const clipStr = `polygon(0px 80px, 80px ${y1}px, 80px ${y2}px)`;
        
        pSlice.style.clipPath = clipStr;
        pSlice.style.webkitClipPath = clipStr;
        
        pieContainer.appendChild(pSlice);
        
        // Use GSAP to set initial transforms
        gsap.set(pSlice, { rotation: i * anglePerSlice, transformOrigin: "0px 80px" });

        // --- Rect slice ---
        let rSlice = document.createElement("div");
        rSlice.className = "rect-slice";
        rSlice.id = `rslice${i}`;
        
        rSlice.style.clipPath = clipStr;
        rSlice.style.webkitClipPath = clipStr;
        
        rectContainer.appendChild(rSlice);
        
        const startX = 200 - (numSlices * topWidth) / 2;
        const offset = startX + i * topWidth;
        
        if (i % 2 === 0) {
            gsap.set(rSlice, { x: offset, y: -100, rotation: -90, transformOrigin: "0px 80px", opacity: 0 });
        } else {
            gsap.set(rSlice, { x: offset, y: -180, rotation: 90, transformOrigin: "0px 80px", opacity: 0 });
        }
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
    
    // Roll the wheel
    // Pi * 100px diameter = 314px track length
    tl.to("#wheel", { x: 314, rotation: 360, duration: 2, ease: "power1.inOut" }, 6);
    tl.to("#paintTrack", { width: 314, duration: 2, ease: "power1.inOut" }, 6);
    
    tl.to("#statC", { opacity: 1, y: 0, duration: 0.5 }, 9);
    tl.to("#statDiv", { opacity: 1, y: 0, duration: 0.5 }, 11);

    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 13);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // 1. Fade out pie
    tl.to(".slice", { opacity: 0, duration: 0.3 }, 21);
    
    // 2. Fly in rect slices to their final interlocking Y positions
    tl.to(".rect-slice", { 
        opacity: 1, 
        y: (i) => (i % 2 === 0) ? 0 : -80, 
        stagger: 0.05, 
        duration: 0.5, 
        ease: "back.out(1.2)" 
    }, 21.3);

    // Show labels
    tl.to("#rectLabels", { opacity: 1, duration: 0.5 }, 26);
    
    // Show area eq
    tl.to("#areaEq", { opacity: 1, y: 0, duration: 0.5 }, 29);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".formulas-box", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, 41);
    tl.to("#calcExample", { opacity: 1, y: 0, duration: 0.6 }, 45);

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
