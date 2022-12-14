precision highp float;
varying vec3 v_pos;
void main()
{
    gl_FragColor = vec4(sqrt(v_pos), 1.);
}