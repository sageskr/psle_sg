document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子经常搞混"块"和"角"（元和分），也不会读量杯上的水位线。我们用实物帮孩子建立直观认识。',
            en: 'Children mix up dollars and cents, and struggle reading water levels. We\'ll use objects to build understanding.'
        },
        scene2: {
            cn: '第一步（具象）：1块钱可以换成2个5角，或5个2角，或10个1角——总共都是100分。量杯的果汁从0升到500毫升，要看液面和眼睛平齐的刻度线。',
            en: 'Step 1 (Concrete): $1 = 2×50¢, 5×20¢, or 10×10¢ — always 100 cents. The juice rises to 500 mℓ; read at eye level.'
        },
        scene3: {
            cn: '第二步（形象）：把钱币转化为模型图。$1 = 100¢ 的关系一目了然。量杯也可以用竖直的条形图表示，刻度对应高度。',
            en: 'Step 2 (Pictorial): Convert to bar models. $1 = 100¢ is visually clear. The jug becomes a vertical bar chart.'
        },
        scene4: {
            cn: '第三步（抽象）：$1=100¢，1升=1000毫升。只要记住这两个换算关系，就能灵活计算找零和量的多少。',
            en: 'Step 3 (Abstract): Master these two conversions ($1 = 100¢, 1ℓ = 1000mℓ) and calculate confidently.'
        },
        scene5: {
            cn: '记住两个关键换算：1块=100分，1升=1000毫升！',
            en: 'Remember two key conversions: $1 = 100¢, 1ℓ = 1000mℓ!'
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
    
    // Coins logic
    tl.to("#coin1", { opacity: 0, duration: 0.2 }, 6);
    tl.to(".c50-1, .c50-2", { display: "flex", opacity: 1, x: (i) => i === 0 ? -40 : 40, duration: 0.5 }, 6.2);
    
    tl.to(".c50-1, .c50-2", { opacity: 0, duration: 0.2 }, 8);
    tl.to("#c20-group", { display: "flex", opacity: 1, duration: 0.5 }, 8.2);

    tl.to("#c20-group", { opacity: 0, duration: 0.2 }, 10);
    tl.to("#c10-group", { display: "flex", opacity: 1, duration: 0.5 }, 10.2);

    // Jug logic
    tl.to("#jugArea", { opacity: 1, duration: 0.5 }, 12);
    tl.to("#jugFill", { height: "50%", duration: 3, ease: "power1.inOut" }, 13);
    
    tl.to(".highlight-mark span", { scale: 1.5, duration: 0.5, yoyo: true, repeat: 1 }, 16);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to(".money-model", { opacity: 1, duration: 0.5 }, 21);
    // Split money bar
    tl.to("#moneyMainBar", { opacity: 0, duration: 0.2 }, 23);
    tl.to("#moneySplitBar", { opacity: 1, y: 0, duration: 0.5 }, 23.2);

    // Volume bar
    tl.to("#volModel", { opacity: 1, duration: 0.5 }, 26);

    // Show change calculation visually
    tl.add(() => {
        document.getElementById("moneyMainBar").style.backgroundColor = "#e74c3c";
        document.querySelector(".bar-title").innerText = "Buy toy for $2.50 with $5";
    }, 29);
    tl.to("#moneySplitBar", { opacity: 0, duration: 0.2 }, 29.5);
    tl.to("#moneyMainBar", { opacity: 1, duration: 0.5 }, 30);
    tl.to("#moneyMainBar", { width: "200px", duration: 1 }, 31); // shrinks to half

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
