export class AudioSourceComponent {
    constructor(sounds = {}, options = {}) {
        var _a;
        this.playQueue = [];
        this.backgroundMusic = null;
        this.loop = false;
        this.volume = 1.0;
        this.sounds = new Map(Object.entries(sounds));
        this.backgroundMusic = options.backgroundMusic || null;
        this.loop = options.loop || false;
        this.volume = (_a = options.volume) !== null && _a !== void 0 ? _a : 1.0;
    }
}
