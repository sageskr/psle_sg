document.addEventListener("DOMContentLoaded", () => {
    // Generate cubes for the layers (4 across x 3 deep = 12 cubes)
    function createCubes(layerId) {
        const layer = document.getElementById(layerId);
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const cube = document.createElement("div");
                cube.className = "unit-cube";
                cube.style.left = (col * 40) + "px";
                cube.style.top = (row * 40) + "px";
                
                cube.innerHTML = `
                    <div class="cube-face top"></div>
                    <div class="cube-face front"></div>
                    <div class="cube-face right"></div>
                `;
                layer.appendChild(cube);
            }
        }
    }
    
    createCubes("layer1");
    createCubes("layer2");

    // ============================================================
    // Bilingual subtitle data
    // ============================================================
    const subtitles = {
        scene1: {
            cn: '孩子会背"长×宽×高"但不理解为什么要乘三次。我们用搭积木来说明。',
            en: 'Children memorize "L×W×H" but don\'t understand why 3 multiplications. We\'ll build with blocks to show why.'
        },
        scene2: {
            cn: '底层铺了4×3=12个小方块，叠2层=24个。每个小方块是1立方厘米，所以体积=24 cm³。',
            en: 'Bottom layer: 4×3 = 12 cubes. Stack 2 layers = 24 cubes. Each cube is 1cm³, so volume = 24cm³.'
        },
        scene3: {
            cn: '体积 = 底面积 × 高。底面积就是底层铺了多少块，高就是叠了几层。正方体三边相等：V = 边长³。',
            en: 'Volume = Base area × Height. Base area = how many cubes in one layer; height = how many layers. Cube: V = side³.'
        },
        scene4: {
            cn: '长方体体积=长×宽×高，正方体体积=边长的三次方。',
            en: 'Cuboid volume = L×W×H. Cube volume = side³.'
        },
        scene5: {
            cn: '记住：体积就是"能装多少个小方块"！',
            en: 'Remember: Volume = how many unit cubes fit inside!'
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
    
    // Bottom layer appears
    tl.to("#layer1 .unit-cube", { opacity: 1, y: -10, duration: 0.2, stagger: 0.05 }, 6);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "Area of base = 12 cm&sup2;", 9);
    
    // Top layer appears
    tl.to("#layer2 .unit-cube", { opacity: 1, y: -10, duration: 0.2, stagger: 0.05 }, 12);
    tl.add(() => document.getElementById("scene2-text").innerHTML = "Volume = 24 cm&sup3;", 15);

    tl.to("#scene2", { autoAlpha: 0, duration: 0.5 }, 19.5);

    // SCENE 3: Pictorial (20-40s)
    setSubtitle('scene3', 20);
    tl.to("#scene3", { autoAlpha: 1, duration: 0.5 }, 20);
    tl.to("#pictorialBox", { display: "block", opacity: 1, duration: 0.5 }, 20.5);
    tl.to(".prism", { opacity: 1, duration: 0.5 }, 21);

    // Label dimensions
    tl.to("#labelL", { opacity: 1, duration: 0.5 }, 22);
    tl.to("#labelW", { opacity: 1, duration: 0.5 }, 23);
    tl.to("#labelH", { opacity: 1, duration: 0.5 }, 24);
    
    // Base area highlight
    tl.to("#prismBase", { backgroundColor: "rgba(52, 152, 219, 0.7)", duration: 0.5 }, 27);
    tl.add(() => document.getElementById("scene3-text").innerHTML = "Base area = L &times; W = 4 &times; 3 = 12", 27.5);
    
    // Volume calculation
    tl.add(() => document.getElementById("scene3-text").innerHTML = "Volume = Base area &times; Height = 12 &times; 2 = 24 cm&sup3;", 32);

    tl.to("#scene3", { autoAlpha: 0, duration: 0.5 }, 39.5);

    // SCENE 4: Abstract (40-55s)
    setSubtitle('scene4', 40);
    tl.to("#scene4", { autoAlpha: 1, duration: 0.5 }, 40);

    tl.to("#eq1", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 42);
    tl.to("#eq2", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 44);
    tl.to("#eq3", { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 46);

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
