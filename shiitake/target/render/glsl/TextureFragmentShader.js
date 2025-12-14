import { ShaderType } from "../ShaderType.js";
export const TEXTURE_FRAGMENT_SHADER = {
    type: ShaderType.FRAGMENT,
    source: `
        precision mediump float;

        varying vec2 v_coord;
        
        uniform sampler2D u_texture;
        uniform vec4 u_color;

        void main() {
            vec2 tiledCoord = vec2(fract(v_coord.x), v_coord.y);
            vec4 tex = texture2D(u_texture, tiledCoord);

            gl_FragColor = vec4(tex.rgb * u_color.rgb, tex.a * u_color.a);
        }
    `
};
