S.draw_mesh =
function(mesh, matrix)
{
    let gl = S.gl;
    if(!S.gl.bufferData)
       return;
    S.setUniform('1f', 'uTexture', 0);
    S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
    S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
    S.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, mesh.length / S.VERTEX_SIZE);
}

S.draw_mesh2 =
function(mesh, matrix, material)
{
    let gl = S.gl;
    if(!S.gl.bufferData)
       return;
    S.setUniform('1f', 'uTexture', 0);
    S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
    S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
    S.setUniform('Matrix4fv', 'uMaterial', false, material);
    S.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, mesh.length / S.VERTEX_SIZE);
}

S.draw_mesh3 =
function(mesh, matrix)
{
    let gl = S.gl;
    if(!S.gl.bufferData)
       return;
    S.setUniform('1f', 'uTexture', 0);
    S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
    S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
    S.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    S.gl.drawArrays(S.gl.TRIANGLES, 0, mesh.length / S.VERTEX_SIZE);
}

S.draw_mesh4 =
function(mesh, matrix, material)
{
    let gl = S.gl;
    if(!S.gl.bufferData)
       return;
    S.setUniform('1f', 'uTexture', 0);
    S.setUniform('Matrix4fv', 'uMatrix', false, matrix);
    S.setUniform('Matrix4fv', 'uInvMatrix', false, matrixInverse(matrix));
    S.setUniform('Matrix4fv', 'uMaterial', false, material);
    S.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    S.gl.drawArrays(S.gl.TRIANGLES, 0, mesh.length / S.VERTEX_SIZE);
}

function glue_mesh(a, b)
{
    let mesh = a.slice();
    mesh.push(a.slice(a.length - S.VERTEX_SIZE, a.length));
    mesh.push(b.slice(0, S.VERTEX_SIZE));
    mesh.push(b);
    return mesh.flat();
}

function uv_mesh(f, nu, nv)
{
    let mesh = [];
    for(let iv = 0; iv < nv; ++iv)
    {
        let v = iv / nv,
        strip = [];
        for(let iu = 0; iu <= nu; ++iu)
        {
            let u = iu / nu;
            strip = strip.concat(f(u, v));
            strip = strip.concat(f(u, v + 1 / nv));
        }
        mesh = glue_mesh(mesh, strip);
    }
    return mesh;
}

S.cube_mesh = 
glue_mesh(face0,
glue_mesh(face1,
glue_mesh(face2,
glue_mesh(face3,
glue_mesh(face4, face5)))));

function sphere_mesh_function(u, v)
{
    let theta = 2 * Math.PI * u,
    phi = Math.PI * v - Math.PI / 2,
    cu = Math.cos(theta),
    su = Math.sin(theta),
    cv = Math.cos(phi),
    sv = Math.sin(phi),
    x = cu * cv,
    y = su * cv
    z = sv;
    return [x, y, z,
            x, y, z,
            u, v,
            1, 1, 1, 0, 0, 0, 0, 0];
}

S.sphere_mesh = uv_mesh(sphere_mesh_function, 20, 10);

function half_sphere_mesh_function(u, v)
{
    let theta = 2 * Math.PI * u,
    phi = Math.PI * v - Math.PI / 2,
    cu = Math.cos(theta),
    su = Math.sin(theta),
    cv = Math.cos(phi),
    sv = Math.sin(phi);
    if(sv < 0) /* z > 0 */
        sv = 0;
    return [cu * cv, su * cv, sv,
            cu * cv, su * cv, sv,
            u, v,
            1, 1, 1, 0, 0, 0, 0, 0];
}

S.half_sphere_mesh = uv_mesh(half_sphere_mesh_function, 20, 10);

function half_sphere_mesh_function2(u, v)
{
    let theta = 2 * Math.PI * u,
    phi = Math.PI * v - Math.PI / 2,
    cu = Math.cos(theta),
    su = Math.sin(theta),
    cv = Math.cos(phi),
    sv = Math.sin(phi);
    if(sv < 0) /* z > 0 */
        sv = 0;
    return [cu * cv, su * cv, sv,
            cu * cv, su * cv, sv,
            u, v,
            1, 1, 1, 0, 0, 0, 0, 0];
}

S.half_sphere_mesh2 = uv_mesh(half_sphere_mesh_function2, 20, 10);

function uvr_mesh(f, nu, nv, r)
{
    let mesh = [];
    for(let iv = 0; iv < nv; ++iv)
    {
        let v = iv / nv,
        strip = [];
        for(let iu = 0; iu <= nu; ++iu)
        {
            let u = iu / nu;
            strip = strip.concat(f(u, v, r));
            strip = strip.concat(f(u, v + 1 / nv, r));
        }
        mesh = glue_mesh(mesh, strip);
    }
    return mesh;
}

function torus_mesh_function(u, v, r)
{
    let theta = 2 * Math.PI * u,
    phi = 2 * Math.PI * v,
    cu = Math.cos(theta),
    su = Math.sin(theta),
    cv = Math.cos(phi),
    sv = Math.sin(phi),
    x = cu * (1 + r * cv),
    y = su * (1 + r * cv),
    z = r * sv,
    nx = cu * cv,
    ny = su * cv,
    nz = sv;
    return [x, y, z,
            nx, ny, nz,
            u, v,
            .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0, 0, 0, 0, 0];
}

S.torus_mesh = uvr_mesh(torus_mesh_function, 20, 10, .4);

function tube_mesh_function(u, v)
{
    let theta = 2 * Math.PI * u,
    c = Math.cos(theta),
    s = Math.sin(theta),
    z = 2 * v - 1;
    return [c, s, z,
            c, s, z,
            u, v,
            1, 1, 1, 0, 0, 0, 0, 0];
}

S.tube_mesh = uv_mesh(tube_mesh_function, 20, 10);

function disk_mesh_function(u, v)
{
    let theta = 2 * Math.PI * u,
    c = Math.cos(theta),
    s = Math.sin(theta);
    return [v * c, v * s, 0,
            0, 0, 1,
            u, v,
            1, 1, 1, 0, 0, 0, 0, 0];
}

S.disk_mesh = uv_mesh(disk_mesh_function, 20, 10);

function rectangle_mesh_function(u, v)
{
    let x = 2 * u - 1,
    y = 2 * v - 1;
    return [x, y, 0,
            0, 0, 1,
            u, v,
            1, 1, 1, 0, 0, 0];
}

S.rectangle_mesh = uv_mesh(rectangle_mesh_function, 20, 10);

function cone_mesh_function(u, v)
{
    let theta = 2 * Math.PI * u,
    c = Math.cos(theta),
    s = Math.sin(theta),
    cv = v * c,
    sv = v * s,
    z = 2 * v - 1;
    return [cv, sv, z,
            c, s, 1 / 2,
            u, v,
            1, 1, 1, 0, 0, 0, 0, 0];
}

S.cone_mesh = uv_mesh(cone_mesh_function, 20, 10);

function cone(rotate_function, t)
{
    let m = new matrix();
    m.identity();
    m.save();
        m.scale(.5, .5, .5);
        m.translate(-.2, .1, -1);
        m.rotx(Math.PI / 2);
        if(rotate_function.length)
            for(let i = 0; i < rotate_function.length; ++i)
                if(rotate_function[i] == 'x')
                    m.rotx(t.length == 1 ? t : t[i]);
                else if(rotate_function[i] == 'y')
                    m.roty(t.length == 1 ? t : t[i]);
                else if(rotate_function[i] == 'z')
                    m.rotz(t.length == 1 ? t : t[i]);
        S.draw_mesh(S.cone_mesh, m.get());
        m.save();
            m.translate(0, 0, 1);
            S.draw_mesh(S.disk_mesh, m.get());
        m.restore();
    m.restore();
}

function cone2(rotate_function, t, material)
{
    let m = new matrix();
    m.identity();
    m.save();
        m.scale(.1, .1, .1);
        m.translate(-7, .1, -1);
        m.rotx(Math.PI / 2);
        if(rotate_function.length)
            for(let i = 0; i < rotate_function.length; ++i)
                if(rotate_function[i] == 'x')
                    m.rotx(t.length == 1 ? t : t[i]);
                else if(rotate_function[i] == 'y')
                    m.roty(t.length == 1 ? t : t[i]);
                else if(rotate_function[i] == 'z')
                    m.rotz(t.length == 1 ? t : t[i]);
        S.draw_mesh2(S.cone_mesh, m.get(), material);
        m.save();
            m.translate(0, 0, 1);
            S.draw_mesh2(S.disk_mesh, m.get(), material);
        m.restore();
    m.restore();
}

function cone3(rotate_function, t, material, m)
{
    m.save();
        m.scale(.09, .15, .07);
        m.translate(-7, .1, -1);
        m.rotx(Math.PI / 2);
        if(rotate_function.length)
            for(let i = 0; i < rotate_function.length; ++i)
                if(rotate_function[i] == 'x')
                    m.rotx(t.length == 1 ? t : t[i]);
                else if(rotate_function[i] == 'y')
                    m.roty(t.length == 1 ? t : t[i]);
                else if(rotate_function[i] == 'z')
                    m.rotz(t.length == 1 ? t : t[i]);
        S.draw_mesh2(S.cone_mesh, m.get(), material);
        m.save();
            m.translate(0, 0, 1);
            S.draw_mesh2(S.disk_mesh, m.get(), material);
        m.restore();
    m.restore();
}

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

function tetrahedron(u, v)
{
    let a = 1.0 / 3.0,
    b = Math.sqrt(8.0 / 9.0),
    c = Math.sqrt(2.0 / 9.0),
    d = Math.sqrt(2.0 / 3.0),
    v0 = [0, 0, 1],
    v1 = [-c, d, -a],
    v2 = [-c, -d, -a],
    v3 = [b, 0, -a],
    n0 = triangle_normal(v0, v1, v2),
    n1 = triangle_normal(v2, v3, v0),
    n2 = triangle_normal(v0, v3, v1),
    n3 = triangle_normal(v1, v2, v3),
    mesh = 
    [v0[0],v0[1],v0[2], n0[0],n0[1],n0[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v1[0],v1[1],v1[2], n0[0],n0[1],n0[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v2[0],v2[1],v2[2], n0[0],n0[1],n0[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,

    v0[0],v0[1],v0[2], n1[0],n1[1],n1[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v2[0],v2[1],v2[2], n1[0],n1[1],n1[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v3[0],v3[1],v3[2], n1[0],n1[1],n1[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,

    v0[0],v0[1],v0[2], n2[0],n2[1],n2[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v3[0],v3[1],v3[2], n2[0],n2[1],n2[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v1[0],v1[1],v1[2], n2[0],n2[1],n2[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,

    v3[0],v3[1],v3[2], n3[0],n3[1],n3[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v2[0],v2[1],v2[2], n3[0],n3[1],n3[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0,
    v1[0],v1[1],v1[2], n3[0],n3[1],n3[2], u,v, .3 * Math.random(), .3 * Math.random(), .3 * Math.random(), 0,0,0,0,0];
    return mesh;
}

function star(u, v)
{
    let m = new matrix();
    m.identity();
    m.save();
        m.scale(.5, .4, .4);
        m.translate(-.4, -.4, 0);
        S.draw_mesh3(tetrahedron(u, v), m.get());
        m.rotx(-Math.PI / 2);
        m.roty(-Math.PI / 2);
        S.draw_mesh3(tetrahedron(u, v), m.get());
    m.restore();
}

function star2(u, v)
{
    let m = new matrix();
    m.identity();
    m.save();
        m.scale(.1, .1, .1);
        m.translate(-8, -3, 0);
        S.draw_mesh3(tetrahedron(u, v), m.get());
        m.rotx(-Math.PI / 2);
        m.roty(-Math.PI / 2);
        S.draw_mesh3(tetrahedron(u, v), m.get());
    m.restore();
}

function hexahedron(u, v)
{
    let a = 1.0 / 3.0,
    b = Math.sqrt(8.0 / 9.0),
    c = Math.sqrt(2.0 / 9.0),
    d = Math.sqrt(2.0 / 3.0),
    v0 = [0, 0, 1],
    v1 = [-c, d, -a],
    v2 = [-c, -d, -a],
    v3 = [b, 0, -a],
    v4 = [b, 0, -1],
    n0 = triangle_normal(v0, v1, v2),
    n1 = triangle_normal(v2, v3, v0),
    n2 = triangle_normal(v0, v3, v1),
    n3 = triangle_normal(v1, v2, v3),
    n4 = triangle_normal(v1, v2, v4),
    n5 = triangle_normal(v1, v3, v4),
    n6 = triangle_normal(v2, v3, v4),
    mesh = 
    [v0[0],v0[1],v0[2], n0[0],n0[1],n0[2], u,v, 1,1,1,0,0,0,0,0,
    v1[0],v1[1],v1[2], n0[0],n0[1],n0[2], u,v, 1,1,1,0,0,0,0,0,
    v2[0],v2[1],v2[2], n0[0],n0[1],n0[2], u,v, 1,1,1,0,0,0,0,0,

    v0[0],v0[1],v0[2], n1[0],n1[1],n1[2], u,v, 1,1,1,0,0,0,0,0,
    v2[0],v2[1],v2[2], n1[0],n1[1],n1[2], u,v, 1,1,1,0,0,0,0,0,
    v3[0],v3[1],v3[2], n1[0],n1[1],n1[2], u,v, 1,1,1,0,0,0,0,0,

    v0[0],v0[1],v0[2], n2[0],n2[1],n2[2], u,v, 1,1,1,0,0,0,0,0,
    v3[0],v3[1],v3[2], n2[0],n2[1],n2[2], u,v, 1,1,1,0,0,0,0,0,
    v1[0],v1[1],v1[2], n2[0],n2[1],n2[2], u,v, 1,1,1,0,0,0,0,0,

    v3[0],v3[1],v3[2], n3[0],n3[1],n3[2], u,v, 1,1,1,0,0,0,0,0,
    v2[0],v2[1],v2[2], n3[0],n3[1],n3[2], u,v, 1,1,1,0,0,0,0,0,
    v1[0],v1[1],v1[2], n3[0],n3[1],n3[2], u,v, 1,1,1,0,0,0,0,0,

    v1[0],v1[1],v1[2], n4[0],n4[1],n4[2], u,v, 1,1,1,0,0,0,0,0,
    v2[0],v2[1],v2[2], n4[0],n4[1],n4[2], u,v, 1,1,1,0,0,0,0,0,
    v4[0],v4[1],v4[2], n4[0],n4[1],n4[2], u,v, 1,1,1,0,0,0,0,0,

    v1[0],v1[1],v1[2], n5[0],n5[1],n5[2], u,v, 1,1,1,0,0,0,0,0,
    v3[0],v3[1],v3[2], n5[0],n5[1],n5[2], u,v, 1,1,1,0,0,0,0,0,
    v4[0],v4[1],v4[2], n5[0],n5[1],n5[2], u,v, 1,1,1,0,0,0,0,0,

    v2[0],v2[1],v2[2], n6[0],n6[1],n6[2], u,v, 1,1,1,0,0,0,0,0,
    v3[0],v3[1],v3[2], n6[0],n6[1],n6[2], u,v, 1,1,1,0,0,0,0,0,
    v4[0],v4[1],v4[2], n6[0],n6[1],n6[2], u,v, 1,1,1,0,0,0,0,0];
    return mesh;
}

function face_mesh(v1, v2, v3, u, v)
{/* gl_TRIANGLES */
    let n = triangle_normal(v1, v2, v3);
    return [v1[0],v1[1],v1[2], n[0],n[1],n[2], u,v, 0,0,0,0,0,0,0,0,
    v2[0],v2[1],v2[2], n[0],n[1],n[2], u,v, 0,0,0,0,0,0,0,0,
    v3[0],v3[1],v3[2], n[0],n[1],n[2], u,v, 0,0,0,0,0,0,0,0];
}

function combine_mesh_array(array)
{
    let a = [];
    for(let i = 0; i < array.length; ++i)
       a = a.concat(array[i]);
    return a;
}

function octahedron(u, v)
{
    let n = 1,
    a = [n, 0, 0],
    b = [-n, 0, 0],
    c = [0, n, 0],
    d = [0, -n, 0],
    e = [0, 0, n],
    f = [0, 0, -n],
    mesh_array = [face_mesh(a, f, c, u, v),
    face_mesh(b, f, c, u, v),
    face_mesh(b, f, d, u, v),
    face_mesh(a, f, d, u, v),
    face_mesh(a, e, c, u, v),
    face_mesh(b, e, c, u, v),
    face_mesh(b, e, d, u, v),
    face_mesh(a, e, d, u, v)];
    return combine_mesh_array(mesh_array);
}