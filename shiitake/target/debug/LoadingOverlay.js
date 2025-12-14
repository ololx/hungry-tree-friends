import { Canvas2DRender } from '../render/Canvas2DRender.js';
export class LoadingOverlay {
    constructor(stages, display, logoRenderer) {
        this.stages = stages;
        this.display = display;
        this.logoRenderer = logoRenderer;
        this.hidden = false;
        this.stageIndex = 0;
        this.subProgress = 0;
        this.display.init();
        this.renderer = new Canvas2DRender(this.display);
    }
    setStage(stageIndex, subProgress = 0) {
        const totalStages = this.stages.length;
        const clampedSub = Math.max(0, Math.min(1, subProgress));
        const safeStage = Math.max(0, Math.min(stageIndex, totalStages - 1));
        this.stageIndex = safeStage;
        this.subProgress = clampedSub;
        const overall = Math.max(0, Math.min(1, (safeStage + clampedSub) / totalStages));
        this.render(overall);
        if (overall >= 1) {
            this.hide();
        }
    }
    render(overall) {
        var _a;
        const r = this.renderer;
        const W = this.display.designWidth;
        const H = this.display.designHeight;
        r.clear();
        r.drawPrimitive({
            x: 0,
            y: 0,
            w: W,
            h: H,
            fillStyle: "rgba(0,0,0,0.9)",
            alpha: 1,
        });
        this.logoRenderer.draw(r, this.display);
        const barWidth = Math.min(800, W * 0.8);
        const barHeight = 24;
        const barX = (W - barWidth) / 2;
        const barY = H / 2 + 110;
        const title = (_a = this.stages[this.stageIndex]) !== null && _a !== void 0 ? _a : "";
        const text = `${title}...`;
        r.drawText({
            text,
            x: W / 2,
            y: barY - 40,
            font: "400 28px sans-serif",
            fillStyle: "rgba(255,255,255,0.95)",
            textAlign: "center",
            textBaseline: "bottom",
            shadowColor: "rgba(0,0,0,0.7)",
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
        });
        r.drawPrimitive({
            x: barX,
            y: barY,
            w: barWidth,
            h: barHeight,
            fillStyle: "rgba(255,255,255,0.08)",
            alpha: 1,
        });
        const fillWidth = barWidth * overall;
        r.drawPrimitive({
            x: barX,
            y: barY,
            w: fillWidth,
            h: barHeight,
            fillStyle: "rgba(255,206,84,0.95)",
            alpha: 1,
        });
    }
    hide() {
        this.renderer.clear();
    }
}
