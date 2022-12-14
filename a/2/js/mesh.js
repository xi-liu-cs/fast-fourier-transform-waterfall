S.mat = 
[
   [.1,.1,.1,0,     .1,.1,.1,0,  1,1,1,5,    0,0,0,0], /* silver 0 */
   [.25,0,0,0,      .5,0,0,0,    2,2,2,20,   0,0,0,0], /* plastic 1 */
   [.15,.05,.025,0, .3,.1,.05,0, .6,.2,.1,3, 0,0,0,0], /* copper 2 */
   [.25,.15,.025,0, .5,.3,.05,0, 1,.6,.1,6,  0,0,0,0], /* gold 3 */
   [.05,.05,.05,0,  .1,.1,.1,0,  1,1,1,5,    0,0,0,0], /* lead 4 */
   [.34,.3,.5,0,  .34,.3,.5,0,  .1,.1,.1,5, 0,0,0,0], /* light blue 5 */
];
S.nM = S.mat.length;

S.material =
[
   [.15,.05,.025,0, .3,.1,.05,0, .6,.2,.1,3, 0,0,0,0], /* copper 0 */
   [.25,.15,.025,0, .5,.3,.3,0, 1,.6,.1,6,  0,0,0,0], /* yellow 1 */
   [.25,0,0,0,      .5,0,0,0,    2,2,2,20,   0,0,0,0], /* plastic 2 */
   [.05,.05,.05,0,  .1,.1,.1,0,  1,1,1,5,    0,0,0,0], /* lead 3 */
   [.1,.1,.1,0,     .1,.1,.1,0,  1,1,1,5,    0,0,0,0], /* silver 4 */
   [.25,.15,.025,0, .5,.3,.05,0, 1,.6,.1,6,  0,0,0,0], /* gold 5 */
   [1,1,1,0, 1,1,1,0, 1,1,1,6,  0,0,0,0], /* white 6 */
   [0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0], /* black 7 */
   [.34,.3,.5,0,  .34,.3,.5,0,  .1,.1,.1,5, 0,0,0,0], /* light blue 8 */
   [.2,0,1,0,  .2,0,1,0,  .1,.1,.1,5, 0,0,0,0], /* light blue 9 */
];

// a square is a triangle mesh with just two triangles

S.squareMesh =
[-1,1,0, 0,0,1, 0,1, 0,0,0,0,0,0,0,0,
1,1,0, 0,0,1, 1,1, 0,0,0,0,0,0,0,0,
-1,-1,0, 0,0,1, 0,0, 0,0,0,0,0,0,0,0,
1,-1,0, 0,0,1, 1,0, 0,0,0,0,0,0,0,0];

function square_mesh_function(time)
{
   return [-1,1,0, 0,0,1, 0,1, Math.sin(time) * Math.random(), -Math.cos(time * Math.random()), Math.sin(time) * Math.random(), 0,0,0,0,0,
      1,1,0, 0,0,1, 1,1, Math.random(), Math.random(), Math.random(), 0,0,0,0,0,
      -1,-1,0, 0,0,1, 0,0, Math.sin(time) * Math.random(), Math.sin(time) * Math.random(), Math.sin(time) * Math.random(), 0,0,0,0,0,
      1,-1,0, 0,0,1, 1,0, Math.sin(time) * Math.random(), Math.sin(time) * Math.random(), Math.cos(time) * Math.random(), 0,0,0,0,0];
}

S.square_mesh = square_mesh_function;

// glue together two meshes to create a single mesh

function glueMeshes(a, b)
{
   let mesh = a.slice();
   mesh.push(a.slice(a.length - S.VERTEX_SIZE, a.length));
   mesh.push(b.slice(0, S.VERTEX_SIZE));
   mesh.push(b);
   return mesh.flat();
}

let add = (a, b) =>
{
   if(!a || !b || !a.length || !b.length)
      return [0, 0, 0];
   let n = a.length,
   res = new Array(n);
   for(let i = 0; i < n; ++i)
      res[i] = a[i] + b[i];
   return res;
};
let subtract = (a, b) =>
{
   if(!a || !b || !a.length || !b.length)
      return [0, 0, 0];
   let n = a.length,
   res = new Array(n);
   for(let i = 0; i < n; ++i)
      res[i] = a[i] - b[i];
   return res;
};
let cross = (a, b) => 
{ 
   if(!a || !b || !a.length || !b.length)
      return [0, 0, 0];
   return [a[1] * b[2] - a[2] * b[1],
   a[2] * b[0] - a[0] * b[2],
   a[0] * b[1] - a[1] * b[0]]; 
};
let norm = a => Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
let normalize = a =>
{
   let s = norm(a);
   return s < .00001 ? [0,0,0] : [ a[0] / s, a[1] / s, a[2] / s ];
}
function triangle_normal(p1, p2, p3)
{
    return cross(subtract(p2, p1), subtract(p3, p1));
}

// given a function that maps (u,v) to point and normal,
// and given a mesh resolution, create a parametric mesh

function face_normal(vertex_array, i, j)
{/* f = (b-a) x (c-b) + (c-b) x (d-c) + (d-c) x (a-d) + (a-d) x (b-a) */
   let a = vertex_array[i + 1][j],
   b = vertex_array[i + 1][j + 1],
   c = vertex_array[i][j + 1],
   d = vertex_array[i][j];
   return add
   (
      add
      (
         cross(subtract(b, a), subtract(c, b)),
         cross(subtract(c, b), subtract(d, c))
      ),
      add
      (
         cross(subtract(d, c), subtract(a, d)),
         cross(subtract(a, d), subtract(b, a))
      )
   );
}

function vertex_normal(face_normal_array, i, j, nu, nv)
{
   let i0 = (0 <= i && i < nv) ? i : 0,
   j0 = (0 <= i && j < nu) ? j : 0,
   i1 = (0 <= i - 1 && i - 1 < nv) ? i - 1 : nv - 1,
   j1 = (0 <= j - 1 && j - 1 < nu) ? j - 1 : nu - 1,
   f0 = face_normal_array[i0] ? face_normal_array[i0][j1] : [0, 0, 0],
   f1 = face_normal_array[i0] ? face_normal_array[i0][j0] : [0, 0, 0],
   f2 = face_normal_array[i1] ? face_normal_array[i1][j1] : [0, 0, 0],
   f3 = face_normal_array[i1] ? face_normal_array[i1][j0] : [0, 0, 0];
   return normalize
   (
      add
      (
         add(f0, f1),
         add(f2, f3)
      )
   );
}

function uvMesh(f, nu, nv, data)
{
   let mesh = [];
   /* create an array of nu+1 x nv+1 vertices
         v---v---v
         |   |   |
         v---v---v
         |   |   |
         v---v---v
         |   |   |
         v---v---v
   */
   let vertex_array_row = nv + 1,
   vertex_array_col = nu + 1,
   vertex_array = new Array(vertex_array_row);
   for(let i = 0; i < vertex_array_row; ++i)
   {
      let v = i / nv;
      vertex_array[i] = new Array(vertex_array_col);
      for(let j = 0; j < vertex_array_col; ++j)
      {
         let u = j / nu;
         vertex_array[i][j] = f(u, v, data);
      }
   }

   /* create an array of nu x nv face normals
         d---c---v
         | f |   |
         a---b---v  f = (b-a) x (c-b) +
         |   |   |      (c-b) x (d-c) +
         v---v---v      (d-c) x (a-d) +
         |   |   |      (a-d) x (b-a)
         v---v---v
   */
   let face_normal_array = new Array(nv);
   for(let i = 0; i < nv; ++i)
   {
      face_normal_array[i] = new Array(nu);
      for(let j = 0; j < nu; ++j)
         face_normal_array[i][j] = face_normal(vertex_array, i, j);
   }

   /* sum the 4 adjoining face normals to compute each vertex normal
         d---c---v
         |f2 |f3 |
         a---n---v   n = normalize(f0 + f1 + f2 + f3)
         |f0 |f1 |
         v---v---v
         | f | f |
         v---v---v
   */
   for(let i = 0; i < vertex_array_row; ++i)
   {
      for(let j = 0; j < vertex_array_col; ++j)
      {
         let normal = vertex_normal(face_normal_array, i, j, nu, nv);
         vertex_array[i][j][3] = normal[0];
         vertex_array[i][j][4] = normal[1];
         vertex_array[i][j][5] = normal[2];
      }
   }


   /* build the mesh by glueing together rows of triangle strips
   don't try to build a flat array here.
   make this an array of arrays, where each vertex is its own array.
   in particular, use mesh.push() rather than mesh.concat(). */
   for(let i = 0; i < nv; ++i)
   {
      for(let j = 0; j < nu; ++j)
      {
         mesh.push(vertex_array[i][j]);
         mesh.push(vertex_array[i][j + 1]);
         mesh.push(vertex_array[i + 1][j]);
         mesh.push(vertex_array[i + 1][j]);
         mesh.push(vertex_array[i + 1][j + 1]);
         mesh.push(vertex_array[i][j + 1]);
      }
      mesh.push(vertex_array[i][nu]);
      mesh.push(vertex_array[i + 1][0]);
   }
   /* return the flattened array. finally, just flatten everything using the .flat() method. */
   return mesh.flat();
}

S.uvMesh = uvMesh;

// CREATE A UNIT SPHERE PARAMETRIC MESH

S.sphereMesh = uvMesh((u,v) => {
   let theta = 2 * Math.PI * u;
   let phi = Math.PI * v - Math.PI/2;
   let cu = Math.cos(theta);
   let su = Math.sin(theta);
   let cv = Math.cos(phi);
   let sv = Math.sin(phi);
   return [cu * cv, su * cv, sv,
         cu * cv, su * cv, sv,
         u, v,
         0, 0, 0, 0, 0, 0, 0, 0];
}, 20, 10);

// CREATE A UNIT TORUS PARAMETRIC MESH

S.torusMesh = uvMesh((u,v,r) => {
   let theta = 2 * Math.PI * u;
   let phi   = 2 * Math.PI * v;
   let cu = Math.cos(theta);
   let su = Math.sin(theta);
   let cv = Math.cos(phi);
   let sv = Math.sin(phi);
   return [cu * (1 + r * cv), su * (1 + r * cv), r * sv,
         cu * cv, su * cv, sv,
         u, v,
         0, 0, 0, 0, 0, 0, 0, 0];
}, 20, 10, .4);

// CREATE A UNIT DISK PARAMETRIC MESH

S.diskMesh = uvMesh((u,v) => {
   let theta = 2 * Math.PI * u;
   let phi   = 2 * Math.PI * v;
   let cu = Math.cos(theta);
   let su = Math.sin(theta);
   return [v * cu, v * su, 
         0, 0, 0, 1,
         u, v,
         0, 0, 0, 0, 0, 0, 0, 0];
}, 20, 2);

// CREATE A UNIT OPEN TUBE PARAMETRIC MESH

S.tubeMesh = uvMesh((u,v) => {
   let theta = 2 * Math.PI * u;
   let phi   = 2 * Math.PI * v;
   let cu = Math.cos(theta);
   let su = Math.sin(theta);
   return [cu, su, 2 * v - 1,
         cu, su, 0,
         u, v,
         0, 0, 0, 0, 0, 0, 0, 0];
}, 20, 2);

// TRANSFORM A MESH BY A MATRIX ON THE CPU

function transform_mesh(mesh, matrix)
{
   let result = [],
   imt = matrixTranspose(matrixInverse(matrix));
   for(let i = 0; i < mesh.length; i += S.VERTEX_SIZE)
   {
      let v = mesh.slice(i, i + S.VERTEX_SIZE),
      p = v.slice(0, 3),
      n = v.slice(3, 6),
      uv = v.slice(6, 8);
      p = matrixTransform(matrix, [p[0], p[1], p[2], 1]);
      n = matrixTransform(imt, [n[0], n[1], n[2], 0]);
      result = result.concat([p[0], p[1], p[2], n[0], n[1], n[2], uv[0], uv[1], 0, 0, 0, 0, 0, 0, 0, 0]);
   }
   return result;
}

// A CYLINDER MESH IS A TUBE WITH TWO DISK END-CAPS GLUED TOGETHER

let end0 = transform_mesh(S.diskMesh, matrixTranslate([0,0,1]));
let end1 = transform_mesh(end0, matrixRotx(Math.PI));
S.cylinderMesh = glueMeshes(S.tubeMesh, glueMeshes(end0, end1));

// A CUBE MESH IS SIX TRANSFORMED SQUARE MESHES GLUED TOGETHER

let face0 = transform_mesh(S.squareMesh, matrixTranslate([0,0,1]));
let face1 = transform_mesh(face0,        matrixRotx( Math.PI/2));
let face2 = transform_mesh(face0,        matrixRotx( Math.PI  ));
let face3 = transform_mesh(face0,        matrixRotx(-Math.PI/2));
let face4 = transform_mesh(face0,        matrixRoty(-Math.PI/2));
let face5 = transform_mesh(face0,        matrixRoty( Math.PI/2));
S.cubeMesh = glueMeshes(face0,
            glueMeshes(face1,
            glueMeshes(face2,
            glueMeshes(face3,
            glueMeshes(face4,
                        face5)))));

 // draw a single mesh.

S.textures = {};

S.drawMesh = (mesh, matrix, materialIndex, textureSrc) =>
{
   let gl = S.gl;
   if(!S.gl.bufferData)
      return;
   S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
   S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
   S.setUniform('Matrix4fv', 'uMaterial', false, S.mat[materialIndex]);

   S.setUniform('1i', 'uSampler', 0);
   S.setUniform('1f', 'uTexture', textureSrc ? 1 : 0);

   if(textureSrc)
   {
      if(!S.textures[textureSrc]) /* load texture from server */
      {
         let image = new Image();
         image.onload = function()
         {
            S.textures[this.textureSrc] = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, S.textures[this.textureSrc]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
         }
         image.textureSrc = textureSrc;
         image.src = textureSrc;
      }
      else /* texture loaded. can render */
      {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, S.textures[textureSrc]);
      }
   }
   S.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
   S.gl.drawArrays(mesh.isTriangles ? S.gl.TRIANGLES : S.gl.TRIANGLE_STRIP, 0, mesh.length / S.VERTEX_SIZE);
}

let evalCubicSpline = (splineMatrix, P, t) => {
   let splineValue = P => {
      let c = matrixTransform(splineMatrix, P);
      return t * (t * (t * c[0] + c[1]) + c[2]) + c[3];
   }

   // THE VALUE AT A KEY CAN BE EITHER A NUMBER OR AN OBJECT

   if (Number.isFinite(P[0]))    // SPECIAL CASE: THE VALUE
      return splineValue(P);     // AT THE KEY IS A NUMBER.

   let value = {};
   for (let k in P[0])
      value[k] = splineValue([ P[0][k], P[1][k], P[2][k], P[3][k] ]);
   return value;
}

let BezierMatrix = [
   -1, 3,-3, 1,
   3,-6, 3, 0,
   -3, 3, 0, 0,
   1, 0, 0, 0,
];
let HermiteMatrix = [
   2,-3, 0, 1,
   -2, 3, 0, 0,
   1,-2, 1, 0,
   1,-1, 0, 0,
];
let CatmullRomMatrix = [
   -1/2,  1  , -1/2, 0,
   3/2, -5/2,  0  , 1,
   -3/2,  2  ,  1/2, 0,
   1/2, -1/2,  0  , 0,
];
let BSplineMatrix = [
   -1/6, 3/6,-3/6, 1/6,
   3/6,-6/6, 0/6, 4/6,
   -3/6, 3/6, 3/6, 1/6,
   1/6, 0/6, 0/6, 0/6,
];

S.CatmullRomFunction = (keys, n, t) => {
   let mm = n => Math.max(0, Math.min(keys.length - 1, n));
   let a = keys[mm(n-1)];
   let b = keys[mm(n  )];
   let c = keys[mm(n+1)];
   let d = keys[mm(n+2)];
   return evalCubicSpline(CatmullRomMatrix, [a,b,c,d], t);
}
S.BSplineFunction = (keys, n, t) => {
   let mm = n => Math.max(0, Math.min(keys.length - 1, n));
   let a = keys[mm(n-1)];
   let b = keys[mm(n  )];
   let c = keys[mm(n+1)];
   let d = keys[mm(n+2)];
   return evalCubicSpline(BSplineMatrix, [a,b,c,d], t);
}


S.evalSpline = (keys, f, splineFunction) => {
   let T = Math.max(0, Math.min(.9999, f)) * (keys.length - 1);
   return splineFunction(keys, T >> 0, T % 1);
}

// CREATE A SURFACE OF REVOLUTION MESH

S.createRevolutionMesh = (nu,nv,keys) => S.uvMesh((u,v,keys) =>
{
   let theta = 2 * Math.PI * u;
   let cos = Math.cos(theta);
   let sin = Math.sin(theta);

   let zr  = S.evalSpline(keys, v, S.CatmullRomFunction);

   return [
      zr.r * cos, zr.r * sin, zr.z,
      0, 0, 0,                // NORMAL WILL BE COMPUTED LATER IN uvMesh().
      u, v,
      0, 0, 0, 0, 0, 0, 0, 0
   ];
}, nu, nv, keys);

S.createExtrusionMesh = (nu,nv,data) =>
{
   let radius   = data.radius;
   let profile  = data.profile;
   let path     = data.path;
   let profileSpline = u => S.evalSpline(profile, u, S.CatmullRomFunction);
   let pathSpline    = v => S.evalSpline(path, v, S.CatmullRomFunction);

   let m = new Matrix(),
      p = pathSpline(0),
      q = pathSpline(0.001);
   /* z = normalize(q - p)
   x = a vector not aligned with z

   to find a reasonable initial value for x:

      xx = z[0] * z[0]
      yy = z[1] * z[1]
      zz = z[2] * z[2]

      if xx < yy && xx < zz then x = [1,0,0]
      if yy < xx && yy < zz then x = [0,1,0]
      if zz < xx && zz < yy then x = [0,0,1]
   */
   let z = normalize(subtract([q.x, q.y, q.z], [p.x, p.y, p.z])), x,
   xx = z[0] * z[0],
   yy = z[1] * z[1],
   zz = z[2] * z[2];
   if(xx < yy && xx < zz) x = [1, 0, 0];
   if(yy < xx && yy < zz) x = [0, 1, 0];
   if(zz < xx && zz < yy) x = [0, 0, 1];

   return S.uvMesh((u,v) =>
   {
      p = pathSpline(v - .001);
      q = pathSpline(v + .001);
      /* z = normalize(q - p)
      y = normalize( cross (z, x) )
      x = normalize( cross (y, z) )
      m = x y z p
      */
      z = normalize(subtract([q.x, q.y, q.z], [p.x, p.y, p.z]));
      y = normalize(cross(z, x));
      x = normalize(cross(y, z));
      p = [p.x, p.y, p.z, 0];
      x.push(0);
      y.push(0);
      z.push(0);
      m.set(x.concat(y, z, p));

      p = profileSpline(u);
      let P = m.transform([radius * p.x, radius * p.y, radius * p.z]);
      return [
         P[0], P[1], P[2],
         0, 0, 0,            // NORMAL WILL BE COMPUTED LATER IN uvMesh().
         u, v,
         0, 0, 0, 0, 0, 0, 0, 0
      ];
   }, nu, nv);
};