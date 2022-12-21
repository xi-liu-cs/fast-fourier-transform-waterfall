class sky2
{
    constructor(gl, n)
    {
        this.lib = new lib(gl);
        this.gl = gl;
        this.program = gl.createProgram();
        this.idx_buf = gl.createBuffer();
        this.vert_buf = gl.createBuffer();
        this.gl = gl;
        this.n = n;
        this.index_array = [];
        this.lib.gl_start.call(this, "sky2.vert", "sky2.frag", 2);
    }
    
    gen()
    {
        let vertex_array = 
        [
            -1,1,0, 0,0,1, 0,1, .7,.8,1, 0,0,0,0,0,
            1,1,0, 0,0,1, 1,1, .7,.8,1, 0,0,0,0,0,
            -1,-1,0, 0,0,1, 0,0, .7,.8,1, 0,0,0,0,0,
            1,-1,0, 0,0,1, 1,0, .7,.8,1, 0,0,0,0,0
        ];
        this.vertex_array = vertex_array;
        this.gl.useProgram(this.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buf);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertex_array), this.gl.STATIC_DRAW);
    }

    draw_mesh(u_project, u_view, texture_src)
    {
        if(texture_src)
        {
            this.gl.useProgram(this.program);
            let start_time = Date.now(),
            fl = 5.0;
            this.gl.uniformMatrix4fv(this.u_project, false,
            [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);
            if(this.uLd >= 0)
                this.gl.uniformMatrix3fv(this.uLd, false, [.57,.57,.57, -.57,-.57,-.57]);
            if(this.uLc >= 0)
                this.gl.uniformMatrix3fv(this.uLc, false, [1,1,1, .5,.3,.1]);
            if(this.uBgColor >= 0)
                this.gl.uniform3fv(this.uBgColor, [.89,.81,.75]);
            if(this.uMaterial >= 0)
                this.gl.uniformMatrix4fv(this.uMaterial, false, [.34,.3,.5,0, .34,.3,.5,0, .1,.1,.1,5, 0,0,0,0]);
            if(this.u_time >= 0)
                this.gl.uniform1f(this.u_time, Date.now() - start_time / 1000);
            if(this.uSampler >= 0)
                this.gl.uniform1i(this.uSampler, 0);
            if(this.uTexture >= 0)
                this.gl.uniform1f(this.uTexture, texture_src ? 1 : 0);
            let vertex_n = 8,
            bpe = Float32Array.BYTES_PER_ELEMENT;
            this.gl.uniformMatrix4fv(this.program.u_project, false, u_project);
            this.gl.uniformMatrix4fv(this.program.u_view, false, u_view);
            if(this.a_pos >= 0)
            {
                this.gl.enableVertexAttribArray(this.a_pos);
                this.gl.vertexAttribPointer(this.a_pos, 3, this.gl.FLOAT, false, vertex_n * bpe,  0 * bpe);
            }
            if(this.aNor >= 0)
            {
                this.gl.enableVertexAttribArray(this.aNor);
                this.gl.vertexAttribPointer(this.aNor, 3, this.gl.FLOAT, false, vertex_n * bpe,  3 * bpe);
            }
            if(this.aUV >= 0)
            {
                this.gl.enableVertexAttribArray(this.aUV);
                this.gl.vertexAttribPointer(this.aUV, 2, this.gl.FLOAT, false, vertex_n * bpe,  6 * bpe);
            }
            if(this.a_color >= 0)
            {
                this.gl.enableVertexAttribArray(this.a_color);
                this.gl.vertexAttribPointer(this.a_color, 3, this.gl.FLOAT, false, vertex_n * bpe,  8 * bpe);
            }
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertex_array.length / vertex_n);
        }
        else
        {
            let vertex_n = 5,
            bpe = Float32Array.BYTES_PER_ELEMENT;
            this.gl.useProgram(this.program);
            this.gl.uniformMatrix4fv(this.program.u_project, false, u_project);
            this.gl.uniformMatrix4fv(this.program.u_view, false, u_view);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buf);
            this.gl.enableVertexAttribArray(this.program.a_pos);
            this.gl.vertexAttribPointer(this.program.a_pos, 3, this.gl.FLOAT, false, vertex_n * bpe, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.idx_buf);
            this.gl.drawElements(this.gl.TRIANGLES, this.index_array.length, this.gl.UNSIGNED_BYTE, 0);
        }
    }
}