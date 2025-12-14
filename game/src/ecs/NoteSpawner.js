import {Prefabs} from "../cfg/Prefabs.js";
import {createSceneEntityFromConfig} from "./EntityFactory.js";
import {EntitiesCfg} from "../cfg/EntitiesConfig.js";

export class NoteSpawner {

    constructor(world, resources) {
        this.world = world;
        this.resources = resources;
    }

    spawnNote({noteComponent, isBomb}) {
        const textureName = isBomb ? "bomb" : "note";
        const materialId = isBomb ? "bomb" : undefined;
        const position = {...EntitiesCfg.note.spawnPos};
        const noteId = createSceneEntityFromConfig(this.world, this.resources, Prefabs.Note, {position, textureName, materialId, noteComponent,});
        const shadowId = createSceneEntityFromConfig(this.world, this.resources, Prefabs.NoteShadow, {position});

        return {noteId, shadowId};
    }

    despawn(noteId, shadowId) {
        if (noteId != null) {
            this.world.destroyEntity(noteId);
        }

        if (shadowId != null) {
            this.world.destroyEntity(shadowId);
        }
    }
}
