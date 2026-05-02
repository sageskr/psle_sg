document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '复杂应用题不是比谁算得快，而是比谁"画得准"。新加坡数学的秘密武器就是模型图（Bar Model）。',
            en: 'Complex word problems aren\'t about fast calculation — they\'re about accurate modeling. Singapore Math\'s secret weapon is the Bar Model.'
        },
        scene2: {
            cn: 'Ali的贴纸是Ben的3倍，一共120张。不要急着算——先画模型图！',
            en: 'Ali has 3× Ben\'s stickers, total 120. Don\'t rush to calculate — draw the model first!'
        },
        scene3: {
            cn: '画出来：Ben=1份，Ali=3份，共4份=120。1份=30，Ali=90。检验：30+90=120 ✓',
            en: 'Draw it: Ben=1 unit, Ali=3 units, 4 units=120. 1 unit=30, Ali=90. Check: 30+90=120 ✓'
        },
        scene4: {
            cn: '四步法：读题→画图→算一份→验证。不管题目多复杂，模型图都能帮你理清关系。',
            en: '4-step method: Read → Draw → Solve for 1 unit → Check. No matter how complex, bar models clarify relationships.'
        },
        scene5: {
            cn: '记住：先画图，再计算！模型图是破解应用题的万能钥匙。',
            en: 'Remember: Draw first, calculate second! Bar models are the universal key to word problems.'
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
    
    tl.to(".pile", { opacity: 1, y: 0, stagger: 0.2, duration: 0.5, ease: "back.out(1.5)" }, 6);
    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 9);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Ben's block
    tl.to("#b1", { opacity: 1, scaleX: 1, duration: 0.5 }, 21);
    
    // Ali's blocks
    tl.to("#a1", { opacity: 1, scaleX: 1, duration: 0.3 }, 22);
    tl.to("#a2", { opacity: 1, scaleX: 1, duration: 0.3 }, 22.3);
    tl.to("#a3", { opacity: 1, scaleX: 1, duration: 0.3 }, 22.6);

    // Total
    tl.to("#totalBracket", { opacity: 1, duration: 0.5 }, 24);

    // Calc Steps
    tl.to("#cStep1", { opacity: 1, y: 0, duration: 0.5 }, 26);
    tl.to("#cStep2", { opacity: 1, y: 0, duration: 0.5 }, 28);
    tl.to("#cStep3", { opacity: 1, y: 0, duration: 0.5 }, 31);
    tl.to("#cStep4", { opacity: 1, y: 0, duration: 0.5 }, 34);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".fw1", { opacity: 1, x: 0, duration: 0.4 }, 41);
    tl.to(".fw2", { opacity: 1, x: 0, duration: 0.4 }, 43);
    tl.to(".fw3", { opacity: 1, x: 0, duration: 0.4 }, 45);
    tl.to(".fw4", { opacity: 1, x: 0, duration: 0.4 }, 47);

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
