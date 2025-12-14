export class Canvas2DRender {
    constructor(display) {
        this.currentTransform = Canvas2DRender.DEFAULT_TRANSFORMATION;
        this.display = display;
        this.canvas = display.canvas;
        this.ctx = display.ctx;
    }
    clear() {
        const w = this.display.designWidth;
        const h = this.display.designHeight;
        this.ctx.clearRect(0, 0, w, h);
        this.resetTransform();
    }
    setTransform(transform) {
        var _a, _b, _c;
        this.currentTransform = {
            x: transform.x,
            y: transform.y,
            scaleX: (_a = transform.scaleX) !== null && _a !== void 0 ? _a : 1,
            scaleY: (_b = transform.scaleY) !== null && _b !== void 0 ? _b : 1,
            rotation: (_c = transform.rotation) !== null && _c !== void 0 ? _c : 0,
        };
    }
    resetTransform() {
        this.currentTransform = Canvas2DRender.DEFAULT_TRANSFORMATION;
    }
    drawText(options) {
        var _a, _b;
        const { text, x, y, font = "16px sans-serif", fillStyle = "#fff", textAlign = "left", textBaseline = "alphabetic", shadowColor = null, shadowBlur = 0, shadowOffsetX = 0, shadowOffsetY = 0, maxWidth, } = options;
        this.ctx.save();
        const tr = this.currentTransform;
        if (tr) {
            this.ctx.translate(tr.x, tr.y);
            if (tr.rotation && tr.rotation !== 0) {
                this.ctx.rotate(tr.rotation);
            }
            const sx = (_a = tr.scaleX) !== null && _a !== void 0 ? _a : 1;
            const sy = (_b = tr.scaleY) !== null && _b !== void 0 ? _b : 1;
            if (sx !== 1 || sy !== 1) {
                this.ctx.scale(sx, sy);
            }
        }
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        if (shadowColor) {
            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = shadowBlur;
            this.ctx.shadowOffsetX = shadowOffsetX;
            this.ctx.shadowOffsetY = shadowOffsetY;
        }
        else {
            this.ctx.shadowColor = "transparent";
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        if (typeof maxWidth === "number") {
            this.ctx.fillText(text, x, y, maxWidth);
        }
        else {
            this.ctx.fillText(text, x, y);
        }
        this.ctx.restore();
    }
    drawPrimitive(primitive) {
        var _a, _b;
        this.ctx.save();
        const tr = this.currentTransform;
        if (tr) {
            this.ctx.translate(tr.x, tr.y);
            if (tr.rotation && tr.rotation !== 0) {
                this.ctx.rotate(tr.rotation);
            }
            const sx = (_a = tr.scaleX) !== null && _a !== void 0 ? _a : 1;
            const sy = (_b = tr.scaleY) !== null && _b !== void 0 ? _b : 1;
            if (sx !== 1 || sy !== 1) {
                this.ctx.scale(sx, sy);
            }
        }
        this.ctx.globalAlpha *= primitive.alpha;
        this.ctx.fillStyle = primitive.fillStyle;
        this.ctx.fillRect(primitive.x, primitive.y, primitive.w, primitive.h);
        this.ctx.restore();
    }
    drawImage(image, x, y, w, h) {
        var _a, _b;
        this.ctx.save();
        const tr = this.currentTransform;
        if (tr) {
            this.ctx.translate(tr.x, tr.y);
            if (tr.rotation && tr.rotation !== 0) {
                this.ctx.rotate(tr.rotation);
            }
            const sx = (_a = tr.scaleX) !== null && _a !== void 0 ? _a : 1;
            const sy = (_b = tr.scaleY) !== null && _b !== void 0 ? _b : 1;
            if (sx !== 1 || sy !== 1) {
                this.ctx.scale(sx, sy);
            }
        }
        if (typeof w === "number" && typeof h === "number") {
            this.ctx.drawImage(image, x, y, w, h);
        }
        else {
            this.ctx.drawImage(image, x, y);
        }
        this.ctx.restore();
    }
}
Canvas2DRender.DEFAULT_TRANSFORMATION = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
};
