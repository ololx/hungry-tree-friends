import { Textures, Sounds } from "./Assets.js";
import { CameraCfg }   from "./CameraConfig.js";
import { EntitiesCfg } from "./EntitiesConfig.js";
import { AudioConfig } from "./AudioConfig.js";

export const SceneCfg = {

    texturePack: () => {
        const keys = ["frog", "owl", "cat", "panda"];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];

        return {
            background: Textures.background[randomKey],
            character: Textures.character[randomKey],
            note: Textures.note[randomKey],
            progress: Textures.progress[randomKey] !== undefined ? Textures.progress[randomKey] : Textures.progress.default,
            shadow: Textures.shadow[randomKey] !== undefined ? Textures.shadow[randomKey] : Textures.shadow.default,
        };
    },

    audioPack: () => {
        return Sounds;
    },
};

export const SceneEntities = [
    {
        name: "Camera",
        type: "camera",

        components: [
            {
                type: "Camera",
                config: () => ({
                    size: CameraCfg.size,
                    scale: CameraCfg.transform.scale,
                    rotation: CameraCfg.transform.rotation,
                }),
            },
            {
                type: "Transform",
                config: () => ({
                    position: CameraCfg.position,
                    z: CameraCfg.transform.z,
                    rotation: CameraCfg.transform.rotation,
                    scale: CameraCfg.transform.scale,
                    size: CameraCfg.size,
                }),
            },
        ],
    },

    {
        name: "Background",
        type: "background",
        textureName: "background",

        components: [
            {
                type: "Transform",
                needsTexture: true,
                config: ({ tex }) => {
                    const texSize = tex.size;
                    const camSize = CameraCfg.size;
                    const camPos  = CameraCfg.position;
                    const { z }   = EntitiesCfg.background;

                    const scaleX = camSize.w / texSize.w;
                    const scaleY = camSize.h / texSize.h;

                    return {
                        position: camPos,
                        z,
                        rotation: 0,
                        scale: { x: scaleX, y: scaleY },
                        size: texSize,
                    };
                },
            },
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex }) => {
                    const texSize = tex.size;
                    return {
                        textureName: "background",
                        size: texSize,
                        frame: { x: 0, y: 0, w: texSize.w, h: texSize.h },
                        pivot: EntitiesCfg.background.pivot,
                    };
                },
            },
        ],
    },

    {
        name: "Sunlight",
        type: "sunlight",
        textureName: "sunlight",

        components: [
            {
                type: "Transform",
                config: () => {
                    const { position: camPos, size: camSize } = CameraCfg;
                    const { z, scale } = EntitiesCfg.sunlight;

                    return {
                        position: camPos,
                        z,
                        rotation: 0,
                        scale,
                        size: camSize,
                    };
                },
            },
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex }) => {
                    const texSize = tex.size;
                    return {
                        textureName: "sunlight",
                        size: texSize,
                        frame: { x: 0, y: 0, w: texSize.w, h: texSize.h },
                        pivot: EntitiesCfg.sunlight.pivot,
                    };
                },
            },
        ],
    },

    {
        name: "Cookie",
        type: "cookie",
        refKey: "cookie",
        textureName: "cookie",

        components: [
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex }) => {
                    const texSize = tex.size;
                    const { pivot } = EntitiesCfg.player;

                    return {
                        textureName: "cookie",
                        size: texSize,
                        frame: { x: 0, y: 0, w: texSize.w, h: texSize.h },
                        pivot,
                    };
                },
            },
            {
                type: "Transform",
                config: () => {
                    const {
                        size: logicalSize,
                        position: playerPos,
                        z,
                    } = EntitiesCfg.player;

                    return {
                        position: playerPos,
                        z,
                        rotation: 0,
                        scale: { x: 1, y: 1 },
                        size: logicalSize,
                    };
                },
            },
            {
                type: "Animation",
                needsTexture: true,
                config: ({ tex }) => {
                    const { animations, sheet } = EntitiesCfg.player;

                    return {
                        animations,
                        frameSize: tex.size,
                        rows: sheet.rows,
                        cols: sheet.cols,
                        defaultState: "idle",
                    };
                },
            },
        ],
    },

    {
        name: "CookieShadow",
        type: "cookieShadow",
        refKey: "cookieShadow",
        textureName: "shadow",

        components: [
            {
                type: "Transform",
                config: () => {
                    const playerCfg = EntitiesCfg.player;
                    const shadowCfg = EntitiesCfg.playerShadow;

                    const pos = {
                        x: playerCfg.position.x + (shadowCfg.offset?.x ?? 0),
                        y: playerCfg.position.y + (shadowCfg.offset?.y ?? 0),
                    };

                    const scale = {
                        x: shadowCfg.baseScale?.x ?? 1,
                        y: shadowCfg.baseScale?.y ?? 1,
                    };

                    const size = shadowCfg.size ?? playerCfg.size;

                    return {
                        position: pos,
                        z: shadowCfg.z ?? (playerCfg.z - 0.01),
                        rotation: 0,
                        scale,
                        size,
                    };
                },
            },
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex }) => {
                    const texSize = tex.size;
                    return {
                        textureName: "shadow",
                        size: texSize,
                        frame: { x: 0, y: 0, w: texSize.w, h: texSize.h },
                        pivot: { x: 0.5, y: 0.5 },
                        materialId: "shadow",
                    };
                },
            },
        ],
    },

    {
        name: "ProgressBar",
        type: "progressBar",
        refKey: "progressBar",
        textureName: "progress",

        components: [
            {
                type: "Sprite",
                needsTexture: true,
                config: ({ tex }) => {
                    const texSize = tex.size;
                    return {
                        textureName: "progress",
                        size: texSize,
                        frame: { x: 0, y: 0, w: texSize.w, h: texSize.h },
                        pivot: EntitiesCfg.progressBar.pivot,
                    };
                },
            },
            {
                type: "Transform",
                config: () => {
                    const {
                        size: logicalSize,
                        position: progressPos,
                        z,
                    } = EntitiesCfg.progressBar;

                    return {
                        position: progressPos,
                        z: z ?? 0.5,
                        rotation: 0,
                        scale: { x: 1, y: 1 },
                        size: logicalSize,
                    };
                },
            },
            {
                type: "Animation",
                needsTexture: true,
                config: ({ tex }) => {
                    const { animations, sheet } = EntitiesCfg.progressBar;

                    return {
                        animations,
                        frameSize: tex.size,
                        rows: sheet.rows,
                        cols: sheet.cols,
                        defaultState: "hungry",
                    };
                },
            },
        ],
    },

    {
        name: "BackgroundMusic",
        type: "sound",
        refKey: "background",
        sound: {
            soundName: "background",
            mode: "loop",
            active: true,
            volume: AudioConfig.backgroundLoopVolume,
            fadeMs: 0,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "LevelMusic",
        type: "sound",
        refKey: "levelMusic",
        sound: {
            soundName: "slowSpacey",
            mode: "loop",
            active: false,
            volume: AudioConfig.levelMusicVolume,
            fadeMs: AudioConfig.levelMusicFadeMs || 0,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "HitSound",
        type: "sound",
        refKey: "hit",
        sound: {
            soundName: "hit",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.hitVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "MissSound",
        type: "sound",
        refKey: "miss",
        sound: {
            soundName: "miss",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.missVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "WowSound",
        type: "sound",
        refKey: "wow",
        sound: {
            soundName: "wow2",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.wowVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "BowSound",
        type: "sound",
        refKey: "bow",
        sound: {
            soundName: "bow2",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.bowVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "FinishLoseSound",
        type: "sound",
        refKey: "finishLose",
        sound: {
            soundName: "finishLose",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.finishVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "FinishWinSound",
        type: "sound",
        refKey: "finishWin",
        sound: {
            soundName: "finishWin",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.finishVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "WrongSound",
        type: "sound",
        refKey: "wrong",
        sound: {
            soundName: "wrong",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.wrongVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },

    {
        name: "HoldSound",
        type: "sound",
        refKey: "hold",
        sound: {
            soundName: "hold",
            mode: "oneShot",
            active: false,
            volume: AudioConfig.holdVolume,
        },

        components: [
            {
                type: "Sound",
                config: ({ cfg }) => {
                    const s = cfg.sound || {};
                    return {
                        soundName: s.soundName,
                        mode:      s.mode,
                        active:    s.active,
                        volume:    s.volume,
                        fadeMs:    s.fadeMs,
                    };
                },
            },
        ],
    },
];

