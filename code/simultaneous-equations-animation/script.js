document.addEventListener("DOMContentLoaded", () => {
    const subtitles = {
        scene1: {
            cn: '含有两个未知数的问题是代数启蒙。不用怕，我们可以通过"找不同"（消元）和"代入"的方法来解决它。',
            en: 'Problems with two unknowns are the start of algebra. Don\'t worry, we can solve them by finding the "difference" (elimination) and "substituting".'
        },
        scene2: {
            cn: '第一步（具象）：看这两个天平。第一个比第二个多了一个苹果，价格多了 $2。所以，这 1 个多出来的苹果就等于 $2。这就是消元法！',
            en: 'Step 1 (Concrete): Look at these scales. The first has 1 more apple and costs $2 more. So, that extra apple equals $2. This is Elimination!'
        },
        scene3: {
            cn: '第二步（形象）：既然我们知道了 1 个苹果是 2 元，我们把它代入回第二个模型中，香蕉的价钱就一目了然了。',
            en: 'Step 2 (Pictorial): Since we know 1 Apple is $2, we substitute it back into the second model. The banana\'s price becomes obvious.'
        },
        scene4: {
            cn: '第三步（抽象）：这就是联立方程组。方程一减去方程二，消去共同项，解出一个未知数，再代入原方程解出另一个。',
            en: 'Step 3 (Abstract): This is a system of equations. Subtract Eq 2 from Eq 1 to eliminate the common term, solve for A, then substitute back for B.'
        },
        scene5: {
            cn: '记住：消掉一个，求出另一个，代入解决全部！',
            en: 'Remember: Eliminate one, solve the other, substitute to solve them all!'
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
    
    // Scale 1
    tl.to("#scale1", { opacity: 1, y: -10, duration: 0.5 }, 6);
    // Scale 2
    tl.to("#scale2", { opacity: 1, y: -10, duration: 0.5 }, 8);

    // Fade out common items
    tl.to(["#scale1 .apple:last-child", "#scale2 .apple"], { opacity: 0.3, duration: 1 }, 11);
    tl.to(["#scale1 .banana", "#scale2 .banana"], { opacity: 0.3, duration: 1 }, 11);

    // Show difference
    tl.to("#diffArrow", { opacity: 1, x: 20, duration: 0.5 }, 13);
    tl.to("#diffArrow", { scale: 1.1, duration: 0.5, yoyo: true, repeat: 3 }, 14);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to("#barEq2", { opacity: 1, duration: 0.5 }, 22);
    tl.to("#barEq2Sub", { opacity: 1, duration: 0.5 }, 25);
    tl.from("#subVal", { y: -50, opacity: 0, duration: 0.8, ease: "bounce.out" }, 26);
    
    tl.to(".block-b", { scale: 1.1, duration: 0.5, yoyo: true, repeat: 3 }, 29);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#sys1", { opacity: 1, y: -10, duration: 0.5 }, 42);
    tl.to("#sys2", { opacity: 1, y: -10, duration: 0.5 }, 43);
    
    tl.to("#sysDiff", { opacity: 1, y: -10, duration: 0.5 }, 46);
    tl.to("#sysSub", { opacity: 1, y: -10, duration: 0.5 }, 49);

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
