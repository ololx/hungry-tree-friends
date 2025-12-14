export class UIComponent {
    constructor(layer = 0) {
        this.layer = layer;
    }
}

export class UITextComponent {
    constructor(text, cfg) {
        this.text = text;
        this.font = cfg.font;
        this.fillStyle = cfg.fillStyle;
        this.textAlign = cfg.textAlign;
        this.textBaseline = cfg.textBaseline;
        this.shadowColor = cfg.shadowColor;
        this.shadowBlur = cfg.shadowBlur;
        this.shadowOffsetX = cfg.shadowOffsetX;
        this.shadowOffsetY = cfg.shadowOffsetY;
        this.alpha = 1.0;
    }
}

export class UIRectComponent {
    constructor({
                    w,
                    h,
                    fillStyle = "rgba(0,0,0,1)",
                    useOverlayAlpha = false,
                } = {}) {
        this.w = w;
        this.h = h;
        this.fillStyle = fillStyle;
        this.useOverlayAlpha = useOverlayAlpha;
        this.alpha = 1.0;
    }
}

export class UITextAnimationComponent {
    constructor({
                    type = "none",
                    duration = 0.6,
                    timer = 0,
                    autoHide = false,
                } = {}) {
        this.type = type;
        this.duration = duration;
        this.timer = timer;
        this.autoHide = autoHide;
        this.active = false;
    }
}