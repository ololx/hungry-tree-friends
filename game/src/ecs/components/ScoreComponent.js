import {ScoreConstants} from "../../cfg/GameConfig.js";

export class ScoreComponent {
    constructor() {
        this.score = 0;
        this.combo = 0;
        this.accuracy = ScoreConstants.DEFAULT_ACCURACY;
        this.accuracyPercent = 0;
        this.totalHits = 0;
        this.totalMisses = 0;
        this.totalNotes = 0;
        this.lastResult = null;
        this.comboPopupTimer = 0;
        this.comboPopupDuration = ScoreConstants.COMBO_POPUP_DURATION;
        this.wrongPopupTimer = 0;
        this.wrongPopupDuration = ScoreConstants.WRONG_POPUP_DURATION;
        this.holdPopupTimer = 0;
        this.holdPopupDuration = ScoreConstants.HOLD_POPUP_DURATION;
        this.holdWasAbove = false;
    }
}
