export class RhythmNoteComponent {
    constructor(hitTime) {
        this.hitTime = hitTime;
        this.hit = false;
        this.missed = false;
        this.isBomb = false;
    }
}
