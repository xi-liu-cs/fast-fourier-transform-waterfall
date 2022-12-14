attribute vec3 a_pos, a_nor, a_color;
attribute vec2 a_uv;
uniform mat4 u_matrix, u_inverse, u_project;
varying vec3 v_pos, v_nor, v_color;
varying vec2 v_uv;  
void main()
{
    v_pos = (u_project * u_matrix * vec4(a_pos, 1.)).xyz;
    v_nor = (vec4(a_nor, 0.) * u_inverse).xyz;
    v_uv = a_uv;
    v_color = a_color;
    gl_Position = vec4(v_pos.xy, -.01 * v_pos.z, 1.);
}