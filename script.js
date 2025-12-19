// random target color the user has to match
let target = generateRandomColor();

function generateRandomColor() {
    // RGB values between 0–255
    let rgb = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };

    // show target color on screen
    document.getElementById("targetColor").style.backgroundColor =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    return rgb;
}

// sliders for RGB
const rSlider = document.getElementById("rSlider");
const gSlider = document.getElementById("gSlider");
const bSlider = document.getElementById("bSlider");

// sliders for HSV
const hSlider = document.getElementById("hSlider");
const sSlider = document.getElementById("sSlider");
const vSlider = document.getElementById("vSlider");

// update color when RGB sliders change
function updatePlayerFromRGB() {
    let r = parseInt(rSlider.value);
    let g = parseInt(gSlider.value);
    let b = parseInt(bSlider.value);

    document.getElementById("playerColor").style.backgroundColor =
        `rgb(${r}, ${g}, ${b})`;

    // convert to HSV so both slider sets stay in sync
    let hsv = rgbToHsv(r, g, b);
    hSlider.value = hsv.h;
    sSlider.value = hsv.s;
    vSlider.value = hsv.v;
}

// update color when HSV sliders change
function updatePlayerFromHSV() {
    let h = parseInt(hSlider.value);
    let s = parseInt(sSlider.value);
    let v = parseInt(vSlider.value);

    let rgb = hsvToRgb(h, s, v);

    // update RGB sliders based on HSV input
    rSlider.value = rgb.r;
    gSlider.value = rgb.g;
    bSlider.value = rgb.b;

    document.getElementById("playerColor").style.backgroundColor =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// listen for slider movement
rSlider.oninput = updatePlayerFromRGB;
gSlider.oninput = updatePlayerFromRGB;
bSlider.oninput = updatePlayerFromRGB;

hSlider.oninput = updatePlayerFromHSV;
sSlider.oninput = updatePlayerFromHSV;
vSlider.oninput = updatePlayerFromHSV;

// converts RGB values to HSV (different way of representing the same color)
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;

        h *= 60;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

// converts HSV back to RGB so it can be displayed
function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;

    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;

    let rp, gp, bp;

    if (h < 60) [rp, gp, bp] = [c, x, 0];
    else if (h < 120) [rp, gp, bp] = [x, c, 0];
    else if (h < 180) [rp, gp, bp] = [0, c, x];
    else if (h < 240) [rp, gp, bp] = [0, x, c];
    else if (h < 300) [rp, gp, bp] = [x, 0, c];
    else [rp, gp, bp] = [c, 0, x];

    return {
        r: Math.round((rp + m) * 255),
        g: Math.round((gp + m) * 255),
        b: Math.round((bp + m) * 255)
    };
}

// check how close the player's color is to the target
document.getElementById("checkBtn").onclick = () => {
    let r = parseInt(rSlider.value);
    let g = parseInt(gSlider.value);
    let b = parseInt(bSlider.value);

    // distance between two RGB vectors
    let distance = Math.sqrt(
        (r - target.r) ** 2 +
        (g - target.g) ** 2 +
        (b - target.b) ** 2
    );

    // max possible distance in RGB space
    let maxDistance = Math.sqrt(3 * (255 ** 2));

    // convert distance into similarity %
    let similarity = (1 - distance / maxDistance) * 100;

    if (similarity >= 80) {
        document.getElementById("statusText").innerText =
            `MATCHED! (${similarity.toFixed(1)}%)`;
        document.getElementById("nextBtn").disabled = false;
    } else {
        document.getElementById("statusText").innerText =
            `Not yet! (${similarity.toFixed(1)}% close)`;
    }
};

// load a new target color
document.getElementById("nextBtn").onclick = () => {
    target = generateRandomColor();
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("statusText").innerText = "New color! Match it!";
};
