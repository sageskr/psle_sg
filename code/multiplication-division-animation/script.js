document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '很多孩子在背乘法表，但不理解乘法就是"几个几"。理解了这一点，除法也就自然会了。',
            en: 'Many children memorize times tables but don\'t understand multiplication means "groups of". Once they get this, division becomes natural.'
        },
        scene2: {
            cn: '第一步（具象）：3袋弹珠，每袋4颗，一共多少？数一数：4, 8, 12！反过来，12颗弹珠平均分成3袋，每袋得到4颗——这就是除法。',
            en: 'Step 1 (Concrete): 3 bags, 4 marbles each — how many total? Count: 4, 8, 12! Reverse: 12 marbles shared into 3 bags = 4 each. That\'s division.'
        },
        scene3: {
            cn: '第二步（形象）：模型图一模一样！乘法问"3组4是多少？"除法问"12分成3组，每组几个？"一个是求总数，一个是求每份。',
            en: 'Step 2 (Pictorial): The bar model is identical! Multiplication asks "3 groups of 4 = ?" Division asks "12 shared into 3 groups = ?" One finds the total, the other finds each group.'
        },
        scene4: {
            cn: '第三步（抽象）：3×4=12, 12÷3=4, 12÷4=3 ——这三个算式是一家人。理解了乘法模型，除法就是反着问。',
            en: 'Step 3 (Abstract): 3×4=12, 12÷3=4, 12÷4=3 — these are a fact family. Understanding the multiplication model means division is just asking the reverse question.'
        },
        scene5: {
            cn: '记住：乘法是数几组，除法是平均分！',
            en: 'Remember: Multiply = count groups. Divide = share equally!'
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
        // Re-render KaTeX if any math exists inside subtitles
        renderMathInElement(subtitleEl, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
            ]
        });
    }

    renderSubtitle('scene1');

    // Language toggle
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
    
    // Action 1: Bags appear
    tl.to(".bag", { opacity: 1, y: -20, duration: 0.5, stagger: 0.2 }, 6);
    tl.to(".bag-label", { opacity: 1, duration: 0.5, stagger: 0.5 }, 7.5);
    
    // Action 2: Count 4...8...12!
    tl.add(() => document.getElementById("scene2-text").innerHTML = "4...", 9);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "4... 8...", 9.8);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "4... 8... 12!", 10.6);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "3 groups of 4 = 12", 12);
    
    // Action 3: Reverse! Hide bags, show loose marbles, then sort them back into bags
    tl.to(".bags-wrapper", { opacity: 0, duration: 0.5 }, 13.5);
    tl.to(".loose-marbles", { autoAlpha: 1, duration: 0.5 }, 14);
    tl.to(".loose-marbles", { autoAlpha: 0, duration: 0.5 }, 16);
    tl.to(".bags-wrapper", { opacity: 1, duration: 0.5 }, 16.5);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "12 shared into 3 groups = 4 each", 17);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    tl.to("#barRow", { opacity: 1, duration: 0.5 }, 21);
    tl.to("#bracketBottom", { opacity: 1, duration: 0.5 }, 22);
    tl.to("#barEquation", { opacity: 1, duration: 0.5 }, 23); // 3 x 4 = 12

    tl.to("#barEquation", { opacity: 0, duration: 0.5 }, 27);
    tl.to("#bracketBottom", { opacity: 0, duration: 0.5 }, 27);
    tl.to("#bracketTop", { opacity: 1, duration: 0.5 }, 28);
    
    // Change labels to "?" then "4"
    tl.add(() => {
        document.getElementById("label1").innerHTML = "?";
        document.getElementById("label2").innerHTML = "?";
        document.getElementById("label3").innerHTML = "?";
        document.getElementById("barEquation").innerHTML = "12 &divide; 3 = ?";
    }, 28.5);
    tl.to("#barEquation", { opacity: 1, duration: 0.5 }, 29);
    
    tl.add(() => {
        document.getElementById("label1").innerHTML = "4";
        document.getElementById("label2").innerHTML = "4";
        document.getElementById("label3").innerHTML = "4";
        document.getElementById("barEquation").innerHTML = "12 &divide; 3 = 4";
    }, 32);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".fact-family-title", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 41);
    tl.to("#eq1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 43);
    tl.to("#eq2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 45);
    tl.to("#eq3", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 47);

    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // SCENE 5: Summary (55-60s)
    setSubtitle('scene5', 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);
    
    tl.to(".summary-bags", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 55.5);
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
