import {Shiit} from "../../../../shiitake/target/Shiitake.js";
import {Events, ScoreConstants} from "../../cfg/GameConfig.js";
import {withComponent} from "../ComponentUtils.js";

export class ScoreSystem extends Shiit.AbstractSystem {
    constructor(world, scoreEntityId, progressId, events, soundRefs) {
        super("ScoreSystem", 300);
        this.world = world;
        this.scoreEntityId = scoreEntityId;
        this.progressId = progressId;
        this.events = events;
        this.soundRefs = soundRefs;

        events.on(Events.NOTE_HIT, this.onNoteHit.bind(this));
        events.on(Events.NOTE_MISS, this.onNoteMiss.bind(this));
        events.on(Events.SCORE_RESET_FOR_LEVEL, this.onResetForLevel.bind(this));
        events.on(Events.LEVEL_FINISHED, this.onLevelFinished.bind(this));
    }

    _resolveAccuracyState(percent, currentAccuracy) {
        let state = {
            anim: ScoreConstants.DEFAULT_ACCURACY_ANIM,
            value: currentAccuracy,
        };

        for (const s of ScoreConstants.ACCURACY_STATES) {
            if (percent >= s.min) {
                state = {anim: s.anim, value: s.value};
                break;
            }
        }

        return state;
    }

    _triggerSoundByRef(refKey) {
        const id = this.soundRefs?.[refKey];
        if (!id) return;
        const c = this.world.getComponent(id, "Sound");
        if (!c) return;
        c.active = true;
    }

    _playAccuracyTransitionSound(prevAccuracy, nextAccuracy, _percent) {
        if (nextAccuracy > 0 && prevAccuracy < 0) {
            this._triggerSoundByRef("wow");
        } else if (nextAccuracy < 0 && prevAccuracy > 0) {
            this._triggerSoundByRef("bow");
        }
    }

    processAccuracy(score, percent) {
        const prevAccuracy = score.accuracy;
        const state = this._resolveAccuracyState(percent, prevAccuracy);
        Shiit.setAnimation(this.world, this.progressId, state.anim);
        this._playAccuracyTransitionSound(prevAccuracy, state.value, percent);
        score.accuracy = state.value;
    }

    onResetForLevel({totalNotes}) {
        withComponent(this.world, this.scoreEntityId, "Score", (s) => {
            s.totalNotes = totalNotes;
            s.totalHits = 0;
            s.totalMisses = 0;
            s.score = 0;
            s.combo = 0;
            s.accuracy = ScoreConstants.DEFAULT_ACCURACY;
            s.accuracyPercent = 0;
            s.comboPopupTimer = 0;
            s.wrongPopupTimer = 0;
            s.holdPopupTimer = 0;
            s.holdWasAbove = false;
            this.events.emit(Events.SCORE_CHANGED);
        });
    }

    onNoteHit() {
        withComponent(this.world, this.scoreEntityId, "Score", (s) => {
            s.combo++;
            s.totalHits++;
            s.score += s.combo * 10;

            if (s.combo >= ScoreConstants.COMBO_MIN_FOR_POPUP) {
                s.comboPopupTimer = s.comboPopupDuration;
            }

            this._checkHoldMidLevel(s);

            this.events.emit(Events.SCORE_CHANGED);
        });
    }

    onNoteMiss(payload = {}) {
        withComponent(this.world, this.scoreEntityId, "Score", (s) => {
            s.totalMisses++;
            s.comboPopupTimer = 0;
            s.combo = 0;

            if (payload.isBomb) {
                s.wrongPopupTimer = s.wrongPopupDuration;
                this._triggerSoundByRef("wrong");
            }

            this.events.emit(Events.SCORE_CHANGED);
        });
    }

    onLevelFinished({isLast}) {
        withComponent(this.world, this.scoreEntityId, "Score", (s) => {
            const total = s.totalHits + s.totalMisses;
            const percent = total > 0 ? Math.round((s.totalHits / total) * 100) : 0;
            s.accuracyPercent = percent;
            const passed = percent >= 90;

            s.lastResult = {
                percent,
                passed,
                isLast: Boolean(isLast),
            };

            this._triggerSoundByRef(passed ? "finishWin" : "finishLose");
            this.processAccuracy(s, percent);
            this.events.emit(Events.SCORE_CHANGED);
        });
    }

    _checkHoldMidLevel(s) {
        if (s.combo % 6 === 0 && s.accuracyPercent >= 90) {
            s.holdPopupTimer = s.holdPopupDuration;
            this._triggerSoundByRef("hold");
        }
    }

    update(_world, tick) {
        withComponent(this.world, this.scoreEntityId, "Score", (s) => {
            const dt = tick.deltaTime || 0;

            if (s.comboPopupTimer > 0) {
                s.comboPopupTimer -= dt;
                if (s.comboPopupTimer < 0) s.comboPopupTimer = 0;
            }

            if (s.wrongPopupTimer > 0) {
                s.wrongPopupTimer -= dt;
                if (s.wrongPopupTimer < 0) s.wrongPopupTimer = 0;
            }

            if (s.holdPopupTimer > 0) {
                s.holdPopupTimer -= dt;
                if (s.holdPopupTimer < 0) s.holdPopupTimer = 0;
            }

            const total = s.totalHits + s.totalMisses;
            const percent = total > 0 ? Math.round((s.totalHits / total) * 100) : 0;
            s.accuracyPercent = percent;

            this.processAccuracy(s, percent);
        });
    }
}
