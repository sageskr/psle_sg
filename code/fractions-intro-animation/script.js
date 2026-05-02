document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '很多孩子把 1/4 看成"1和4两个数字"。实际上分数描述的是一个东西被平均分之后取了几份。关键是"平均分"！',
            en: 'Many children see 1/4 as "1 and 4". A fraction actually describes equal parts taken from a whole. Key is "equal parts"!'
        },
        scene2: {
            cn: '第一步（具象）：把比萨平均切成4块，拿走1块——这就是"四分之一"。注意：必须"平均分"！如果不平均，就不是四分之一。',
            en: 'Step 1 (Concrete): Cut pizza into 4 equal slices, take 1 — that\'s "one quarter". Key: it MUST be equal! Unequal pieces are NOT quarters.'
        },
        scene3: {
            cn: '第二步（形象）：分子表示"拿走几份"，分母表示"一共平均分几份"。2/4 就是拿走2份，4/4 就是全部拿走，等于1个整的。',
            en: 'Step 2 (Pictorial): Numerator = parts taken. Denominator = total equal parts. 2/4 = take 2; 4/4 = take all = 1 whole.'
        },
        scene4: {
            cn: '第三步（抽象）：1/4 就是 1÷4。分母越大，每份越小——1/5 比 1/4 更小！',
            en: 'Step 3 (Abstract): 1/4 means 1÷4. The bigger the denominator, the smaller each piece — 1/5 is smaller than 1/4!'
        },
        scene5: {
            cn: '记住：分数 = 一个整体被平均分后取了几份！',
            en: 'Remember: A fraction = equal parts taken from a whole!'
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
    
    // Cut equal pizza
    tl.to("#equalPizza .cut-lines", { opacity: 1, duration: 0.5 }, 6);
    tl.to("#equalPizza .s1", { x: 10, y: -10, duration: 1, ease: "power1.out" }, 7); // lift one slice
    tl.to("#eqLabel", { opacity: 1, y: -10, duration: 0.5 }, 8.5);

    // Show unequal pizza
    tl.to("#equalPizza", { scale: 0.8, x: -100, duration: 0.5 }, 11);
    tl.to("#unequalPizza", { display: "flex", opacity: 1, x: 100, scale: 0.8, duration: 0.5 }, 11.5);
    tl.to("#unequalPizza .cut-lines", { opacity: 1, duration: 0.5 }, 12.5);
    tl.to("#unequalPizza .pizza-label", { opacity: 1, duration: 0.5 }, 13.5);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Bar splits
    tl.to("#bar1Whole", { opacity: 0, duration: 0.2 }, 22);
    tl.to("#barFractions", { opacity: 1, duration: 0.2 }, 22.2);

    // 1/4
    tl.to("#fb1", { backgroundColor: "#3498db", duration: 0.5 }, 23);
    tl.to("#fracLabelArea", { opacity: 1, y: -10, duration: 0.5 }, 24);

    // 2/4
    tl.add(() => { document.getElementById("theFrac").innerHTML = "$$\\frac{2}{4}$$"; renderMathInElement(document.getElementById("theFrac")); }, 27);
    tl.to("#fb2", { backgroundColor: "#3498db", duration: 0.5 }, 27);

    // 3/4
    tl.add(() => { document.getElementById("theFrac").innerHTML = "$$\\frac{3}{4}$$"; renderMathInElement(document.getElementById("theFrac")); }, 30);
    tl.to("#fb3", { backgroundColor: "#3498db", duration: 0.5 }, 30);

    // 4/4
    tl.add(() => { document.getElementById("theFrac").innerHTML = "$$\\frac{4}{4}$$"; renderMathInElement(document.getElementById("theFrac")); }, 33);
    tl.to("#fb4", { backgroundColor: "#3498db", duration: 0.5 }, 33);
    
    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#ab1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 42);
    tl.to("#ab2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 44);
    
    tl.to("#fracSeq", { opacity: 1, duration: 0.5 }, 46);
    tl.from("#fracSeq .seq-item", { x: -20, opacity: 0, stagger: 0.5, duration: 0.5 }, 46.5);

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
