document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子经常把面积和周长搞混。简单来说：面积是"里面有多大"，周长是"外面绕一圈有多长"。',
            en: 'Children mix up area and perimeter. Area = how much inside; perimeter = how far around the outside.'
        },
        scene2: {
            cn: '第一步（具象）：花园里的草地就是"面积"——铺了12块方格砖。蚂蚁沿着围栏走一圈就是"周长"——走了14米。',
            en: 'Step 1 (Concrete): Grass inside the garden is the area — 12 tiles. Ant walking along the fence is the perimeter — 14 metres.'
        },
        scene3: {
            cn: '第二步（形象）：4×3 和 6×2 的面积都是12，但周长不同（14 vs 16）！面积相同不代表周长相同。',
            en: 'Step 2 (Pictorial): 4×3 and 6×2 both have area 12, but different perimeters (14 vs 16)! Same area does NOT mean same perimeter.'
        },
        scene4: {
            cn: '第三步（抽象）：面积 = 长 × 宽（数方格数），周长 = 2 ×（长 + 宽）（绕一圈总长）。',
            en: 'Step 3 (Abstract): Area = length × width. Perimeter = 2 × (length + width).'
        },
        scene5: {
            cn: '记住：面积看里面，周长量外面！',
            en: 'Remember: Area = inside space. Perimeter = outside boundary!'
        }
    };

    // ============================================================
    // Generate Grass Grid dynamically
    // ============================================================
    const grassGrid = document.getElementById("grassGrid");
    for(let i=0; i<12; i++) {
        const tile = document.createElement("div");
        tile.className = "g-tile";
        tile.innerText = i + 1;
        grassGrid.appendChild(tile);
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
    
    // Area
    tl.to(".g-tile", { opacity: 1, scale: 1, stagger: 0.2, duration: 0.3, ease: "back.out(1.5)" }, 6);
    tl.to("#areaLabel", { opacity: 1, duration: 0.5 }, 9);

    // Perimeter fence + ant
    tl.to("#ft", { width: "100%", opacity: 1, duration: 1 }, 10);
    tl.to("#theAnt", { opacity: 1, x: 250, duration: 1, ease: "none" }, 10); // top
    
    tl.to("#fr", { height: "100%", opacity: 1, duration: 1 }, 11);
    tl.to("#theAnt", { rotation: 180, duration: 0.1 }, 11);
    tl.to("#theAnt", { y: 190, duration: 1, ease: "none" }, 11.1); // right

    tl.to("#fb", { width: "100%", opacity: 1, duration: 1 }, 12.1);
    tl.to("#theAnt", { rotation: 270, duration: 0.1 }, 12.1);
    tl.to("#theAnt", { x: 0, duration: 1, ease: "none" }, 12.2); // bottom

    tl.to("#fl", { height: "100%", opacity: 1, duration: 1 }, 13.2);
    tl.to("#theAnt", { rotation: 0, duration: 0.1 }, 13.2);
    tl.to("#theAnt", { y: 0, duration: 1, ease: "none" }, 13.3); // left

    tl.to("#periLabel", { opacity: 1, duration: 0.5 }, 14.5);
    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // 4x3 area
    tl.to("#grid4x3 .cell", { backgroundColor: "rgba(46, 204, 113, 0.5)", stagger: 0.1, duration: 0.1 }, 21);
    
    // 4x3 perimeter
    tl.to("#grid4x3 .grid-cells", { borderColor: "#8B4513", duration: 0.5 }, 23);
    tl.to("#grid4x3 .p-border", { opacity: 1, duration: 0.5 }, 23.5);
    tl.to("#grid4x3 .comp-label", { opacity: 1, duration: 0.5 }, 24.5);

    // 6x2
    tl.to("#grid6x2", { opacity: 1, duration: 0.5 }, 27);
    tl.to("#grid6x2 .cell", { backgroundColor: "rgba(46, 204, 113, 0.5)", stagger: 0.1, duration: 0.1 }, 28);
    tl.to("#grid6x2 .grid-cells", { borderColor: "#8B4513", duration: 0.5 }, 30);
    tl.to("#grid6x2 .p-border", { opacity: 1, duration: 0.5 }, 30.5);
    tl.to("#grid6x2 .comp-label", { opacity: 1, duration: 0.5 }, 31.5);

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
