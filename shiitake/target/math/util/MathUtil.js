export class MathUtil {
    static distance(from, to) {
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
