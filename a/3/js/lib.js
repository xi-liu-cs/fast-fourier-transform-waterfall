class lib
{
    constructor(gl)
    {
        this.gl = gl;
        this.program = gl.createProgram();
        this.gl.getExtension("EXT_color_buffer_float"); /* enable gl.RGBA32F to be color renderable */
        this.gl.getExtension("OES_texture_float_linear"); /* linear filtering with float pixel textures */
    }

    gl_start(vertex_i, fragment_i, program_i)
    {
        let vertex = document.getElementById(vertex_i),
        fragment = document.getElementById(fragment_i),
        vertex_shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertex_shader, vertex.textContent);
        this.gl.compileShader(vertex_shader);
        let fragment_shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragment_shader, fragment.textContent);
        this.gl.compileShader(fragment_shader);
        this.gl.attachShader(this.program, vertex_shader);
        this.gl.attachShader(this.program, fragment_shader);
        let vertex_shader_error = this.gl.getShaderInfoLog(vertex_shader),
        fragment_shader_error = this.gl.getShaderInfoLog(fragment_shader);
        if(vertex_shader_error || fragment_shader_error)
        {
            console.log(vertex_shader_error);
            console.log(fragment_shader_error);
        }
        this.gl.linkProgram(this.program);
        let error = this.gl.getProgramInfoLog(this.program);
        if(error)
            console.log(error);
        this.gl.useProgram(this.program);
        this.program.a_pos = this.gl.getAttribLocation(this.program, "a_pos");
        this.program.u_view = this.gl.getUniformLocation(this.program, "u_view");
        this.program.u_project = this.gl.getUniformLocation(this.program, "u_project");
        this.program.u_inverse_view = this.gl.getUniformLocation(this.program, "u_inverse_view");
        this.program.u_inverse_project = this.gl.getUniformLocation(this.program, "u_inverse_project");
        this.program.u_camera = this.gl.getUniformLocation(this.program, "u_camera");
        if(program_i == 2)
        {
            this.aPos = this.gl.getAttribLocation(this.program, 'aPos');
            this.aNor = this.gl.getAttribLocation(this.program, 'aNor');
            this.aUV = this.gl.getAttribLocation(this.program, 'aUV');               
            this.a_color = this.gl.getAttribLocation(this.program, 'a_color');
            this.uLd = this.gl.getAttribLocation(this.program, 'uLd');
            this.uLc = this.gl.getAttribLocation(this.program, 'uLc');
            this.uBgColor = this.gl.getAttribLocation(this.program, 'uBgColor');
            this.uMaterial = this.gl.getAttribLocation(this.program, 'uMaterial');
            this.u_time = this.gl.getAttribLocation(this.program, 'u_time');
            this.uSampler = this.gl.getAttribLocation(this.program, 'uSampler');
            this.uTexture = this.gl.getAttribLocation(this.program, 'uTexture');
        }
        this.gl.useProgram(null);
    }
}

class tex
{
    constructor(gl, n)
    {
        this.gl = gl;
        this.n = n;
        this.tex_obj = this.gl.createTexture();
    }

    tex_start(tex_src)
    {
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex_src);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    tex(x, y, z)
    {
        let n = this.n,
        out = new Array(4 * n * n);
        let vi = 0,
        sign = [1, -1];
        for(let i = 0; i < n; ++i)
        {
            for(let j = 0; j < n; ++j)
            {
                let s = sign[(i + j) & 1];
                out[vi] = s * x[i][j];
                out[vi + 1] = s * y[i][j];
                out[vi + 2] = s * z[i][j];
                out[vi + 3] = 1.0;
                vi += 4;
            }
        }
        this.tex_start(this.tex_obj);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA32F, this.n, this.n, 0, this.gl.RGBA, this.gl.FLOAT, new Float32Array(out));
        return this;
    }
}

class camera
{
    constructor(position, look_at, up)
    {
        this.position = position;
        this.look_at = look_at;
        this.up = up;
    }

    forward()
    {
        let a = -0.01 * forward_input.value;
        new array().add([0, 0, a], this.position, this.position);
    }

    backward()
    {
        let a = 0.01 *  backward_input.value;
        new array().add([0, 0, a], this.position, this.position);
    }
}