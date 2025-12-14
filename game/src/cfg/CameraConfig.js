import {DisplayCfg} from "./DisplayConfig.js";

export const CameraCfg = {
    size: {
        w: DisplayCfg.size.w,
        h: DisplayCfg.size.h,
    },
    position: {
        x: DisplayCfg.size.w / 2,
        y: DisplayCfg.size.h / 2,
    },
    transform: {
        z: 1,
        rotation: 0,
        scale: {x: 1, y: 1},
    },
};
