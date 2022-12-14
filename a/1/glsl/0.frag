precision highp float;
const int n_light = 2;
uniform vec3 u_back;
uniform mat4 u_material;
uniform sampler2D u_sampler;
uniform float u_texture;
varying vec3 v_pos, v_nor, v_color;
varying vec2 v_uv;
uniform vec3 u_light_direct[n_light], u_light_color[n_light];
vec3 sky_color = vec3(0.6, 0.75, 0.95);
uniform float u_time;
float focal_length = 3.;
void main()
{
   vec3 n = normalize(v_nor);
   vec3 ambient = u_material[0].rgb;
   vec3 diffuse = u_material[1].rgb;
   vec3 specular = u_material[2].rgb;
   float p = u_material[2].a;
   vec3 c = mix(ambient, u_back, .3);
   for (int l = 0 ; l < n_light ; ++l)
   {
      vec3 r = 2. * dot(n, u_light_direct[l]) * n - u_light_direct[l];
      c += u_light_color[l] * (diffuse * max(0.,dot(n, u_light_direct[l]))
                  + specular * pow(max(0., r.z), p));
   }
   vec4 texture = texture2D(u_sampler, v_uv);
   c *= mix(v_color, texture.rgb, texture.a * u_texture);
   gl_FragColor = vec4(c, 1.);
}