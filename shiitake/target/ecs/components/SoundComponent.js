export class SoundComponent {
    constructor(options) {
        var _a, _b, _c, _d;
        this.soundName = options.soundName;
        this.volume = (_a = options.volume) !== null && _a !== void 0 ? _a : 1.0;
        this.mode = (_b = options.mode) !== null && _b !== void 0 ? _b : "oneShot";
        this.active = (_c = options.active) !== null && _c !== void 0 ? _c : false;
        this.playing = (_d = options.playing) !== null && _d !== void 0 ? _d : false;
    }
}
