document.addEventListener("DOMContentLoaded", () => {
    const subtitles = {
        scene1: {
            cn: '图形规律题总让人眼花缭乱。很多学生只会傻傻地往后画，无法求出第 n 个图形。关键在于"结构拆解"。',
            en: 'Pattern sequences can be confusing. Many just try to draw the next one, but fail at finding the nth figure. The key is "structural breakdown".'
        },
        scene2: {
            cn: '第一步（具象）：用颜色给方块分类。红色的是"恒定不变的种子"（核心），蓝色的则是随着序号"生长的枝叶"。',
            en: 'Step 1 (Concrete): Color-code the blocks. Red is the "constant seed" (core), and blue are the "growing branches" that change with the figure number.'
        },
        scene3: {
            cn: '第二步（形象）：将图形规律提取为文字模型：总数 = 恒定的种子 +（每次增加的数量 × 序号）。',
            en: 'Step 2 (Pictorial): Extract the visual pattern into a word model: Total = Constant Seed + (Increment × Figure Number).'
        },
        scene4: {
            cn: '第三步（抽象）：用表格列出数据，验证我们的模型。提取出 1 + 2n 这个代数公式。',
            en: 'Step 3 (Abstract): Use a table to list the data and verify our model. Extract the algebraic formula 1 + 2n.'
        },
        scene5: {
            cn: '记住：找规律，先分离"变"与"不变"！',
            en: 'Remember: To find the pattern, separate the "changing" from the "constant"!'
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

    function setSubtitle(sceneKey, time) { tl.add(() => renderSubtitle(sceneKey), time); }

    // SCENE 1
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Fig 1
    tl.to("#fig1", { opacity: 1, y: 0, duration: 0.5 }, 6);
    tl.to("#fig1 .tile-outer", { opacity: 1, duration: 0.5, stagger: 0.2 }, 6.5);
    
    // Fig 2
    tl.to("#fig2", { opacity: 1, y: 0, duration: 0.5 }, 8);
    tl.to("#fig2 .tile-outer", { opacity: 1, duration: 0.5, stagger: 0.2 }, 8.5);

    // Fig 3
    tl.to("#fig3", { opacity: 1, y: 0, duration: 0.5 }, 11);
    tl.to("#fig3 .tile-outer", { opacity: 1, duration: 0.5, stagger: 0.2 }, 11.5);

    // Highlight Cores
    tl.to(".tile-core", { scale: 1.3, duration: 0.5, yoyo: true, repeat: 3 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to(".map-core", { opacity: 1, y: -10, duration: 0.8 }, 22);
    tl.to(".map-plus", { opacity: 1, duration: 0.5 }, 24);
    tl.to(".map-grow", { opacity: 1, y: -10, duration: 0.8 }, 25);
    tl.to(".map-tile.tile-outer", { scale: 1.2, duration: 0.5, yoyo: true, repeat: 3 }, 27);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#tr1", { opacity: 1, x: 0, duration: 0.5 }, 42);
    tl.to("#tr2", { opacity: 1, x: 0, duration: 0.5 }, 44);
    tl.to("#tr3", { opacity: 1, x: 0, duration: 0.5 }, 46);
    tl.to("#trN", { opacity: 1, x: 0, duration: 0.8 }, 49);
    
    tl.to("#trN", { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1 }, 51);

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
