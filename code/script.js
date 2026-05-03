document.addEventListener("DOMContentLoaded", () => {
    const scriptsData = [
        { level: "P1", en: "Numbers to 100 (Add & Sub)", cn: "100以内加减法", link: "./addition-subtraction-animation/index.html", done: true },
        { level: "P1", en: "Length & Time", cn: "长度与时间", link: "./length-time-animation/index.html", done: true },
        { level: "P2", en: "Multiplication & Division", cn: "乘法与除法", link: "./multiplication-division-animation/index.html", done: true },
        { level: "P2", en: "Money & Volume", cn: "金钱与体积", link: "./money-volume-animation/index.html", done: true },
        { level: "P2", en: "Introduction to Fractions", cn: "分数初步认识", link: "./fractions-intro-animation/index.html", done: true },
        { level: "P3", en: "Equivalent Fractions", cn: "等值分数", link: "./equivalent-fractions-animation/index.html", done: true },
        { level: "P3", en: "Area & Perimeter", cn: "面积与周长", link: "./area-perimeter-animation/index.html", done: true },
        { level: "P3", en: "Angles & Lines", cn: "角与垂直/平行线", link: "./angles-lines-animation/index.html", done: true },
        { level: "P4", en: "Mixed Numbers & Improper Fractions", cn: "带分数与假分数", link: "./fractions-animation/index.html", done: true },
        { level: "P4", en: "Decimals", cn: "小数", link: "./decimals-animation/index.html", done: true },
        { level: "P4", en: "Symmetry", cn: "对称图形", link: "./symmetry-animation/index.html", done: true },
        { level: "P4", en: "Whole Numbers & Rounding", cn: "大数与四舍五入", link: "./rounding-animation/index.html", done: true },
        { level: "P4", en: "Time Duration & 24h Clock", cn: "时间计算与24小时制", link: "./time-duration-animation/index.html", done: true },
        { level: "P5", en: "Ratio", cn: "比例", link: "./ratio-animation/index.html", done: true },
        { level: "P5", en: "Percentage", cn: "百分比", link: "./percentage-animation/index.html", done: true },
        { level: "P5", en: "Rate", cn: "速率", link: "./rate-animation/index.html", done: true },
        { level: "P5", en: "Volume of Cubes & Cuboids", cn: "正方体与长方体体积", link: "./volume-animation/index.html", done: true },
        { level: "P5", en: "The Remainder Concept", cn: "剩余概念（分支法）", link: "./remainder-animation/index.html", done: true },
        { level: "P5", en: "Geometric Folding", cn: "图形折叠与角度", link: "./geometric-folding-animation/index.html", done: true },
        { level: "P5", en: "Step-charging Rates", cn: "阶梯计费问题", link: "./tiered-rates-animation/index.html", done: true },
        { level: "P6", en: "Algebra", cn: "代数初步", link: "./algebra-animation/index.html", done: true },
        { level: "P6", en: "Speed", cn: "速度时间路程", link: "./speed-animation/index.html", done: true },
        { level: "P6", en: "Circles", cn: "圆的面积与周长", link: "./circles-animation/index.html", done: true },
        { level: "P6", en: "Complex Word Problems", cn: "复杂应用题", link: "./word-problems-animation/index.html", done: true },
        { level: "P6", en: "Number & Visual Patterns", cn: "图形与数字规律", link: "./patterns-animation/index.html", done: true },
        { level: "P6", en: "Simultaneous Equations", cn: "等量代换（方程启蒙）", link: "./simultaneous-equations-animation/index.html", done: true }
    ];

    const container = document.getElementById("cardGrid");
    let currentLang = 'both';

    const gradeOrder = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
    const gradeNames = {
        cn: { P1: '一年级', P2: '二年级', P3: '三年级', P4: '四年级', P5: '五年级', P6: '六年级' },
        en: { P1: 'Primary 1', P2: 'Primary 2', P3: 'Primary 3', P4: 'Primary 4', P5: 'Primary 5', P6: 'Primary 6' }
    };

    // Track collapsed state per grade
    const collapsedState = {};

    function renderCards() {
        container.innerHTML = '';

        // Group data by level
        const grouped = {};
        scriptsData.forEach(item => {
            if (!grouped[item.level]) grouped[item.level] = [];
            grouped[item.level].push(item);
        });

        gradeOrder.forEach(grade => {
            const items = grouped[grade];
            if (!items || items.length === 0) return;

            const isCollapsed = collapsedState[grade] || false;

            // Grade group wrapper
            const groupEl = document.createElement('div');
            groupEl.className = `grade-group${isCollapsed ? ' collapsed' : ''}`;

            // Header
            let headerLabel = grade;
            if (currentLang === 'cn') {
                headerLabel = `${grade} — ${gradeNames.cn[grade]}`;
            } else if (currentLang === 'en') {
                headerLabel = `${grade} — ${gradeNames.en[grade]}`;
            } else {
                headerLabel = `${grade} — ${gradeNames.cn[grade]} / ${gradeNames.en[grade]}`;
            }

            const headerEl = document.createElement('div');
            headerEl.className = `grade-header ${grade.toLowerCase()}`;
            headerEl.innerHTML = `
                <div class="grade-title">
                    <span>${headerLabel}</span>
                    <span class="grade-count">(${items.length})</span>
                </div>
                <span class="collapse-icon">▼</span>
            `;

            headerEl.addEventListener('click', () => {
                collapsedState[grade] = !collapsedState[grade];
                groupEl.classList.toggle('collapsed');
            });

            // Cards grid
            const cardsEl = document.createElement('div');
            cardsEl.className = 'grade-cards';

            items.forEach(item => {
                const card = document.createElement('a');
                card.className = `card ${item.level.toLowerCase()}`;
                card.href = item.link;

                let titleHTML = '';
                if (currentLang === 'en') {
                    titleHTML = `<div class="card-title-en">${item.en}</div>`;
                } else if (currentLang === 'cn') {
                    titleHTML = `<div class="card-title-cn">${item.cn}</div>`;
                } else {
                    titleHTML = `<div class="card-title-en">${item.en}</div><div class="card-title-cn">${item.cn}</div>`;
                }

                card.innerHTML = titleHTML;
                cardsEl.appendChild(card);
            });

            groupEl.appendChild(headerEl);
            groupEl.appendChild(cardsEl);
            container.appendChild(groupEl);
        });
    }

    renderCards();

    // Language Toggle
    const titleEl = document.getElementById('pageTitle');
    const descEl = document.getElementById('pageDesc');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;

            if (currentLang === 'en') {
                titleEl.innerText = 'CPA Math Micro-Animations';
                descEl.innerText = '26 Key Singapore MOE Mathematical Concepts';
            } else if (currentLang === 'cn') {
                titleEl.innerText = 'CPA 数学微动画';
                descEl.innerText = '26 个新加坡 MOE 核心数学概念';
            } else {
                titleEl.innerText = 'CPA Math Micro-Animations';
                descEl.innerText = '26 个新加坡 MOE 核心数学概念 / Key Mathematical Concepts';
            }

            renderCards();
        });
    });
});
