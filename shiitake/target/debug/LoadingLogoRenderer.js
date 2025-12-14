const LogoText = {
    title: {
        text: "Shiitake v0.0.1",
        font: "600 36px sans-serif",
        fillStyle: "rgba(255,255,255,0.98)",
        textAlign: "center",
        textBaseline: "middle",
        shadowColor: "rgba(0,0,0,0.7)",
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
    }
};
export class MaskLogoRenderer {
    constructor(mask) {
        this.mask = mask;
    }
    draw(renderer, display) {
        var _a, _b;
        const W = display.designWidth;
        const H = display.designHeight;
        const rows = this.mask.length;
        const cols = (_b = (_a = this.mask[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        if (!rows || !cols)
            return;
        const pixelSize = Math.floor(Math.min(W, H) / 60);
        const logoWidth = cols * pixelSize;
        const logoHeight = rows * pixelSize;
        const logoX = (W - logoWidth) / 2;
        const logoY = H / 2 - logoHeight - 130;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.mask[y][x]) {
                    renderer.drawPrimitive({
                        x: logoX + x * pixelSize + 2,
                        y: logoY + y * pixelSize + 2,
                        w: pixelSize,
                        h: pixelSize,
                        fillStyle: "rgba(0,0,0,0.4)",
                        alpha: 1,
                    });
                    renderer.drawPrimitive({
                        x: logoX + x * pixelSize,
                        y: logoY + y * pixelSize,
                        w: pixelSize,
                        h: pixelSize,
                        fillStyle: "rgba(255,206,84,0.98)",
                        alpha: 1,
                    });
                }
            }
        }
        const textY = logoY + logoHeight + 40;
        renderer.drawText({
            text: LogoText.title.text,
            x: W / 2,
            y: textY,
            font: LogoText.title.font,
            fillStyle: LogoText.title.fillStyle,
            textAlign: LogoText.title.textAlign,
            textBaseline: LogoText.title.textBaseline,
            shadowColor: LogoText.title.shadowColor,
            shadowBlur: LogoText.title.shadowBlur,
            shadowOffsetX: LogoText.title.shadowOffsetX,
            shadowOffsetY: LogoText.title.shadowOffsetY,
        });
    }
}
export class Base64LogoRenderer {
    constructor(base64Png) {
        this.base64Png = base64Png;
        this.image = null;
        this.loaded = false;
        const img = new Image();
        const trimmed = base64Png.trim();
        img.src = trimmed.startsWith("data:image/")
            ? trimmed
            : `data:image/png;base64,${trimmed}`;
        img.onload = () => {
            this.loaded = true;
        };
        img.onerror = (e) => {
            console.error("Failed to load base64 image", e, img.src);
        };
        this.image = img;
    }
    draw(renderer, display) {
        if (!this.loaded || !this.image)
            return;
        const W = display.designWidth;
        const H = display.designHeight;
        const targetHeight = Math.min(H / 3, 256);
        const aspect = this.image.width / this.image.height;
        const targetWidth = targetHeight * aspect;
        const x = (W - targetWidth) / 2;
        const y = H / 2 - targetHeight - 80;
        renderer.drawImage(this.image, x, y, targetWidth, targetHeight);
        const textY = y + targetHeight + 40;
        renderer.drawText({
            text: LogoText.title.text,
            x: W / 2,
            y: textY,
            font: LogoText.title.font,
            fillStyle: LogoText.title.fillStyle,
            textAlign: LogoText.title.textAlign,
            textBaseline: LogoText.title.textBaseline,
            shadowColor: LogoText.title.shadowColor,
            shadowBlur: LogoText.title.shadowBlur,
            shadowOffsetX: LogoText.title.shadowOffsetX,
            shadowOffsetY: LogoText.title.shadowOffsetY,
        });
    }
}
