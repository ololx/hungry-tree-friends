var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.activeSounds = new Map();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    loadSound(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sounds.has(name)) {
                return;
            }
            try {
                const response = yield fetch(url);
                const arrayBuffer = yield response.arrayBuffer();
                const audioBuffer = yield this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds.set(name, audioBuffer);
                console.log(`Sound loaded: ${name}`);
            }
            catch (error) {
                console.error(`Failed to load sound: ${name} from ${url}`, error);
            }
        });
    }
    getSound(name) {
        return this.sounds.get(name);
    }
    playSound(name, loop = false, volume = 1.0, maxDurationSec) {
        const audioBuffer = this.getSound(name);
        if (!audioBuffer) {
            console.warn(`Sound not found: ${name}`);
            return;
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = loop;
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        const now = this.audioContext.currentTime;
        const offset = 0;
        if (maxDurationSec != null) {
            source.start(now, offset, maxDurationSec);
        }
        else {
            source.start(now, offset);
        }
        this.activeSounds.set(name, {
            source,
            startedAt: now,
            offset,
            loop,
            duration: audioBuffer.duration,
            maxDurationSec,
        });
        source.onended = () => {
            const current = this.activeSounds.get(name);
            if (current && current.source === source) {
                this.activeSounds.delete(name);
            }
        };
        return source;
    }
    stopSound(name) {
        const info = this.activeSounds.get(name);
        if (!info) {
            return;
        }
        try {
            info.source.stop();
        }
        catch (ignore) { }
        this.activeSounds.delete(name);
    }
    getCurrentTime(name) {
        var _a;
        const info = this.activeSounds.get(name);
        if (!info) {
            return undefined;
        }
        const now = this.audioContext.currentTime;
        let elapsed = now - info.startedAt;
        if (elapsed < 0)
            elapsed = 0;
        let t = info.offset + elapsed;
        const effectiveDuration = (_a = info.maxDurationSec) !== null && _a !== void 0 ? _a : info.duration;
        if (info.loop) {
            t = t % info.duration;
        }
        else {
            if (t > effectiveDuration) {
                t = effectiveDuration;
            }
        }
        return t;
    }
    isPlaying(name) {
        return this.activeSounds.has(name);
    }
}
