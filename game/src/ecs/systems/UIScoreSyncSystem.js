import {Shiit} from "../../../../shiitake/target/Shiitake.js";
import {Levels} from "../../cfg/Levels.js";
import {Events, ScoreConstants} from "../../cfg/GameConfig.js";
import {Texts} from "../../cfg/UIConfig.js";

export class UIScoreSyncSystem extends Shiit.AbstractSystem {
    constructor(world, scoreEntityId, gameStateEntityId, uiRefs, events) {
        super("UIScoreSyncSystem", 500);
        this.world = world;
        this.scoreEntityId = scoreEntityId;
        this.gameStateEntityId = gameStateEntityId;
        this.uiRefs = uiRefs;
        this.events = events;

        events.on(Events.SCORE_CHANGED, this.updateScoreUI.bind(this));
        events.on(Events.GAME_STATE_CHANGED, this.updateGameStateUI.bind(this));

        this.updateGameStateUI();
        this.updateScoreUI();
    }

    get score() {
        return this.world.getComponent(this.scoreEntityId, "Score");
    }

    get gameState() {
        return this.world.getComponent(this.gameStateEntityId, "GameState");
    }

    get currentLevelConfig() {
        const gs = this.gameState;
        const levelIndex = Math.max(0, Math.min(gs?.currentLevelIndex ?? 0, Levels.length - 1));
        return Levels[levelIndex];
    }

    updateGameStateUI() {
        const score = this.score;
        const gs = this.gameState;
        if (!gs) {
            return;
        }

        const levelConfig = this.currentLevelConfig;

        {
            const e = this.uiRefs.title;
            const t = this.world.getComponent(e, "UIText");
            if (t) t.text = Texts.title;
        }

        {
            const e = this.uiRefs.levelName;
            const t = this.world.getComponent(e, "UIText");
            if (t) t.text = Texts.levelName(levelConfig.id, levelConfig.name);
        }

        {
            const e = this.uiRefs.bpm;
            const t = this.world.getComponent(e, "UIText");
            if (t) t.text = Texts.bpm(levelConfig.bpm);
        }

        if (score) this._applyHitsAndScore(score);

        {
            const resultEnt = this.uiRefs.result;
            const hintEnt = this.uiRefs.hint;

            const tResult = this.world.getComponent(resultEnt, "UIText");
            const tHint = this.world.getComponent(hintEnt, "UIText");

            if (tHint) tHint.alpha = 0;
            if (tResult) tResult.alpha = 0;
        }
    }

    _applyHitsAndScore(score) {
        {
            const e = this.uiRefs.hits;
            const t = this.world.getComponent(e, "UIText");
            if (t) t.text = Texts.hits(score.totalHits, score.totalNotes);
        }

        {
            const e = this.uiRefs.score;
            const t = this.world.getComponent(e, "UIText");
            if (t) t.text = Texts.score(score.score);
        }
    }

    updateScoreUI() {
        const score = this.score;
        if (!score) return;

        this._applyHitsAndScore(score);

        const comboEnt = this.uiRefs.combo;
        const t = this.world.getComponent(comboEnt, "UIText");
        const anim = this.world.getComponent(comboEnt, "UITextAnimation");

        if (score.comboPopupTimer > 0 && score.combo >= ScoreConstants.COMBO_MIN_FOR_POPUP) {
            if (t) {
                t.text = Texts.combo(score.combo);
                t.alpha = 1;
            }
            if (anim && !anim.active) {
                anim.timer = 0;
                anim.active = true;
            }
        } else {
            if (t) t.alpha = 0;
        }

        const wrongEnt = this.uiRefs.wrong;
        if (wrongEnt != null) {
            const tWrong = this.world.getComponent(wrongEnt, "UIText");
            const animWrong = this.world.getComponent(wrongEnt, "UITextAnimation");

            if (score.wrongPopupTimer > 0) {
                if (tWrong) {
                    tWrong.text = Texts.wrong;
                    tWrong.alpha = 1;
                }
                if (animWrong && !animWrong.active) {
                    animWrong.timer = 0;
                    animWrong.active = true;
                }
            } else {
                if (tWrong) tWrong.alpha = 0;
            }
        }

        const holdEnt = this.uiRefs.hold;
        if (holdEnt != null) {
            const t = this.world.getComponent(holdEnt, "UIText");
            const anim = this.world.getComponent(holdEnt, "UITextAnimation");

            if (score.holdPopupTimer > 0) {
                if (t) {
                    t.text = "HOLD";
                    t.alpha = 1;
                }
                if (anim && !anim.active) {
                    anim.timer = 0;
                    anim.active = true;
                }
            } else {
                if (t) t.alpha = 0;
            }
        }
    }

    update(_world, _tick) {}
}
