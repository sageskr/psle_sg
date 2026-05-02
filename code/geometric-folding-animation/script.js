document.addEventListener("DOMContentLoaded", () => {
    const subtitles = {
        scene1: {
            cn: '折叠问题是几何中的难点。关键在于理解：折叠后的两个三角形是完全一样的（全等），对应的角也相等。',
            en: 'Folding problems are tough. The key is understanding that the folded parts are identical (congruent), and corresponding angles are equal.'
        },
        scene2: {
            cn: '第一步（具象）：看这个半透明纸片。折过去的部分和原来的部分完全重合。折痕就像一面镜子。',
            en: 'Step 1 (Concrete): Look at this translucent paper. The folded part overlaps perfectly. The fold line acts like a mirror.'
        },
        scene3: {
            cn: '第二步（形象）：在图纸上标出对应角。折痕处的两个角是相等的，因为它们原本就是同一个角折叠而成的。',
            en: 'Step 2 (Pictorial): Mark corresponding angles. The two angles at the fold line are equal because they are the same angle folded over.'
        },
        scene4: {
            cn: '第三步（抽象）：利用几何定理计算。直线上的总和是 180 度。减去已知角，剩下平分就能算出答案。',
            en: 'Step 3 (Abstract): Use geometric theorems. The sum on a straight line is 180°. Subtract known angle, divide by two.'
        },
        scene5: {
            cn: '记住：折叠就是寻找隐藏的"双胞胎"角！',
            en: 'Remember: Folding is all about finding the hidden "twin" angles!'
        }
    };

    let currentLang = 'both';
    let currentSceneKey = 'scene1';
    const subtitleEl = document.getElementById("subtitle-text");

    function renderSubtitle(sceneKey) {
        currentSceneKey = sceneKey;
        const data = subtitles[sceneKey];
        if (!data) return;
        let html = '';
        if (currentLang === 'cn') { html = `<div class="subtitle-line-cn">${data.cn}</div>`; }
        else if (currentLang === 'en') { html = `<div class="subtitle-line-en">${data.en}</div>`; }
        else { html = `<div class="subtitle-line-cn">${data.cn}</div><div class="subtitle-line-en">${data.en}</div>`; }
        subtitleEl.innerHTML = html;
        renderMathInElement(subtitleEl, { delimiters: [ { left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false } ] });
    }
    renderSubtitle('scene1');
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); currentLang = btn.dataset.lang; renderSubtitle(currentSceneKey);
            showToast(currentLang === 'cn' ? '🇨🇳 中文字幕' : currentLang === 'en' ? '🇬🇧 English Subtitles' : '🇨🇳🇬🇧 双语 Bilingual');
        });
    });

    const tl = gsap.timeline({ paused: true });
    gsap.set(".scene", { autoAlpha: 0 });
    gsap.set("#scene1", { autoAlpha: 1 });
    gsap.set("#foldPiece", { rotationY: 0, transformOrigin: "left center" });

    function setSubtitle(sceneKey, time) { tl.add(() => renderSubtitle(sceneKey), time); }

    // SCENE 1
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Fold animation (over Y axis, 180 deg)
    tl.to("#foldPiece", { rotationY: -180, duration: 2, ease: "power2.inOut" }, 7);
    tl.to("#foldPiece", { rotationY: 0, duration: 1.5, ease: "power2.inOut" }, 10);
    tl.to("#foldPiece", { rotationY: -180, duration: 1.5, ease: "power2.inOut" }, 12);
    
    // Highlight fold line
    tl.to("#foldLine", { opacity: 1, duration: 0.5, yoyo: true, repeat: 3 }, 14);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Initial 90 deg angle
    tl.to(".angle-90", { opacity: 1, duration: 0.5 }, 22);
    
    // Highlight fold line
    tl.to("#diagFoldLine", { opacity: 1, duration: 0.5 }, 24);

    // Show x angles
    tl.to(".angle-x1", { opacity: 1, scale: 1.5, duration: 0.5, yoyo: true, repeat: 1 }, 27);
    tl.to(".angle-x2", { opacity: 1, scale: 1.5, duration: 0.5, yoyo: true, repeat: 1 }, 29);
    
    tl.to([".angle-x1", ".angle-x2"], { opacity: 1, duration: 0.5 }, 30);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".eq-part", { opacity: 1, x: 20, duration: 0.5, stagger: 2 }, 42);
    tl.to(".eq-desc", { opacity: 1, duration: 0.5 }, 43);

    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // SCENE 5
    setSubtitle('scene5', 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);
    tl.to(".summary-icon", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 55.5);
    tl.to(".logo-text", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.2);
    tl.to(".slogan-en", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.8);

    // Controls
    const scenes = [ { name: "Scene 1: Introduction", start: 0, end: 5 }, { name: "Scene 2: Concrete", start: 5, end: 20 }, { name: "Scene 3: Pictorial", start: 20, end: 40 }, { name: "Scene 4: Abstract", start: 40, end: 55 }, { name: "Scene 5: Summary", start: 55, end: 60 } ];
    const TOTAL_DURATION = 60;
    const progressFill = document.getElementById("progressFill");
    const sceneLabel = document.getElementById("sceneLabel");
    const countdownLabel = document.getElementById("countdownLabel");
    const toastEl = document.getElementById("toast");
    let toastTimer = null;
    function showToast(msg) { clearTimeout(toastTimer); toastEl.textContent = msg; toastEl.classList.add("show"); toastTimer = setTimeout(() => { toastEl.classList.remove("show"); }, 1800); }
    function updateProgress() {
        const currentTime = tl.time();
        progressFill.style.width = Math.min(currentTime / TOTAL_DURATION * 100, 100) + "%";
        let current = scenes[scenes.length - 1];
        for (const s of scenes) { if (currentTime < s.end) { current = s; break; } }
        sceneLabel.textContent = current.name;
        const remaining = Math.max(0, Math.ceil(current.end - currentTime));
        if (remaining > 0 && currentTime < TOTAL_DURATION) { countdownLabel.textContent = `下一步：${remaining}s`; } else { countdownLabel.textContent = "✓ 完成"; }
    }
    gsap.ticker.add(updateProgress);
    document.getElementById("playBtn").addEventListener("click", () => { tl.play(); showToast("▶ 播放中..."); });
    document.getElementById("pauseBtn").addEventListener("click", () => { tl.pause(); showToast("⏸ 已暂停 — 可以向孩子讲解"); });
    document.getElementById("restartBtn").addEventListener("click", () => { tl.restart(); showToast("↻ 重新开始"); });
});
