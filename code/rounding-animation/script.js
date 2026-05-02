document.addEventListener("DOMContentLoaded", () => {
    // Bilingual subtitle data
    const subtitles = {
        scene1: {
            cn: '很多孩子分不清"十位"和"百位"，对四舍五入只是死记硬背。我们将通过"数位圆片"和"山坡图"来揭示其中的逻辑。',
            en: 'Many children confuse place values and memorize rounding rules blindly. Let\'s use "number discs" and "mountain diagrams" to reveal the logic.'
        },
        scene2: {
            cn: '第一步（具象）：当百位凑满10个时，它们就会"合体"变成1个千位圆片。这就是数位进阶的本质。',
            en: 'Step 1 (Concrete): When the Hundreds column reaches 10, they merge into 1 Thousand disc. This is place value progression.'
        },
        scene3: {
            cn: '第二步（形象）：四舍五入就是找"谁离我更近"。4,300 滑回 4,000；4,700 过山顶滑向 5,000。4,500 在山顶则往前入。',
            en: 'Step 2 (Pictorial): Rounding is finding "who is closer". 4,300 rolls back to 4,000. 4,700 passes the peak to 5,000. 4,500 at the peak rolls forward.'
        },
        scene4: {
            cn: '第三步（抽象）：我们要看目标数位的右边一位。如果是 0-4 就"舍"，5-9 就"入"。这是山坡逻辑的文字总结。',
            en: 'Step 3 (Abstract): Check the digit to the right of your target place. 0-4 means "round down", 5-9 means "round up".'
        },
        scene5: {
            cn: '记住：四舍五入就是找最近的那个"整数里程碑"！',
            en: 'Remember: Rounding is simply finding the nearest "whole number milestone"!'
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

    const tl = gsap.timeline({ paused: true });

    gsap.set(".scene", { autoAlpha: 0 });
    gsap.set("#scene1", { autoAlpha: 1 });

    function setSubtitle(sceneKey, time) {
        tl.add(() => renderSubtitle(sceneKey), time);
    }

    // Initialize positions for new discs
    const newDiscs = document.querySelectorAll(".new-disc");
    newDiscs.forEach((disc, i) => {
        gsap.set(disc, { x: (i % 3) * 45, y: Math.floor(i / 3) * 45 });
    });

    // SCENE 1: Intro (0-5s)
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2: Concrete (5-20s)
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Add 7 discs
    tl.to("#newHundDiscs", { opacity: 1, duration: 0.5 }, 6);
    tl.to(".new-disc", { 
        x: -250, 
        y: (i) => 110 + Math.floor(i/2)*30,
        duration: 1, 
        stagger: 0.1 
    }, 7);

    // Merge 10 hundreds into 1 thousand
    tl.to(["#bodyHund .disc-100", ".new-disc"], {
        x: -250, y: 100, scale: 0, opacity: 0, duration: 1, stagger: 0.05
    }, 10);
    
    gsap.set("#merged1k", { left: 350, top: 150 });
    tl.to("#merged1k", { opacity: 1, scale: 1.2, duration: 0.5 }, 11.5);
    tl.to("#merged1k", { scale: 1, x: -160, y: 20, duration: 1 }, 13); // jump to thousands column

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // 4300 ball
    tl.to("#ball4300", { opacity: 1, y: -20, duration: 0.5 }, 22);
    // Roll back to 4000
    // bezier curve approx for path M 50 180 Q 300 -50 550 180
    // At x=160 (ball4300), y is roughly 70. 4000 is at x=25, y=165.
    tl.to("#ball4300", { x: -135, y: 95, rotation: -360, duration: 1.5, ease: "power2.in" }, 24);

    // 4700 ball
    tl.to("#ball4700", { opacity: 1, y: -20, duration: 0.5 }, 27);
    // Roll down to 5000 (x=520, y=165 from x=390, y=70) -> dx=130, dy=95
    tl.to("#ball4700", { x: 130, y: 95, rotation: 360, duration: 1.5, ease: "power2.in" }, 29);

    // 4500 ball (at peak x=275, y=-10)
    tl.to("#ball4500", { opacity: 1, duration: 0.5 }, 32);
    // Push over and roll to 5000 (x=520, y=165) -> dx=245, dy=175
    tl.to("#ball4500", { x: 245, y: 175, rotation: 720, duration: 2, ease: "power2.inOut" }, 34);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".eq-row", { opacity: 1, x: 20, duration: 0.5, stagger: 1 }, 42);
    tl.to(".focus-number", { opacity: 1, y: -10, duration: 0.5, stagger: 2 }, 45);
    tl.to("#arrow1", { opacity: 1, y: 10, duration: 0.5, ease: "back.out(1.7)" }, 46);
    tl.to("#arrow2", { opacity: 1, y: 10, duration: 0.5, ease: "back.out(1.7)" }, 48);

    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // SCENE 5: Summary (55-60s)
    setSubtitle('scene5', 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);
    
    tl.to(".summary-icon", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 55.5);
    tl.to(".logo-text", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.2);
    tl.to(".slogan-en", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.8);

    // Progress tracking + Controls
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
