document.addEventListener("DOMContentLoaded", () => {
    const subtitles = {
        scene1: {
            cn: '很多同学在应用题中，会把"剩下部分的 1/4"错当成"整体的 1/4"。这一个字之差，就是对题目基数的理解错误。',
            en: 'Many students mistake "1/4 of the remainder" for "1/4 of the total". This slight wording difference changes the base of the calculation.'
        },
        scene2: {
            cn: '第一步（具象）：我们要把剩下的部分当成一个新的"整体"。先切掉 1/3，然后放大剩下的部分，再把它平均分成4份。',
            en: 'Step 1 (Concrete): Treat the remaining part as a new "whole". Cut away 1/3, zoom into the remainder, and divide IT into 4 equal parts.'
        },
        scene3: {
            cn: '第二步（形象）：使用"分支法"建模。第一层分出消耗和剩余；在剩余分支下再开一层。清晰看到，子层的 1 份不等于父层的 1 份。',
            en: 'Step 2 (Pictorial): Use the "Branching Method". Split total into used/remainder, then branch off the remainder. Sub-units are different from total units.'
        },
        scene4: {
            cn: '第三步（抽象）："的 (of)" 在数学里通常意味着乘法。剩下部分的 1/4，就是用剩余比例乘以子比例。',
            en: 'Step 3 (Abstract): "Of" usually means multiplication in math. 1/4 OF the remainder means multiplying the remaining fraction by the sub-fraction.'
        },
        scene5: {
            cn: '记住：做题先看基数，是"整体"还是"剩下"？',
            en: 'Remember: Always check the base — is it the "total" or the "remainder"?'
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
        renderMathInElement(subtitleEl, { delimiters: [ { left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false } ] });
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

    function setSubtitle(sceneKey, time) { tl.add(() => renderSubtitle(sceneKey), time); }

    // SCENE 1: Intro (0-5s)
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2: Concrete (5-20s)
    setSubtitle('scene2', 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Cut off 1/3
    tl.to("#usedCake", { x: -30, y: 20, background: "#95a5a6", color: "#ecf0f1", duration: 1.5, ease: "power2.inOut" }, 7);
    tl.to("#usedCake", { opacity: 0.3, duration: 0.5 }, 8.5);

    // Zoom into remainder
    tl.to("#cakeGroup", { scale: 1.4, x: -50, duration: 1.5, ease: "power2.out" }, 10);
    
    // Cut remainder into 4
    tl.to(".rem-subslice", { opacity: 1, duration: 1, stagger: 0.2 }, 12);
    // Take one slice
    tl.to(".rem-subslice:first-child", { background: "#f39c12", duration: 0.5 }, 14);
    tl.to(".rem-subslice:first-child", { y: -20, duration: 1 }, 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Total node
    tl.to("#nodeTotal", { opacity: 1, y: 0, duration: 0.5 }, 21);
    
    // Branch to Used and Remainder
    tl.to("#line1", { strokeDashoffset: 0, duration: 0.5 }, 23);
    tl.to("#nodeUsed", { opacity: 1, duration: 0.5 }, 23.5);
    
    tl.to("#line2", { strokeDashoffset: 0, duration: 0.5 }, 24);
    tl.to("#nodeRem", { opacity: 1, duration: 0.5 }, 24.5);

    // Branch from remainder
    tl.to("#line3", { strokeDashoffset: 0, duration: 0.5 }, 27);
    tl.to("#subBar", { opacity: 1, y: 0, duration: 0.5 }, 27.5);
    
    // Highlight Sub Unit
    tl.to("#subUnitTaken", { scale: 1.1, duration: 0.5, yoyo: true, repeat: 3 }, 30);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to(".eq-part", { opacity: 1, y: -10, duration: 0.8, stagger: 2.5 }, 42);

    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // SCENE 5: Summary (55-60s)
    setSubtitle('scene5', 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);
    
    tl.to(".summary-icon", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 55.5);
    tl.to(".logo-text", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.2);
    tl.to(".slogan-en", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 56.8);

    // Controls
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
