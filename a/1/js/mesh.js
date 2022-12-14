function mesh(a)
{
    let gl = a.gl;
    vertex_size = a.vertex_size;

    function draw_mesh(mesh, matrix)
    {
        if(!gl.bufferData)
            return;
        gl.uniform1f('u_texture', 0);
        gl.uniformMatrix4fv('u_matrix', false, matrix);
        gl.uniformMatrix4fv('u_inverse', false, matrixInverse(matrix));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, mesh.length / vertex_size);
    }

    function glue_mesh(a, b)
    {
        let mesh = a.slice();
        mesh.push(a.slice(a.length - vertex_size, a.length));
        mesh.push(b.slice(0, vertex_size));
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

    function rectangle_mesh_function(u, v)
    {
        let x = 2 * u - 1,
        y = 2 * v - 1;
        return [x, y, 0,
                0, 0, 1,
                u, v,
                1, 1, 1, 0, 0, 0];
    }

    let rectangle_mesh = uv_mesh(rectangle_mesh_function, 20, 10);

    return {draw_mesh: draw_mesh,
    glue_mesh: glue_mesh,
    uv_mesh: uv_mesh,
    rectangle_mesh: rectangle_mesh};
}