document.addEventListener("DOMContentLoaded", () => {
    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子分不清"速率"和"速度"。速率是一个更广的概念——每单位时间内做了多少事情。',
            en: 'Children confuse "rate" with "speed". Rate is broader — how much of something happens per unit of time.'
        },
        scene2: {
            cn: '水龙头每分钟流出2升水，玩具机器每分钟生产5个——这都是"速率"。',
            en: 'The tap flows 2 litres per minute; the machine makes 5 toys per minute — both are "rates".'
        },
        scene3: {
            cn: '速率×时间=总量。和"速度×时间=路程"的公式结构完全一样！',
            en: 'Rate × Time = Total Amount. Same structure as Speed × Time = Distance!'
        },
        scene4: {
            cn: '三个公式是一家人。知道任意两个，就能求第三个。',
            en: 'Three formulas, one family. Know any two, find the third.'
        },
        scene5: {
            cn: '记住：速率就是"每单位时间做了多少"！',
            en: 'Remember: Rate = how much per unit of time!'
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
    
    // Tap filling bucket
    const tapLabel = document.getElementById("tapLabel");
    tl.from("#tapBox", { y: 20, opacity: 0, duration: 0.5 }, 6);
    
    // Water drop animation simulating filling
    tl.to("#waterDrop", { y: 100, opacity: 1, duration: 0.5, repeat: 5, yoyo: false, ease: "none" }, 6.5);
    
    tl.to({val: 0}, {
        val: 3, // 3 minutes
        duration: 3,
        ease: "none",
        onUpdate: function() {
            const time = this.targets()[0].val;
            const amount = time * 2;
            tapLabel.innerHTML = `Time: ${time.toFixed(1)} min<br>Amount: ${amount.toFixed(1)}&ell;`;
            gsap.set("#bucketWater", { height: `${(amount / 6) * 100}%` });
        }
    }, 6.5);

    // Machine producing toys
    tl.to("#machineBox", { y: 0, opacity: 1, duration: 0.5 }, 10);
    const machineLabel = document.getElementById("machineLabel");
    
    tl.to({val: 1}, {
        val: 3, // starts at 1, goes to 3 mins
        duration: 2,
        ease: "none",
        onUpdate: function() {
            const time = this.targets()[0].val;
            const amount = Math.floor(time * 5);
            machineLabel.innerHTML = `Time: ${time.toFixed(1)} min<br>Amount: ${amount} toys`;
        }
    }, 11);

    tl.to(".toy", { x: 50, opacity: 1, stagger: 0.5, duration: 0.5 }, 11);

    tl.to("#scene2-text", { opacity: 1, duration: 0.5 }, 14);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Show 3 min bar
    tl.from("#bar3min .b-block", { scale: 0, opacity: 0, stagger: 0.2, duration: 0.5, ease: "back.out" }, 21);
    tl.from("#bar3min .b-bracket", { opacity: 0, y: -10, duration: 0.5 }, 22);

    // How long to fill 10L?
    tl.to("#q10l", { opacity: 1, duration: 0.5 }, 25);
    
    tl.to("#bar10l", { opacity: 1, duration: 0.5 }, 26);
    tl.from("#bar10l .b-block", { scale: 0, opacity: 0, stagger: 0.1, duration: 0.2, ease: "back.out" }, 26.5);
    tl.from("#bar10l .b-bracket", { opacity: 0, y: -10, duration: 0.5 }, 27.5);

    tl.to("#calcBox", { opacity: 1, y: -10, duration: 0.5 }, 30);

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
