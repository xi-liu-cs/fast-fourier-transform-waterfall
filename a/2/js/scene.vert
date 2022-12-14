attribute vec3 aPos, aNor, a_color;
attribute vec2 aUV;
uniform mat4 uMatrix, uInvMatrix, uProject;
varying vec3 vPos, vNor, v_color;
varying vec2 vUV;  

void main()
{
    vPos = (uProject * uMatrix * vec4(aPos, 1.)).xyz;
    vNor = (vec4(aNor, 0.) * uInvMatrix).xyz;
    vUV = aUV;
    v_color = a_color;
    gl_Position = vec4(vPos.xy, -.01 * vPos.z, 1.);
}