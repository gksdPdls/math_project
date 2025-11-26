// ========================================================
// 1. GENERATE RANDOM TARGET COLOR
// ========================================================
let target = generateRandomColor();

function generateRandomColor() {
    let rgb = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };

    document.getElementById("targetColor").style.backgroundColor =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    return rgb;
}

// ========================================================
// 2. PLAYER COLOR (RGB + HSV SLIDERS)
// ========================================================
const rSlider = document.getElementById("rSlider");
const gSlider = document.getElementById("gSlider");
const bSlider = document.getElementById("bSlider");

const hSlider = document.getElementById("hSlider");
const sSlider = document.getElementById("sSlider");
const vSlider = document.getElementById("vSlider");

// Update player color when RGB sliders move
function updatePlayerFromRGB() {
    let r = parseInt(rSlider.value);
    let g = parseInt(gSlider.value);
    let b = parseInt(bSlider.value);

    document.getElementById("playerColor").style.backgroundColor =
        `rgb(${r}, ${g}, ${b})`;

    // Convert RGB → HSV (for slider sync)
    let hsv = rgbToHsv(r, g, b);
    hSlider.value = hsv.h;
    sSlider.value = hsv.s;
    vSlider.value = hsv.v;
}

// Update player color when HSV sliders move
function updatePlayerFromHSV() {
    let h = parseInt(hSlider.value);
    let s = parseInt(sSlider.value);
    let v = parseInt(vSlider.value);

    let rgb = hsvToRgb(h, s, v);

    // Sync RGB sliders
    rSlider.value = rgb.r;
    gSlider.value = rgb.g;
    bSlider.value = rgb.b;

    document.getElementById("playerColor").style.backgroundColor =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Attach input events
rSlider.oninput = updatePlayerFromRGB;
gSlider.oninput = updatePlayerFromRGB;
bSlider.oninput = updatePlayerFromRGB;

hSlider.oninput = updatePlayerFromHSV;
sSlider.oninput = updatePlayerFromHSV;
vSlider.oninput = updatePlayerFromHSV;

// ========================================================
// 3. RGB → HSV
// ========================================================
function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) h = 0;
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

// ========================================================
// 4. HSV → RGB
// ========================================================
function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;

    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;

    let rp, gp, bp;

    if (0 <= h && h < 60) [rp, gp, bp] = [c, x, 0];
    else if (60 <= h && h < 120) [rp, gp, bp] = [x, c, 0];
    else if (120 <= h && h < 180) [rp, gp, bp] = [0, c, x];
    else if (180 <= h && h < 240) [rp, gp, bp] = [0, x, c];
    else if (240 <= h && h < 300) [rp, gp, bp] = [x, 0, c];
    else [rp, gp, bp] = [c, 0, x];

    return {
        r: Math.round((rp + m) * 255),
        g: Math.round((gp + m) * 255),
        b: Math.round((bp + m) * 255)
    };
}

// ========================================================
// 5. COLOR MATCHING (BUTTON)
// ========================================================
document.getElementById("checkBtn").onclick = () => {
    let r = parseInt(rSlider.value);
    let g = parseInt(gSlider.value);
    let b = parseInt(bSlider.value);

    // Euclidean distance
    let distance = Math.sqrt(
        (r - target.r) ** 2 +
        (g - target.g) ** 2 +
        (b - target.b) ** 2
    );

    // Max possible distance between two RGB colors
    let maxDistance = Math.sqrt((255 ** 2) * 3);

    // Similarity from 0% → 100%
    let similarity = (1 - (distance / maxDistance)) * 100;

    if (similarity >= 80) {
        document.getElementById("statusText").innerHTML = "🎉 MATCHED! (" + similarity.toFixed(1) + "%)";
        document.getElementById("nextBtn").disabled = false;
    } else {
        document.getElementById("statusText").innerHTML =
            "❌ Not yet! (" + similarity.toFixed(1) + "% close)";
    }
};


// ========================================================
// 6. NEXT COLOR BUTTON
// ========================================================
document.getElementById("nextBtn").onclick = () => {
    target = generateRandomColor();
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("statusText").innerText = "New color! Match it!";
};
