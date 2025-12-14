export class Canvas2DDisplay {
    constructor(window, canvasId, options) {
        var _a;
        this._canvas = null;
        this._ctx = null;
        this.resize = () => {
            if (!this._canvas || !this._ctx)
                return;
            const screenWidth = this._window.innerWidth;
            const screenHeight = this._window.innerHeight;
            const screenAspect = screenWidth / screenHeight;
            const designAspect = this._designWidth / this._designHeight;
            let newWidth;
            let newHeight;
            if (screenAspect > designAspect) {
                newHeight = screenHeight;
                newWidth = newHeight * designAspect;
            }
            else {
                newWidth = screenWidth;
                newHeight = newWidth / designAspect;
            }
            this._canvas.width = newWidth;
            this._canvas.height = newHeight;
            this._canvas.style.width = newWidth + 'px';
            this._canvas.style.height = newHeight + 'px';
            this._canvas.style.position = 'absolute';
            this._canvas.style.left = (screenWidth - newWidth) / 2 + 'px';
            this._canvas.style.top = (screenHeight - newHeight) / 2 + 'px';
            this._ctx.setTransform(1, 0, 0, 1, 0, 0);
            const scaleX = newWidth / this._designWidth;
            const scaleY = newHeight / this._designHeight;
            const scale = Math.min(scaleX, scaleY);
            this._ctx.scale(scale, scale);
        };
        this._window = window;
        this._canvasId = canvasId;
        this._designWidth = options.designWidth;
        this._designHeight = options.designHeight;
        this._autoResize = (_a = options.autoResize) !== null && _a !== void 0 ? _a : true;
    }
    get canvas() {
        if (!this._canvas) {
            throw new Error("Display is not initialized. Call init() first.");
        }
        return this._canvas;
    }
    get ctx() {
        if (!this._ctx) {
            throw new Error("Display is not initialized. Call init() first.");
        }
        return this._ctx;
    }
    get designWidth() {
        return this._designWidth;
    }
    get designHeight() {
        return this._designHeight;
    }
    init() {
        const canvas = this._window.document.getElementById(this._canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`Element with id '${this._canvasId}' is not a HTMLCanvasElement.`);
        }
        this._canvas = canvas;
        this._canvas.style.display = 'block';
        const ctx = this._canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Unable to get 2D context. Your browser may not support it.");
        }
        this._ctx = ctx;
        if (this._autoResize) {
            this._window.addEventListener('resize', this.resize);
            this.resize();
        }
        return this._ctx;
    }
    destroy() {
        if (this._autoResize) {
            this._window.removeEventListener('resize', this.resize);
        }
    }
}
