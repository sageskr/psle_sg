// Make sure elements are visible after KaTeX rendering
document.addEventListener("DOMContentLoaded", () => {
    // GSAP Master Timeline
    const tl = gsap.timeline({ paused: true });

    // Ensure all scenes are visible for GSAP to animate opacity (but set opacity 0 initially)
    gsap.set(".scene", { autoAlpha: 0 });
    gsap.set("#scene1", { autoAlpha: 1 }); // Scene 1 starts visible

    const subtitleEl = document.getElementById("subtitle-text");

    // Helper to update subtitle text at a specific time
    function setSubtitle(text, time) {
        tl.add(() => { 
            subtitleEl.innerHTML = text; 
            renderMathInElement(subtitleEl, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }, time);
    }

    // SCENE 1: Introduction (0s -> 5s)
    setSubtitle("很多孩子不会做带分数转换，因为不理解“进位”。我们将使用 CPA 教学法拆解。", 0);
    
    // Fade out Scene 1 at 4.5s
    tl.to("#scene1", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 2: Concrete (5s -> 20s)
    setSubtitle("第一步：使用具象实物（比萨），孩子能看到有1个整的和半个。此时写作 $1\\frac{1}{2}$。", 5);
    tl.to("#scene2", { autoAlpha: 1, duration: 0.5 }, 5);
    
    // Animate pizzas in
    gsap.set(".pizza", { y: -50, opacity: 0 });
    tl.to(".pizza", { y: 0, opacity: 1, duration: 1, stagger: 0.5, ease: "bounce.out" }, 6);
    
    // Animate text and math
    gsap.set(".scene-text, .scene-math", { opacity: 0, scale: 0.8 });
    tl.to(".scene-text, .scene-math", { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, 8);

    // Fade out Scene 2
    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20s -> 40s)
    setSubtitle("第二步：关键的形象化。将比萨转为模型块。将“1个整块”按照分母也切成“2个半块”。现在，我们一共有3个“半块”。", 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);

    // Initial state for bars
    gsap.set(".bars-container", { opacity: 0 });
    gsap.set("#scene3-text", { opacity: 0 });
    
    // Show bars (representing the pizzas)
    tl.to(".bars-container", { opacity: 1, duration: 1 }, 21);

    // Cut the whole bar into two halves
    tl.add(() => {
        const wholeBarGroup = document.getElementById("whole-bar-group");
        // Replace single whole bar with two half bars
        wholeBarGroup.innerHTML = '<div class="bar split-half"></div><div class="bar split-half"></div>';
        gsap.fromTo(".split-half", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.2 });
    }, 25);

    // Show text: 1 Whole = 2 halves. Total halves = 3.
    tl.to("#scene3-text", { opacity: 1, duration: 1 }, 28);

    // Fade out Scene 3
    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40s -> 55s)
    setSubtitle("第三步：抽象化。当孩子看到图上有3个1/2后，我们再引入算式。1 变成分母为 2 的分数是 2/2，2/2 加 1/2 等于 3/2。不需要死记硬背乘分母加分子。", 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    // Sequence equations - each part appears one by one
    tl.to("#calc-step1", { opacity: 1, duration: 0.5 }, 41);
    tl.to("#calc-step2", { opacity: 1, duration: 0.5 }, 43);
    tl.to("#calc-step3", { opacity: 1, duration: 0.5 }, 46);
    tl.to("#calc-step4", { opacity: 1, duration: 0.5 }, 49);
    
    // Show final equation big - hide chain, show summary
    gsap.set(".final-math", { opacity: 0, scale: 0 });
    tl.to(".equation-chain", { opacity: 0, duration: 0.5 }, 52);
    tl.to(".final-math", { opacity: 1, scale: 1, autoAlpha: 1, duration: 1, ease: "back.out(1.7)" }, 52.5);

    // Fade out Scene 4
    tl.to("#scene4", { autoAlpha: 0, duration: 0.5 }, 54.5);

    // SCENE 5: Summary (55s -> 60s)
    setSubtitle("看懂模型图，数学变简单。", 55);
    tl.to("#scene5", { autoAlpha: 1, duration: 0.5 }, 55);

    gsap.set(".logo-placeholder, .slogan", { y: 20, opacity: 0 });
    tl.to(".logo-placeholder, .slogan", { y: 0, opacity: 1, duration: 1, stagger: 0.3 }, 55.5);

    // ---- Scene definitions for progress tracking ----
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

    // ---- Toast helper ----
    let toastTimer = null;
    function showToast(msg) {
        clearTimeout(toastTimer);
        toastEl.textContent = msg;
        toastEl.classList.add("show");
        toastTimer = setTimeout(() => {
            toastEl.classList.remove("show");
        }, 1800);
    }

    // ---- Progress update (called every frame via GSAP ticker) ----
    function updateProgress() {
        const currentTime = tl.time();
        const progress = Math.min(currentTime / TOTAL_DURATION * 100, 100);
        progressFill.style.width = progress + "%";

        // Find current scene
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

    // ---- Controls ----
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const restartBtn = document.getElementById("restartBtn");

    playBtn.addEventListener("click", () => {
        tl.play();
        showToast("▶ 播放中...");
    });
    pauseBtn.addEventListener("click", () => {
        tl.pause();
        showToast("⏸ 已暂停 — 可以向孩子讲解");
    });
    restartBtn.addEventListener("click", () => {
        tl.restart();
        showToast("↻ 重新开始");
    });
});
