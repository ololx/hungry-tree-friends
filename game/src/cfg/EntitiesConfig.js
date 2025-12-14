import {DisplayCfg} from "./DisplayConfig.js";

export const EntitiesCfg = {
    player: {
        size: {w: 350, h: 350},
        position: {
            x: DisplayCfg.size.w * 0.3802083,
            y: DisplayCfg.size.h * 0.4833333,
        },
        z: 0.4,
        pivot: {x: 0.5, y: 0.5},
        animations: {
            idle: {frames: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], duration: 0.36},
            hit: {frames: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], duration: 0.06},
            miss: {frames: [[0, 2], [1, 2], [2, 2], [3, 2]], duration: 0.075},
        },
        sheet: {
            rows: 3,
            cols: 5,
        },
    },

    playerShadow: {
        size: {w: 350, h: 350},

        offset: {
            x: -50,
            y: 170,
        },

        z: 0.39,

        baseScale: {x: 1, y: 1.2},

        pulseAmp: 0.25,
        squashY: 0.7,
    },

    note: {
        size: {w: 96, h: 96},
        spawnPos: {
            x: DisplayCfg.size.w + 96,
            y: DisplayCfg.size.h * 0.4166667,
        },
        hitPos: {
            x: DisplayCfg.size.w * 0.4166667,
            y: DisplayCfg.size.h * 0.4166667,
        },
    },

    background: {
        z: 0,
        pivot: {x: 0.5, y: 0.5},
    },

    sunlight: {
        z: 0.9,
        pivot: {x: 0.5, y: 0.9},
        scale: {x: 1, y: 1},
    },

    progressBar: {
        size: {
            w: DisplayCfg.size.w,
            h: 160,
        },
        position: {
            x: DisplayCfg.size.w / 2,
            y: 1100,
        },
        z: 0.5,
        pivot: {x: 0.5, y: 0.5},

        animations: {
            hungry: {frames: [[0, 0]], duration: 1},
            quoter: {frames: [[1, 0]], duration: 1},
            half: {frames: [[1, 1]], duration: 1},
            full: {frames: [[0, 1]], duration: 1},
        },
        sheet: {
            rows: 2,
            cols: 2,
        },
    },
};
