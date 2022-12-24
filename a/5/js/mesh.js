class mesh
{   
    constructor(gl, n)
    {
        this.lib = new lib(gl);
        this.gl = gl;
        this.program = gl.createProgram();
        this.idx_buf = gl.createBuffer();
        this.vert_buf = gl.createBuffer();
        this.n = n;
        this.index_array = new Array(6 * n * n);
        this.vertex_array = new Array(3 * (n + 1) * (n + 1));
        this.lib.gl_start.call(this, 'wave.vert', 'wave.frag', 1);
    }
    
    gen()
    {
        let index_i = 0, vertex_i = 0, n = this.n,
        index_array = this.index_array, vertex_array = this.vertex_array;
        for(let i = 0; i < n; ++i)
        {
            for(let j = 0; j < n; ++j)
            {
                index_array[index_i] = i * (n + 1) + j; /* [i][j] */
                index_array[index_i + 1] = i * (n + 1) + j + 1; /* [i][j + 1] */
                index_array[index_i + 2] = (i + 1) * (n + 1) + j; /* [i + 1][j] */
                index_array[index_i + 3] = (i + 1) * (n + 1) + j; /* [i + 1][j] */
                index_array[index_i + 4] = (i + 1) * (n + 1) + j + 1; /* [i + 1][j + 1] */
                index_array[index_i + 5] = i * (n + 1) + j + 1; /* [i][j + 1] */
                index_i += 6;
            }
        }
        for(let i = 0; i <= n; ++i)
        {
            let v = i / n,
            _2v_1 = 2 * v - 1;
            for(let j = 0; j <= n; ++j)
            {
                let u = j / n;
                vertex_array[vertex_i] = _2v_1; /* 2v - 1, [0, 1]  -> [-1, 1] */
                vertex_array[vertex_i + 1] = 0.0;
                vertex_array[vertex_i + 2] = 2 * u - 1; /* 2u - 1 */
                vertex_i += 3;
            }
        }
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertex_array), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.idx_buf);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.index_array), this.gl.DYNAMIC_DRAW);
    }

    draw_mesh(a)
    {
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.program.u_project, false, a.u_project);
        this.gl.uniformMatrix4fv(this.program.u_view, false, a.u_view);
        this.gl.uniformMatrix4fv(this.program.u_inverse_view, false, a.u_inverse_view);
        this.gl.uniformMatrix4fv(this.program.u_inverse_project, false, a.u_inverse_project);
        this.gl.uniform3fv(this.program.u_camera, a.camera.position);
        this.gl.uniform3fv(this.program.u_wave_color, a.u_wave_color);
        this.gl.bindTexture(this.gl.TEXTURE_2D, a.tex.tex_obj);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buf);
        this.gl.enableVertexAttribArray(this.program.a_pos);
        this.gl.vertexAttribPointer(this.program.a_pos, 3, this.gl.FLOAT, false, 0, 0); 
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.idx_buf);
        this.gl.drawElements(a.mode, this.index_array.length, this.gl.UNSIGNED_INT, 0);
    }
}