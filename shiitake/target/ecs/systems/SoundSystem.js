import { AbstractSystem } from "../AbstractSystem.js";
export class SoundSystem extends AbstractSystem {
    constructor(audioManager) {
        super("SoundSystem", 500);
        this.audioManager = audioManager;
    }
    update(world, tick) {
        const ids = world.queryByComponentsIds("Sound");
        for (const id of ids) {
            const sound = world.getComponent(id, "Sound");
            if (!sound) {
                continue;
            }
            switch (sound.mode) {
                case "loop": {
                    if (sound.active && !sound.playing) {
                        this.audioManager.playSound(sound.soundName, true, sound.volume);
                        sound.playing = true;
                    }
                    if (!sound.active && sound.playing) {
                        this.audioManager.stopSound(sound.soundName);
                        sound.playing = false;
                    }
                    break;
                }
                case "oneShot":
                default: {
                    if (sound.active) {
                        this.audioManager.playSound(sound.soundName, false, sound.volume);
                        sound.active = false;
                    }
                    break;
                }
            }
        }
    }
}
