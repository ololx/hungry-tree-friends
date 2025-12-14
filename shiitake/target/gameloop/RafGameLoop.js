import { Ticker } from "./Ticker.js";
export class RafGameLoop {
    constructor(processor, fps = 60) {
        this.lastTime = 0;
        this.lastRenderTime = 0;
        this.lag = 0;
        this.running = false;
        this.ticker = new Ticker();
        this.tick = { alphaTime: 0, deltaTime: 0, isActive: false };
        this.processor = processor;
        this.frameTime = 1000 / fps;
        this.renderFrameTime = 1000 / fps;
    }
    run() {
        if (!this.running) {
            this.lastTime = performance.now();
            this.lastRenderTime = this.lastTime;
            this.ticker.start(this.loop.bind(this));
        }
        this.running = true;
    }
    stop() {
        this.running = false;
        this.ticker.stop();
    }
    pause() {
        this.running = false;
    }
    loop() {
        this.tick = { alphaTime: 0, deltaTime: 0, isActive: this.running };
        this.processor.processInput(this.tick);
        const now = performance.now();
        let elapsed = now - this.lastTime;
        this.lastTime = now;
        this.lag += elapsed;
        while (this.lag >= this.frameTime) {
            this.tick.deltaTime = this.frameTime / 1000;
            this.processor.processUpdate(this.tick);
            this.lag -= this.frameTime;
        }
        this.tick.alphaTime = this.lag / this.frameTime;
        if (now - this.lastRenderTime >= this.renderFrameTime) {
            this.lastRenderTime = now;
            this.processor.processRender(this.tick);
        }
    }
}
