import { AbstractSystem } from "../AbstractSystem.js";
export class AudioSystem extends AbstractSystem {
    constructor(audioManager) {
        super("AudioSystem", 500);
        this.musicStarted = false;
        this.audioManager = audioManager;
    }
    update(world, tick) {
        const ids = world.queryByComponentsIds("AudioSource");
        for (const id of ids) {
            const audioSource = world.getComponent(id, "AudioSource");
            if (!audioSource)
                continue;
            if (audioSource.backgroundMusic && !this.musicStarted) {
                this.audioManager.playSound(audioSource.backgroundMusic, audioSource.loop, audioSource.volume);
                this.musicStarted = true;
            }
            for (const eventName of audioSource.playQueue) {
                const soundName = audioSource.sounds.get(eventName);
                if (soundName) {
                    this.audioManager.playSound(soundName, false, audioSource.volume);
                }
            }
            audioSource.playQueue = [];
        }
    }
}
