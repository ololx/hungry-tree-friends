import {UIConstants, OverlayConstants} from "../../cfg/UIConfig.js";

export class GameStateComponent {
    constructor(levelCount = 0) {
        this.currentLevelIndex = 0;
        this.levelCount = levelCount;
        this.isRunning = false;
        this.phase = "intro";
        this.overlayAlpha = UIConstants.OVERLAY_FULL_ALPHA;
        this.overlayTargetAlpha = UIConstants.OVERLAY_FULL_ALPHA;
        this.overlaySpeed = OverlayConstants.FADE_SPEED;
    }
}
