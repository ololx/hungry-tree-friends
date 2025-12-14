export class WebGLDisplay {
    constructor(window, canvasId, options) {
        var _a;
        this._canvas = null;
        this._gl = null;
        this.resize = () => {
            if (!this._canvas || !this._gl)
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
            this._gl.viewport(0, 0, newWidth, newHeight);
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
    get gl() {
        if (!this._gl) {
            throw new Error("Display is not initialized. Call init() first.");
        }
        return this._gl;
    }
    init() {
        const canvas = this._window.document.getElementById(this._canvasId);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`Element with id '${this._canvasId}' is not a HTMLCanvasElement.`);
        }
        this._canvas = canvas;
        this._canvas.style.display = 'block';
        const gl = this._canvas.getContext("webgl", { antialias: true });
        if (!gl) {
            throw new Error("Unable to initialize WebGL. Your browser may not support it.");
        }
        this._gl = gl;
        if (this._autoResize) {
            this._window.addEventListener('resize', this.resize);
            this.resize();
        }
        return this._gl;
    }
    destroy() {
        if (this._autoResize) {
            this._window.removeEventListener('resize', this.resize);
        }
    }
}
