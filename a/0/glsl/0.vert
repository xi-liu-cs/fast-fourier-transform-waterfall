attribute vec3 a_pos;
varying vec3 v_pos;
void main()
{
    v_pos = a_pos;
    gl_Position = vec4(a_pos, 1.);
}