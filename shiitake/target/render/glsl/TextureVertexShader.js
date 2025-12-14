import { ShaderType } from "../ShaderType.js";
export const TEXTURE_VERTEX_SHADER = {
    type: ShaderType.VERTEX,
    source: `
        attribute vec4 a_position;
        attribute vec2 a_coord;
        
        varying vec2 v_coord;
        
        uniform vec4 u_frame;
        uniform mat4 u_model;
        uniform mat4 u_view;
        uniform mat4 u_projection;
        
        void main() {
           gl_Position = u_projection * u_view * u_model * a_position;
           v_coord = a_coord * u_frame.zw + u_frame.xy;
        }
    `
};
