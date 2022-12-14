precision highp float;
float noise(vec3 v)
{
   vec4 r[2];
   const mat4 E = mat4
   (
      0., 0., 0., 0.,
      0., .5, .5, 0.,
      .5, 0., .5, 0.,
      .5, .5, 0., 0.
   );
   for(int i = 0 ; i < 2 ; ++i)
   {
      for(int j = 0 ; j < 4 ; ++j)
      {
         vec3 p0 = .60 * v + E[j].xyz,
         c = floor(p0),
         p = p0 - c -.5,
         a = abs(p), d;
         c += mod(c.x + c.y + c.z + float(i), 2.) * step(max(a.yzx, a.zxy), a) * sign(p);
         d  = 314.1 * sin(59.2 * float(j + 4 * i) + 65.3 * c + 58.9 * c.yzx + 79.3 * c.zxy);
         p = p0 - c - .5;
         r[i][j] = dot(p, fract(d) - .5) * pow(max(0., 1. - 2. * dot(p, p)), 4.);
      }
   }
   return 6.50 * (r[0].x + r[0].y + r[0].z + r[0].w + r[1].x + r[1].y + r[1].z + r[1].w);
}