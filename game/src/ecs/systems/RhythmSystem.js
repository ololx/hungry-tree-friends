import {Shiit} from "../../../../shiitake/target/Shiitake.js";
import {DisplayCfg} from "../../cfg/DisplayConfig.js";
import {EntitiesCfg} from "../../cfg/EntitiesConfig.js";
import {Levels} from "../../cfg/Levels.js";
import {Actions, Events, RhythmConstants, BombConstants} from "../../cfg/GameConfig.js";
import {AudioConfig} from "../../cfg/AudioConfig.js";
import {NoteSpawner} from "../NoteSpawner.js";
import {RhythmNoteComponent} from "../components/RhythmNoteComponent.js";

export class RhythmSystem extends Shiit.AbstractSystem {
    constructor(world, resources, input, audio, cookieId, cookieShadowId, progressId, events, gameStateEntityId, scoreEntityId, soundRefs) {
        super("RhythmSystem", 200);
        this.world = world;
        this.resources = resources;
        this.input = input;
        this.audio = audio;
        this.events = events;
        this.gameStateEntityId = gameStateEntityId;
        this.scoreEntityId = scoreEntityId;
        this.soundRefs = soundRefs;
        this.HIT_ACTION = Actions.HIT;
        this.HIT_WINDOW = RhythmConstants.HIT_WINDOW;
        this.NOTE_SPAWN_LEAD = RhythmConstants.NOTE_SPAWN_LEAD;
        this.NOTE_DESPAWN_AFTER = RhythmConstants.NOTE_DESPAWN_AFTER;
        this.levels = [];
        this.levelTime = 0;
        this.cookiePulseTimer = 0;
        this.cookieId = cookieId;
        this.cookieAnimTimer = 0;
        this.cookieShadowId = cookieShadowId;
        this.progressId = progressId;
        this.minNotesBetweenBombs = BombConstants.MIN_NOTES_BETWEEN_BOMBS;
        this.notesSinceLastBomb = BombConstants.INITIAL_NOTES_SINCE_LAST_BOMB;

        this.noteSpawner = new NoteSpawner(world, resources);

        this.buildLevels();
        this.events.on(Events.LEVEL_START, this.onLevelStart.bind(this));
    }

    get score() {
        return this.world.getComponent(this.scoreEntityId, "Score");
    }

    get gameState() {
        return this.world.getComponent(this.gameStateEntityId, "GameState");
    }

    get currentLevelIndex() {
        const gs = this.gameState;
        return gs ? (gs.currentLevelIndex ?? 0) : 0;
    }

    get currentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    _triggerSound(refKey) {
        const id = this.soundRefs?.[refKey];
        if (!id) return;
        const c = this.world.getComponent(id, "Sound");
        if (!c) return;
        c.active = true;
    }

    setCookieAnim(name, duration = 0) {
        Shiit.setAnimation(this.world, this.cookieId, name);
        this.cookieAnimTimer = duration;
    }

    buildLevels() {
        this.levels = Levels.map((cfg) => {
            const beatLen = 60 / cfg.bpm;
            const introBeats = cfg.introBeats || 0;
            const introSec = introBeats * beatLen;
            const hits = cfg.hitsBeats || [];
            const notes = [];

            for (const beatPos of hits) {
                const t = beatLen * beatPos;
                if (t <= introSec) continue;

                notes.push({
                    config: new RhythmNoteComponent(t),
                    entityId: null,
                    shadowId: null,
                    spawned: false,
                });
            }

            const lastBeat = hits.length ? introBeats + hits[hits.length - 1] : introBeats;
            const durationBeats = cfg.durationBeats || (lastBeat + 4);
            const durationSec = durationBeats * beatLen;

            return {
                config: {
                    ...cfg,
                    introOffset: introSec,
                    duration: durationSec,
                },
                notes,
            };
        });
    }

    onLevelStart({levelIndex}) {
        const gs = this.gameState;
        const idx = typeof levelIndex === "number" ? levelIndex : this.currentLevelIndex;

        const level = this.levels[idx];
        this.levelTime = 0;

        for (const l of this.levels) {
            for (const n of l.notes) {
                if (n.entityId != null) {
                    this.world.destroyEntity(n.entityId);
                    n.entityId = null;
                }
                if (n.shadowId != null) {
                    this.world.destroyEntity(n.shadowId);
                    n.shadowId = null;
                }
                n.config.hit = false;
                n.config.missed = false;
                n.config.isBomb = false;
                n.spawned = false;
            }
        }

        this.events.emit(Events.SCORE_RESET_FOR_LEVEL, {
            totalNotes: level.notes.length,
        });

        this.notesSinceLastBomb = this.minNotesBetweenBombs;

        this.playLevelMusic();
    }

    spawnNote(runtimeNote) {
        if (runtimeNote.spawned) return;

        const isBomb = this.maybeConvertNoteToBomb(runtimeNote);
        const {noteId, shadowId} = this.noteSpawner.spawnNote({
            noteComponent: runtimeNote.config,
            isBomb,
        });

        runtimeNote.entityId = noteId;
        runtimeNote.shadowId = shadowId;
        runtimeNote.spawned = true;
    }

    maybeConvertNoteToBomb(runtimeNote) {
        const score = this.score;

        if (!score) {
            this.notesSinceLastBomb++;
            return false;
        }

        if (this.notesSinceLastBomb < this.minNotesBetweenBombs) {
            this.notesSinceLastBomb++;
            return false;
        }

        const percent = score.accuracyPercent ?? 0;

        if (percent <= BombConstants.MIN_ACCURACY_FOR_BOMBS) {
            this.notesSinceLastBomb++;
            return false;
        }

        if (Math.random() > BombConstants.BOMB_SPAWN_CHANCE) {
            this.notesSinceLastBomb++;
            return false;
        }

        runtimeNote.config.isBomb = true;
        this.notesSinceLastBomb = 0;

        return true;
    }

    getSongTime() {
        const level = this.currentLevel;
        const songKey = level.config.tag;
        const t = this.audio.getCurrentTime(songKey);
        if (typeof t === "number" && !Number.isNaN(t)) return t;
        return this.levelTime;
    }

    getBeatPhase(level) {
        const bpm = level.config.bpm;
        if (!bpm) return 0;

        const beatLen = 60 / bpm;
        const songTime = this.getSongTime();
        const intro = level.config.introOffset || 0;
        const beatPos = (songTime - intro) / beatLen;
        const pulseCfg = level.config.pulse || {};
        const subdivision = pulseCfg.subdivision || 1;
        return beatPos * subdivision;
    }

    updateNotes() {
        const level = this.currentLevel;
        const intro = level.config.introOffset || 0;
        const pulseCfg = level.config.pulse || {};
        const pulseEnabled = pulseCfg.enabled ?? true;
        const pulseAmp = pulseCfg.amplitude ?? 0.15;

        let pulseScale = 1;
        if (pulseEnabled) {
            const phase = this.getBeatPhase(level);
            const pulse = (Math.sin(phase * 2 * Math.PI) + 1) / 2;
            pulseScale = 1 + pulse * pulseAmp;
        }

        const songTime = this.getSongTime();

        for (const runtimeNote of level.notes) {
            const note = runtimeNote.config;

            if (note.hitTime < intro) {
                note.hit = true;
                continue;
            }

            const spawnTime = note.hitTime - this.NOTE_SPAWN_LEAD;
            const effectiveSpawnTime = Math.max(spawnTime, intro);
            const now = songTime;

            if (!runtimeNote.spawned && now >= effectiveSpawnTime) {
                this.spawnNote(runtimeNote);
            }

            if (!runtimeNote.spawned || runtimeNote.entityId == null) {
                continue;
            }

            const tr = this.world.getComponent(runtimeNote.entityId, "Transform");
            if (!tr) {
                continue;
            }

            const startX = EntitiesCfg.note.spawnPos.x;
            const targetX = EntitiesCfg.note.hitPos.x;

            if (note.isBomb) {
                const exitX = -tr.size.w;
                const preTime = note.hitTime - effectiveSpawnTime;
                const postTime = this.NOTE_DESPAWN_AFTER;

                if (now <= note.hitTime) {
                    const t = preTime > 0 ? Math.min(Math.max((now - effectiveSpawnTime) / preTime, 0), 1) : 1;
                    tr.position.x = startX + (targetX - startX) * t;
                } else {
                    const t = postTime > 0 ? Math.min(Math.max((now - note.hitTime) / postTime, 0), 1) : 1;
                    tr.position.x = targetX + (exitX - targetX) * t;
                }
            } else {
                const noteLifetime = note.hitTime - now;
                const progress = 1 - Math.min(Math.max(noteLifetime / this.NOTE_SPAWN_LEAD, 0), 1);
                tr.position.x = startX + (targetX - startX) * progress;
            }

            tr.position.y = EntitiesCfg.note.spawnPos.y;
            tr.scale.x = pulseScale;
            tr.scale.y = pulseScale;

            if (runtimeNote.shadowId != null) {
                const shadowTr = this.world.getComponent(runtimeNote.shadowId, "Transform");
                if (shadowTr) {
                    const centerX = DisplayCfg.size.w / 2;
                    const shadowOffsetY = 500;
                    const dx = tr.position.x - centerX;
                    const lightInfluence = 0.3;
                    const dynamicOffsetX = dx * lightInfluence;
                    const baseShadowScale = 0.7;
                    const maxDist = DisplayCfg.size.w / 2;
                    const distNorm = Math.min(Math.abs(dx) / maxDist, 1);
                    const maxExtraScale = 0.4;
                    const stretchX = 1 + distNorm * maxExtraScale;
                    const stretchY = 1 + distNorm * (maxExtraScale * 0.5);

                    shadowTr.position.x = tr.position.x + dynamicOffsetX;
                    shadowTr.position.y = tr.position.y + shadowOffsetY;

                    shadowTr.scale.x = tr.scale.x * baseShadowScale * stretchX;
                    shadowTr.scale.y = tr.scale.y * baseShadowScale * stretchY;
                }
            }

            if (note.isBomb) {
                if (!note.hit && !note.missed && tr.position.x <= -tr.size.w) {
                    note.hit = true;

                    this.events.emit(Events.NOTE_HIT, {
                        songTime: now,
                        noteTime: note.hitTime,
                        isBomb: true,
                    });

                    this.cookiePulseTimer = RhythmConstants.COOKIE_PULSE_DURATION;

                    this.world.destroyEntity(runtimeNote.entityId);
                    runtimeNote.entityId = null;

                    if (runtimeNote.shadowId != null) {
                        this.world.destroyEntity(runtimeNote.shadowId);
                        runtimeNote.shadowId = null;
                    }
                }
            } else {
                if (!note.hit && !note.missed && now > note.hitTime + this.HIT_WINDOW) {
                    note.missed = true;
                    this.events.emit(Events.NOTE_MISS, {
                        songTime: now,
                        noteTime: note.hitTime,
                    });
                    this.playMiss();
                }

                if (this.levelTime > note.hitTime + this.NOTE_DESPAWN_AFTER) {
                    this.world.destroyEntity(runtimeNote.entityId);
                    runtimeNote.entityId = null;

                    if (runtimeNote.shadowId != null) {
                        this.world.destroyEntity(runtimeNote.shadowId);
                        runtimeNote.shadowId = null;
                    }
                }
            }
        }
    }

    handleHitAttempt() {
        const level = this.currentLevel;
        let bestRuntime = null;
        let bestDelta = Infinity;
        const now = this.getSongTime();

        for (const runtimeNote of level.notes) {
            if (!runtimeNote.spawned || runtimeNote.entityId == null) {
                continue;
            }

            const note = runtimeNote.config;
            if (note.hit || note.missed) continue;

            const dt = Math.abs(now - note.hitTime);

            if (dt <= this.HIT_WINDOW && dt < bestDelta) {
                bestDelta = dt;
                bestRuntime = runtimeNote;
            }
        }

        if (!bestRuntime) {
            this.events.emit(Events.NOTE_MISS, {
                songTime: now,
                noteTime: null,
            });
            this.playMiss();
            return;
        }

        const note = bestRuntime.config;

        if (note.isBomb) {
            note.missed = true;
            this.events.emit(Events.NOTE_MISS, {
                songTime: now,
                noteTime: note.hitTime,
                isBomb: true,
            });
            this.playMiss();
        } else {
            note.hit = true;
            this.events.emit(Events.NOTE_HIT, {
                songTime: now,
                noteTime: note.hitTime,
            });
            this.cookiePulseTimer = RhythmConstants.COOKIE_PULSE_DURATION;
            this.playHit();
        }

        if (bestRuntime.entityId != null) {
            this.world.destroyEntity(bestRuntime.entityId);
            bestRuntime.entityId = null;
        }
        if (bestRuntime.shadowId != null) {
            this.world.destroyEntity(bestRuntime.shadowId);
            bestRuntime.shadowId = null;
        }
    }

    updateCookiePulse(world, dt) {
        const cookieTransform = world.getComponent(this.cookieId, "Transform");
        if (!cookieTransform) return;

        const shadowTransform = this.cookieShadowId != null ? world.getComponent(this.cookieShadowId, "Transform") : null;
        const shadowCfg = EntitiesCfg.playerShadow;

        if (this.cookiePulseTimer <= 0) {
            this.cookiePulseTimer = 0;
            cookieTransform.scale.x = 1;
            cookieTransform.scale.y = 1;

            if (shadowTransform && shadowCfg) {
                shadowTransform.position.x = cookieTransform.position.x + (shadowCfg.offset?.x ?? 0);
                shadowTransform.position.y = cookieTransform.position.y + (shadowCfg.offset?.y ?? 0);

                const baseScaleX = shadowCfg.baseScale?.x ?? 1;
                const baseScaleY = shadowCfg.baseScale?.y ?? 1;
                const squashY = shadowCfg.squashY ?? 1;

                shadowTransform.scale.x = baseScaleX;
                shadowTransform.scale.y = baseScaleY * squashY;
            }

            return;
        }

        this.cookiePulseTimer -= dt;
        const tNorm = 1 - this.cookiePulseTimer / RhythmConstants.COOKIE_PULSE_DURATION;
        const amp = RhythmConstants.COOKIE_PULSE_AMP;
        const s = 1 + Math.sin(tNorm * Math.PI) * amp;

        cookieTransform.scale.x = s;
        cookieTransform.scale.y = s;

        if (shadowTransform && shadowCfg) {
            shadowTransform.position.x = cookieTransform.position.x + (shadowCfg.offset?.x ?? 0);
            shadowTransform.position.y = cookieTransform.position.y + (shadowCfg.offset?.y ?? 0);

            const baseScaleX = shadowCfg.baseScale?.x ?? 1;
            const baseScaleY = shadowCfg.baseScale?.y ?? 1;
            const pulseAmp = shadowCfg.pulseAmp ?? 0.25;
            const squashY = shadowCfg.squashY ?? 1;

            const shadowPulse = 1 + Math.sin(tNorm * Math.PI) * pulseAmp;

            shadowTransform.scale.x = baseScaleX * shadowPulse;
            shadowTransform.scale.y = baseScaleY * (2 - shadowPulse) * squashY;
        }
    }

    playHit() {
        this._triggerSound("hit");
        this.setCookieAnim("hit", RhythmConstants.COOKIE_PULSE_DURATION);
    }

    playMiss() {
        this._triggerSound("miss");
        this.setCookieAnim("miss", RhythmConstants.COOKIE_PULSE_DURATION);
    }

    playLevelMusic() {
        const level = this.currentLevel;
        const id = this.soundRefs?.levelMusic;
        if (!id) return;
        const c = this.world.getComponent(id, "Sound");
        if (!c) return;

        c.soundName = level.config.tag;
        c.mode = "loop";
        c.volume = AudioConfig.levelMusicVolume;
        c.fadeMs = AudioConfig.levelMusicFadeMs || 0;
        c.active = true;
    }

    finishCurrentLevel() {
        const idx = this.currentLevelIndex;
        const level = this.levels[idx];
        const isLast = idx === this.levels.length - 1;

        this.events.emit(Events.LEVEL_FINISHED, {
            levelIndex: idx,
            isLast,
            totalNotes: level.notes.length,
        });

        const id = this.soundRefs?.levelMusic;
        if (id) {
            const c = this.world.getComponent(id, "Sound");
            if (c) c.active = false;
        }

        this.setCookieAnim("idle");
    }

    update(world, tick) {
        const dt = tick.deltaTime || 0;
        const gs = this.gameState;
        if (!gs) return;

        if (gs.phase !== "playing" || !gs.isRunning) {
            this.updateCookiePulse(world, dt);
            return;
        }

        if (this.input.consumeActionPressed(this.HIT_ACTION)) {
            this.handleHitAttempt();
        }

        this.levelTime += dt;
        this.updateNotes();
        this.updateCookiePulse(world, dt);

        const level = this.currentLevel;
        if (this.levelTime >= level.config.duration) {
            this.finishCurrentLevel();
        }

        if (this.cookieAnimTimer > 0) {
            this.cookieAnimTimer -= dt;
            if (this.cookieAnimTimer <= 0) {
                this.setCookieAnim("idle");
            }
        }
    }
}
