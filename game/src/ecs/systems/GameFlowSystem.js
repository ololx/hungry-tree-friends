import {Shiit} from "../../../../shiitake/target/Shiitake.js";
import {Actions, Events} from "../../cfg/GameConfig.js";
import {UIConstants, UIPhaseVisibility, Texts} from "../../cfg/UIConfig.js";

export class GameFlowSystem extends Shiit.AbstractSystem {
    constructor(world, input, scoreEntityId, gameStateEntityId, events, overlayRefs, uiRefs) {
        super("GameFlowSystem", 150);
        this.world = world;
        this.input = input;
        this.scoreEntityId = scoreEntityId;
        this.gameStateEntityId = gameStateEntityId;
        this.overlayRefs = overlayRefs;
        this.uiRefs = uiRefs;
        this.events = events;
        this.events.on(Events.LEVEL_FINISHED, this.onLevelFinished.bind(this));
    }

    get score() {
        return this.world.getComponent(this.scoreEntityId, "Score");
    }

    get gameState() {
        return this.world.getComponent(this.gameStateEntityId, "GameState");
    }

    emitGameStateChanged() {
        const gs = this.gameState;
        if (!gs) return;
        this.events.emit(Events.GAME_STATE_CHANGED, {
            phase: gs.phase,
            levelIndex: gs.currentLevelIndex,
            isRunning: gs.isRunning,
        });
    }

    onLevelFinished({levelIndex, isLast}) {
        const gs = this.gameState;
        const score = this.score;
        if (!gs) return;

        gs.isRunning = false;

        const result = score?.lastResult;
        let nextIndex = levelIndex;
        let passed = false;

        if (result && result.passed) {
            passed = true;

            if (!isLast) {
                nextIndex = Math.min(levelIndex + 1, gs.levelCount - 1);
            }
        }

        gs.currentLevelIndex = nextIndex;
        gs.phase = passed && isLast ? "restart" : "between";
        gs.overlayTargetAlpha = UIConstants.OVERLAY_FULL_ALPHA;

        this._applyUIVisibilityForPhase(gs.phase);
        this.emitGameStateChanged();
    }

    _setOverlayText(mainText, subText, alpha = 1) {
        const mainEnt = this.overlayRefs.main;
        const subEnt = this.overlayRefs.sub;

        const tMain = this.world.getComponent(mainEnt, "UIText");
        const tSub = this.world.getComponent(subEnt, "UIText");

        if (tMain) {
            tMain.text = mainText;
            tMain.alpha = alpha;
        }
        if (tSub) {
            tSub.text = subText;
            tSub.alpha = alpha;
        }
    }

    _updateOverlayFade(gs, dt) {
        if (gs.overlayAlpha < gs.overlayTargetAlpha) {
            gs.overlayAlpha = Math.min(gs.overlayAlpha + gs.overlaySpeed * dt, gs.overlayTargetAlpha);
        } else if (gs.overlayAlpha > gs.overlayTargetAlpha) {
            gs.overlayAlpha = Math.max(gs.overlayAlpha - gs.overlaySpeed * dt, gs.overlayTargetAlpha);
        }
    }

    _handleOverlayPhase(gs, {mainText, subText, nextPhase, targetOverlayAlpha, onConfirm}) {
        this._setOverlayText(mainText, subText, 1);

        const readyToConfirm = gs.overlayAlpha >= UIConstants.OVERLAY_FULL_ALPHA - UIConstants.OVERLAY_EPSILON;

        if (readyToConfirm && this.input.consumeActionPressed(Actions.HIT)) {
            gs.phase = nextPhase;
            if (typeof targetOverlayAlpha === "number") {
                gs.overlayTargetAlpha = targetOverlayAlpha;
            }
            if (onConfirm) {
                onConfirm(gs, this.score);
            }
            this._applyUIVisibilityForPhase(gs.phase);
            this.emitGameStateChanged();
        }
    }

    _setVisible(refKey, visible) {
        const id = this.uiRefs[refKey];
        if (!id) return;
        const v = this.world.getComponent(id, "Visibility");
        if (!v) return;
        v.visible = visible;
    }

    _applyUIVisibilityForPhase(phase) {
        const map = UIPhaseVisibility[phase];
        if (!map) return;

        for (const [key, visible] of Object.entries(map)) {
            this._setVisible(key, visible);
        }
    }

    update(_world, tick) {
        const dt = tick.deltaTime || 0;
        const gs = this.gameState;
        if (!gs) return;

        this._updateOverlayFade(gs, dt);

        switch (gs.phase) {
            case "intro": {
                gs.isRunning = false;

                this._applyUIVisibilityForPhase("intro");

                this._handleOverlayPhase(gs, {
                    mainText: "",
                    subText: Texts.hintStart,
                    nextPhase: "fadeOutToPlay",
                    targetOverlayAlpha: 0,
                    onConfirm: (state) => {
                        state.currentLevelIndex = 0;
                    },
                });
                break;
            }

            case "between": {
                gs.isRunning = false;
                this._applyUIVisibilityForPhase("between");

                const result = this.score?.lastResult;

                let main = "";
                let sub = "";
                if (result) {
                    main = Texts.accuracyResult(result.percent);
                    sub = result.percent >= 90 ? Texts.hintContinue : Texts.hintRetry;
                } else {
                    sub = Texts.hintContinue;
                }

                this._handleOverlayPhase(gs, {
                    mainText: main,
                    subText: sub,
                    nextPhase: "fadeOutToPlay",
                    targetOverlayAlpha: 0,
                });
                break;
            }

            case "restart": {
                gs.isRunning = false;
                this._applyUIVisibilityForPhase("restart");

                const result = this.score?.lastResult;

                let main = "";
                if (result) {
                    main = Texts.accuracyResult(result.percent);
                }

                this._handleOverlayPhase(gs, {
                    mainText: main,
                    subText: Texts.hintRestart,
                    nextPhase: "intro",
                    targetOverlayAlpha: UIConstants.OVERLAY_FULL_ALPHA,
                    onConfirm: (_state, score) => {
                        if (score) {
                            score.lastResult = null;
                            score.score = 0;
                            score.combo = 0;
                            score.totalHits = 0;
                            score.totalMisses = 0;
                            score.totalNotes = 0;
                            this.events.emit(Events.SCORE_CHANGED);
                        }
                    },
                });
                break;
            }

            case "fadeOutToPlay": {
                this._applyUIVisibilityForPhase("fadeOutToPlay");

                this._setOverlayText("", "", gs.overlayAlpha);

                if (gs.overlayAlpha <= UIConstants.OVERLAY_EPSILON) {
                    gs.phase = "playing";
                    gs.overlayAlpha = 0;
                    gs.overlayTargetAlpha = 0;
                    gs.isRunning = true;

                    const levelIndex = gs.currentLevelIndex ?? 0;
                    this.events.emit(Events.LEVEL_START, {levelIndex});

                    this._setOverlayText("", "", 0);
                    this._applyUIVisibilityForPhase("playing");
                    this.emitGameStateChanged();
                }
                break;
            }

            case "playing": {
                this._applyUIVisibilityForPhase("playing");
                this._setOverlayText("", "", 0);
                break;
            }

            default:
                break;
        }
    }
}
