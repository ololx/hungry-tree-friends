var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class MicAnalyser {
    constructor(options) {
        this._rms = 0;
        this._rmsSmooth = 0;
        this._voicing = false;
        this._pitch = 0;
        this._startedFlag = false;
        this._audioContext = null;
        this._analyser = null;
        this._frequencyData = null;
        this._timeDomainData = null;
        this.startThreshold = options.startThreshold;
        this.stopThreshold = options.stopThreshold;
        this.smooth = options.smooth;
    }
    get rmsSmooth() {
        return this._rmsSmooth;
    }
    get isVoicing() {
        return this._voicing;
    }
    get pitch() {
        return this._pitch;
    }
    consumeStarted() {
        const flag = this._startedFlag;
        this._startedFlag = false;
        return flag;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stream = yield navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = this._audioContext.createMediaStreamSource(stream);
                this._analyser = this._audioContext.createAnalyser();
                this._analyser.fftSize = 2048;
                this._timeDomainData = new Float32Array(this._analyser.fftSize);
                this._frequencyData = new Float32Array(this._analyser.frequencyBinCount);
                source.connect(this._analyser);
            }
            catch (error) {
                console.error("Ошибка доступа к микрофону:", error);
                throw error;
            }
        });
    }
    update() {
        if (!this._analyser || !this._timeDomainData || !this._frequencyData) {
            return;
        }
        this._analyser.getFloatTimeDomainData(this._timeDomainData);
        let sum = 0;
        for (let i = 0; i < this._timeDomainData.length; i++) {
            sum += this._timeDomainData[i] * this._timeDomainData[i];
        }
        this._rms = Math.sqrt(sum / this._timeDomainData.length);
        this._rmsSmooth = this.smooth * this._rms + (1 - this.smooth) * this._rmsSmooth;
        if (!this._voicing && this._rmsSmooth >= this.startThreshold) {
            this._voicing = true;
            this._startedFlag = true;
        }
        else if (this._voicing && this._rmsSmooth <= this.stopThreshold) {
            this._voicing = false;
            this._pitch = 0;
        }
        if (this._voicing) {
            this._calculatePitch();
        }
    }
    _calculatePitch() {
        if (!this._analyser || !this._frequencyData || !this._audioContext) {
            return;
        }
        this._analyser.getFloatFrequencyData(this._frequencyData);
        let maxIndex = -1;
        let maxVal = -Infinity;
        for (let i = 0; i < this._frequencyData.length; i++) {
            if (this._frequencyData[i] > maxVal) {
                maxVal = this._frequencyData[i];
                maxIndex = i;
            }
        }
        if (maxVal < -100) {
            this._pitch = 0;
            return;
        }
        this._pitch = (maxIndex * this._audioContext.sampleRate) / this._analyser.fftSize;
    }
}
