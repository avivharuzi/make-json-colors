function getColorName(hex) {
    let match  = ntc.name(hex);
    return match[1];
}

function hexToHsl(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255;
    g /= 255;
    b /= 255;
    
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    let colorInHSL = `hsl(${h}, ${s}%, ${l}%)`;
    return colorInHSL;
}

function hexToRgb(c) {
    c = c.replace(/#/, "");
    c = c.length % 6 ? c.replace(/(.)(.)(.)/, "$1$1$2$2$3$3") : c;
    c = window.parseInt(c, 16);

    const r = (c >> 16) & 0xFF;
    const g = (c >> 08) & 0xFF;
    const b = (c >> 00) & 0xFF;
    
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToCmyk(hex) {
    let c = 0;
    let m = 0;
    let y = 0;
    let k = 0;
    
    hex = (hex.charAt(0) === "#") ? hex.substring(1,7) : hex;
    
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    if (r === 0 && g === 0 && b === 0) {
        return `cmyk(0%, 0%, 0%, 100%)`;
    }
    
    c = 1 - (r / 255);
    m = 1 - (g / 255);
    y = 1 - (b / 255);
    
    let minCmy = Math.min(c, Math.min(m, y));
    
    c = (c - minCmy) / (1 - minCmy);
    c = +(c.toFixed(2) * 100).toFixed(0);

    m = (m - minCmy) / (1 - minCmy)
    m = +(m.toFixed(2) * 100).toFixed(0);

    y = (y - minCmy) / (1 - minCmy);
    y = +(y.toFixed(2) * 100).toFixed(0);

    k = minCmy;
    k = +(k.toFixed(2) * 100).toFixed(0);
    
    return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}


function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

function getWeight(i) {
    switch (i) {
        case 1:
            return "50";
            break;
        case 2:
            return "100";
            break;
        case 3:
            return "200";
            break;
        case 4:
            return "300";
            break;
        case 5:
            return "400";
            break;
        case 6:
            return "500";
            break;
        case 7:
            return "600";
            break;
        case 8:
            return "700";
            break;
        case 9:
            return "800";
            break;
        case 10:
            return "900";
            break;
        case 11:
            return "A100";
            break;
        case 12:
            return "A200";
            break;
        case 13:
            return "A400";
            break;
        case 14:
            return "A700";
            break;
        default: return false;
    }
}

function getColorsConversions(hex, weight, name = false) {
    if (!name) {
        name = getColorName(hex);
    }

    return {
        name: name,
        weight: weight,
        hex: hex,
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex),
        cmyk: hexToCmyk(hex)
    }
}
