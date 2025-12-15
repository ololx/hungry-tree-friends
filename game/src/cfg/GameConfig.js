export const Actions = {
    HIT: "HIT",
};

export const Events = {
    NOTE_HIT: "note:hit",
    NOTE_MISS: "note:miss",
    SCORE_RESET_FOR_LEVEL: "score:resetForLevel",
    LEVEL_FINISHED: "level:finished",
    LEVEL_START: "level:start",
    SCORE_CHANGED: "score:changed",
    GAME_STATE_CHANGED: "gameState:changed",
};

export const RhythmConstants = {
    HIT_WINDOW: 0.08,
    NOTE_SPAWN_LEAD: 0.8,
    NOTE_DESPAWN_AFTER: 0.4,
    COOKIE_PULSE_DURATION: 0.18,
    COOKIE_PULSE_AMP: 0.25,
};

export const ScoreConstants = {
    COMBO_MIN_FOR_POPUP: 2,
    DEFAULT_ACCURACY: -1,
    DEFAULT_ACCURACY_ANIM: "hungry",
    COMBO_POPUP_DURATION: 0.6,
    WRONG_POPUP_DURATION: 1,
    HOLD_POPUP_DURATION: 1,

    ACCURACY_STATES: [
        {min: 90, anim: "full", value: 1},
        {min: 60, anim: "half", value: 1},
        {min: 30, anim: "quoter", value: -1},
        {min: 0, anim: "hungry", value: -1},
    ],
};

export const BombConstants = {
    MIN_NOTES_BETWEEN_BOMBS: 3,
    INITIAL_NOTES_SINCE_LAST_BOMB: 9999,
    MIN_ACCURACY_FOR_BOMBS: 90,
    BOMB_SPAWN_CHANCE: 0.35,
};
