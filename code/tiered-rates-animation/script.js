document.addEventListener("DOMContentLoaded", () => {
    const subtitles = {
        scene1: {
            cn: '做水电费或停车费题目时，会直接用总数乘以最高单价。其实，计费就像爬楼梯，每一段的"价格步长"不一样。',
            en: 'Many calculate bills by multiplying the total by the highest rate. In reality, pricing is like climbing stairs — each segment has its own "step price".'
        },
        scene2: {
            cn: '第一步（具象）：看这个积木塔。第一个小时免费，第二个小时2元，之后更贵。总费用是所有积木加起来。',
            en: 'Step 1 (Concrete): Look at this block tower. First hour is free, second is $2, then pricier. Total cost is the sum of these specific blocks.'
        },
        scene3: {
            cn: '第二步（形象）：把总数像切甘蔗一样切段。每一段贴上自己的价格标签，分段计算。',
            en: 'Step 2 (Pictorial): Cut the total into segments. Label each segment with its own price tag and calculate them individually.'
        },
        scene4: {
            cn: '第三步（抽象）：列表格是解这类题的神器。确保数量加起来等于总数，然后各乘单价，最后求和。',
            en: 'Step 3 (Abstract): A table is the best tool. Ensure the sum of quantities equals the total, multiply by respective rates, and add up.'
        },
        scene5: {
            cn: '记住：阶梯计费，分段是关键！',
            en: 'Remember: For tiered rates, segmentation is the key!'
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
    
    // Car enters
    tl.to(".gate-arm", { rotation: -90, duration: 0.5 }, 6);
    tl.to("#theCar", { opacity: 1, x: 120, duration: 1 }, 6.5);
    tl.to(".gate-arm", { rotation: 0, duration: 0.5 }, 7.5);

    // Blocks stack up
    tl.to("#concTotal", { opacity: 1, duration: 0.5 }, 8);
    
    tl.to("#block1", { opacity: 1, y: 0, duration: 0.5 }, 9);
    
    tl.to("#block2", { opacity: 1, y: 0, duration: 0.5 }, 11);
    tl.add(() => document.getElementById("concTotal").textContent = "Total: $2", 11.5);
    
    tl.to("#block3", { opacity: 1, y: 0, duration: 0.5 }, 13);
    tl.add(() => document.getElementById("concTotal").textContent = "Total: $10", 13.5);
    
    tl.to("#concTotal", { scale: 1.2, color: "#e74c3c", duration: 0.5, yoyo: true, repeat: 3 }, 14);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to("#fullBar", { opacity: 0.5, duration: 0.5 }, 22);
    
    tl.to(".bar-segment", { opacity: 1, duration: 0.5, stagger: 1 }, 23);
    
    tl.to(".sub-total", { opacity: 1, y: -10, duration: 0.5, stagger: 1 }, 27);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#tr1", { opacity: 1, x: 0, duration: 0.5 }, 42);
    tl.to("#tr2", { opacity: 1, x: 0, duration: 0.5 }, 44);
    tl.to("#tr3", { opacity: 1, x: 0, duration: 0.5 }, 46);
    tl.to("#trTotal", { opacity: 1, x: 0, duration: 0.5 }, 49);

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
