import {Shiit} from "../shiitake/target/Shiitake.js";
import {DisplayCfg} from "./src/cfg/DisplayConfig.js";
import {SceneCfg, SceneEntities} from "./src/cfg/SceneConfig.js";
import {Levels} from "./src/cfg/Levels.js";
import {UIElements} from "./src/cfg/UIConfig.js";
import {Actions} from "./src/cfg/GameConfig.js";
import {createUIEntityFromConfig} from "./src/ecs/UIFactory.js";
import {createSceneEntityFromConfig} from "./src/ecs/EntityFactory.js";

import {ScoreComponent} from "./src/ecs/components/ScoreComponent.js";
import {GameStateComponent} from "./src/ecs/components/GameStateComponent.js";

import {ScoreSystem} from "./src/ecs/systems/ScoreSystem.js";
import {RhythmSystem} from "./src/ecs/systems/RhythmSystem.js";
import {UIRenderSystem} from "./src/ecs/systems/UIRenderSystem.js";
import {UITextAnimationSystem} from "./src/ecs/systems/UITextAnimationSystem.js";
import {UIScoreSyncSystem} from "./src/ecs/systems/UIScoreSyncSystem.js";
import {GameFlowSystem} from "./src/ecs/systems/GameFlowSystem.js";
import {Game} from "./src/ecs/Game.js";
import {MaterialsCfg} from "./src/cfg/MaterialsConfig.js";

async function main() {
    const uiDisplay = new Shiit.Canvas2DDisplay(window, "ui-canvas", {
        designWidth: DisplayCfg.size.w,
        designHeight: DisplayCfg.size.h,
        autoResize: true,
    });
    uiDisplay.init();

    const loader = Shiit.ShiitakeLoadingOverlay.logo(
        ["Engine initialization", "Loading resources", "Scene creation"],
        uiDisplay
    );
    loader.setStage(0, 0);

    const gameDisplay = new Shiit.WebGLDisplay(window, "game-canvas", {
        designWidth: DisplayCfg.size.w,
        designHeight: DisplayCfg.size.h,
        autoResize: true,
    });
    gameDisplay.init();

    const render = new Shiit.Render(gameDisplay.gl);
    render.initWebGL(Shiit.TEXTURE_VERTEX_SHADER, Shiit.TEXTURE_FRAGMENT_SHADER);

    const resources = new Shiit.ResourceManager(gameDisplay.gl);
    const world = new Shiit.World();

    const events = new Shiit.EventBus();

    const scoreEntityId = world.createEntity("Score");
    world.addComponent(scoreEntityId, "Score", new ScoreComponent());

    const gameStateEntityId = world.createEntity("GameState");
    world.addComponent(gameStateEntityId, "GameState", new GameStateComponent(Levels.length));

    const inputMap = new Shiit.InputMap();
    inputMap.bind(Actions.HIT, [Shiit.KEYS.SPACE, Shiit.MOUSE.LEFT]);
    const input = new Shiit.InputManager(inputMap, {
        keyboardTarget: window,
        mouseTarget: window,
        touchTarget: gameDisplay.canvas,
    });

    const audio = new Shiit.AudioManager();

    const textures = SceneCfg.texturePack();
    const sounds = SceneCfg.audioPack();

    loader.setStage(1, 0);

    const assetPromises = [
        resources.loadTexture("background", textures.background),
        resources.loadTexture("cookie", textures.character),
        resources.loadTexture("progress", textures.progress),
        resources.loadTexture("note", textures.note),
        resources.loadTexture("bomb", textures.note),
        resources.loadTexture("shadow", textures.shadow),
        resources.loadTexture("sunlight", "assets/img/sunlight.png"),
        resources.loadSpriteMaterial(MaterialsCfg.spriteMaterials()[0]),
        resources.loadSpriteMaterial(MaterialsCfg.spriteMaterials()[1]),
        resources.loadSpriteMaterial(MaterialsCfg.spriteMaterials()[2]),
        resources.loadSpriteMaterial(MaterialsCfg.spriteMaterials()[3]),
        audio.loadSound("hit", sounds.hit),
        audio.loadSound("miss", sounds.miss),
        audio.loadSound("slowSpacey", sounds.slowSpacey),
        audio.loadSound("funkDisco", sounds.funkDisco),
        audio.loadSound("rockIsh", sounds.rockIsh),
        audio.loadSound("background", sounds.background),
        audio.loadSound("wow2", sounds.wow2),
        audio.loadSound("bow2", sounds.bow2),
        audio.loadSound("finishLose", sounds.finishLose),
        audio.loadSound("finishWin", sounds.finishWin),
        audio.loadSound("wrong", sounds.wrong),
        audio.loadSound("hold", sounds.hold),
        await Promise.all([
            document.fonts.load('90px "MainMenuFont"'),
            document.fonts.load('90px "WowMenuFont"'),
        ]),
    ];

    let loadedCount = 0;
    const totalAssets = assetPromises.length;

    const wrappedPromises = assetPromises.map((p) =>
        Promise.resolve(p).then((res) => {
            loadedCount++;
            loader.setStage(1, loadedCount / totalAssets);
            return res;
        })
    );

    await Promise.all(wrappedPromises);

    loader.setStage(2, 0);

    const soundRefs = {};
    let cookieId = null;
    let cookieShadowId = null;
    let progressId = null;

    for (const cfg of SceneEntities) {
        const id = createSceneEntityFromConfig(world, resources, cfg);

        if (cfg.refKey === "cookie") {
            cookieId = id;
        } else if (cfg.refKey === "cookieShadow") {
            cookieShadowId = id;
        } else if (cfg.refKey === "progressBar") {
            progressId = id;
        } else if (cfg.type === "sound" && cfg.refKey) {
            soundRefs[cfg.refKey] = id;
        }
    }

    const uiEntities = [];
    const animatedUIEntities = [];
    const uiRefs = {};
    const overlayRefs = {};

    for (const cfg of UIElements) {
        const uiEntity = createUIEntityFromConfig(world, cfg);
        uiEntities.push(uiEntity);
        uiRefs[cfg.key] = uiEntity;

        if (cfg.animation) animatedUIEntities.push(uiEntity);

        if (cfg.key === "overlayMain") overlayRefs.main = uiEntity;
        else if (cfg.key === "overlaySub") overlayRefs.sub = uiEntity;
    }

    const animationSystem = new Shiit.AnimationSystem();
    const renderSystem = new Shiit.RenderSystem(resources, render);

    const scoreSystem = new ScoreSystem(world, scoreEntityId, gameStateEntityId, progressId, events, soundRefs);
    const rhythmSystem = new RhythmSystem(
        world,
        resources,
        input,
        audio,
        cookieId,
        cookieShadowId,
        progressId,
        events,
        gameStateEntityId,
        scoreEntityId,
        soundRefs
    );

    const uiScoreSyncSystem = new UIScoreSyncSystem(world, scoreEntityId, gameStateEntityId, uiRefs, events);
    const uiTextAnimationSystem = new UITextAnimationSystem(world, animatedUIEntities);
    const uiCanvasSystem = new UIRenderSystem(uiDisplay, world, uiEntities, gameStateEntityId);

    const gameFlowSystem = new GameFlowSystem(world, input, scoreEntityId, gameStateEntityId, events, overlayRefs, uiRefs);

    const soundSystem = new Shiit.SoundSystem(audio);

    const game = new Game(
        world,
        input,
        [gameFlowSystem, rhythmSystem, animationSystem, scoreSystem, uiScoreSyncSystem, uiTextAnimationSystem, soundSystem],
        [renderSystem, uiCanvasSystem]
    );

    const loop = new Shiit.RafGameLoop(game, 60);
    loop.run();

    loader.setStage(2, 1);
}

main().catch((e) => {
    console.error(e);
});