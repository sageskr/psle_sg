document.addEventListener("DOMContentLoaded", () => {
    const subtitles = {
        scene1: {
            cn: '计算时间跨度是很多孩子的噩梦，尤其是跨过中午12点或凌晨。我们将用"时间轴"和"小青蛙跳跃"来解决这个问题。',
            en: 'Calculating time duration is a nightmare for many, especially across noon or midnight. We\'ll use a "timeline" and "frog jumps".'
        },
        scene2: {
            cn: '第一步（具象）：不要直接减！先让小青蛙跳到最近的"整点"。从 09:45 跳到 10:00 走了15分钟，再跳到 11:00 走了1小时...',
            en: 'Step 1 (Concrete): Don\'t subtract directly! Jump to the nearest "whole hour". 09:45 to 10:00 is 15 mins, then to 11:00 is 1 hour...'
        },
        scene3: {
            cn: '第二步（形象）：24小时制让计算更统一。遇到跨天计算，还是用跳跃法：跳到午夜 00:00，再跳到终点。把所有的跳跃时间加起来即可。',
            en: 'Step 2 (Pictorial): The 24h clock brings consistency. For overnight, jump to midnight 00:00, then to the end. Sum up all the jumps.'
        },
        scene4: {
            cn: '第三步（抽象）：抽象的减法公式其实就是这些跳跃段落的加总。分步计算能有效避免借位出错。',
            en: 'Step 3 (Abstract): The formula is just the sum of these jump segments. Breaking it down avoids regrouping errors in time.'
        },
        scene5: {
            cn: '记住：跳到整点再计算，时间跨度不犯错！',
            en: 'Remember: Jump to the hour first, and you\'ll never miss a minute!'
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

    // SCENE 1: Intro (0-5s)
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2: Concrete (5-20s)
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Jump 1: 09:45 -> 10:00 (left 25% -> 30%)
    // The frog starts at left 25%, container is 800px. So x=200px. 30% = 240px. 60% = 480px. 67.5% = 540px.
    tl.to("#frog1", { left: "30%", duration: 1, ease: "power1.out", y: -40, yoyo: true, repeat: 1 }, 7);
    tl.to("#jump1", { opacity: 1, duration: 0.5 }, 7.5);
    tl.to("#labelJ1", { opacity: 1, duration: 0.5 }, 8);

    // Jump 2: 10:00 -> 11:00 (30% -> 60%)
    tl.to("#frog1", { left: "60%", duration: 1.5, ease: "power1.out", y: -60, yoyo: true, repeat: 1 }, 10);
    tl.to("#jump2", { opacity: 1, duration: 0.5 }, 11);
    tl.to("#labelJ2", { opacity: 1, duration: 0.5 }, 11.5);

    // Jump 3: 11:00 -> 11:15 (60% -> 67.5%)
    tl.to("#frog1", { left: "67.5%", duration: 1, ease: "power1.out", y: -30, yoyo: true, repeat: 1 }, 14);
    tl.to("#jump3", { opacity: 1, duration: 0.5 }, 14.5);
    tl.to("#labelJ3", { opacity: 1, duration: 0.5 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Show clock conversion
    tl.to(".clock-compare", { opacity: 1, duration: 0.5, y: 10 }, 21);
    tl.to(".24h-face", { scale: 1.1, color: "#e74c3c", duration: 0.5, yoyo: true, repeat: 1 }, 23);

    // Show timeline 24
    tl.to("#timeline24", { opacity: 1, duration: 0.5 }, 25);
    
    // Jump 2_1: 22:30 -> 23:00 (20% -> 30%)
    tl.to("#frog2", { left: "30%", duration: 1, y: -40, yoyo: true, repeat: 1 }, 27);
    tl.to(["#jump2_1", "#labelJ2_1"], { opacity: 1, duration: 0.5 }, 28);

    // Jump 2_2: 23:00 -> 00:00 (30% -> 50%)
    tl.to("#frog2", { left: "50%", duration: 1.2, y: -50, yoyo: true, repeat: 1 }, 30);
    tl.to(["#jump2_2", "#labelJ2_2"], { opacity: 1, duration: 0.5 }, 31);

    // Jump 2_3: 00:00 -> 01:00 (50% -> 70%)
    tl.to("#frog2", { left: "70%", duration: 1.2, y: -50, yoyo: true, repeat: 1 }, 33);
    tl.to(["#jump2_3", "#labelJ2_3"], { opacity: 1, duration: 0.5 }, 34);

    // Jump 2_4: 01:00 -> 01:15 (70% -> 75%)
    tl.to("#frog2", { left: "75%", duration: 1, y: -30, yoyo: true, repeat: 1 }, 36);
    tl.to(["#jump2_4", "#labelJ2_4"], { opacity: 1, duration: 0.5 }, 37);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".eq-part", { opacity: 1, x: 20, duration: 0.5, stagger: 1.5 }, 42);

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
        toastTimer = setTimeout(() => { toastEl.classList.remove("show"); }, 1800);
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
