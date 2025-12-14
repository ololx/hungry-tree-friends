export class Ticker {
    start(callback) {
        const loop = () => {
            this.frameRequestId = requestAnimationFrame(loop);
            callback();
        };
        this.frameRequestId = requestAnimationFrame(loop);
    }
    stop() {
        if (this.frameRequestId) {
            cancelAnimationFrame(this.frameRequestId);
        }
    }
}
