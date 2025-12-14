export class RateCounter {
    constructor(now = performance.now()) {
        this.acc = 0;
        this.count = 0;
        this.rate = 0;
        this.last = now;
    }
    tick(now = performance.now()) {
        const dt = now - this.last;
        this.acc += dt;
        this.last = now;
        this.count++;
        if (this.acc >= 1000) {
            this.rate = this.count;
            this.count = 0;
            this.acc -= 1000;
        }
        return this.rate;
    }
    get value() {
        return this.rate;
    }
    reset(now = performance.now()) {
        this.last = now;
        this.acc = 0;
        this.count = 0;
        this.rate = 0;
    }
}
