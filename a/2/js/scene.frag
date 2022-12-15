uniform vec3 uBgColor;
uniform vec3 uLd[nL];
uniform vec3 uLc[nL];
uniform mat4 uMaterial;

uniform sampler2D uSampler; /* index of the texture to be sampled */
uniform float uTexture;     /* are we rendering texture for this object? */

varying vec3 vPos, vNor, v_color;
varying vec2 vUV;

uniform vec3 u_light_direct[n_light], u_light_color[n_light];
vec3 sky_color = vec3(0.6, 0.75, 0.95);
uniform float u_time;
float focal_length = 3.;

void main()
{
   vec3 N = normalize(vNor);
   vec3  ambient  = uMaterial[0].rgb;
   vec3  diffuse  = uMaterial[1].rgb;
   vec3  specular = uMaterial[2].rgb;
   float p        = uMaterial[2].a;
   vec3 c = mix(ambient, uBgColor, .3);
   for (int l = 0 ; l < nL ; l++)
   {
      vec3 R = 2. * dot(N, uLd[l]) * N - uLd[l];
      c += uLc[l] * (diffuse * max(0.,dot(N, uLd[l]))
                  + specular * pow(max(0., R.z), p));
   }

   vec4 texture = texture2D(uSampler, vUV);
   c *= mix(v_color, texture.rgb, texture.a * uTexture);

   gl_FragColor = vec4(c, 1.);
}
