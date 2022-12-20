class wave
{
    constructor(gl, canvas, mode)
    {
        this.gl = gl;
        this.canvas = canvas;
        this.fft_n = 64;
        this.sky_n = 100;
        this.mesh_n = 512;
        this.mesh = new mesh(gl, this.mesh_n);
        this.interval = 1.0;
        this.mode = mode;
        this.sky1 = new sky(gl, this.sky_n);
        this.sky2 = new sky2(gl, this.sky_n);
        this.wave2 = new wave2(gl, canvas, gl.TRIANGLES);
        this.camera = new camera([25, 4.3, 330], [25, 3.6, 324], [0, 1, 0]);
        this.tex1 = new tex(this.gl, this.fft_n);
        this.spectrum1 = new spectrum(this.gl, this.fft_n);
        this.htilde0 = this.spectrum1.htilde0();
        this.htilde1 = this.spectrum1.htilde1();
        this.fft = new fft(this.fft_n);
        this.u_project = new matrix().get();
        this.u_view = new matrix().get();
        this.u_inverse_project = new matrix().get();
        this.u_inverse_view = new matrix().get();
    }

    gen()
    {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.wave2.gen();
        this.sky1.gen();
        this.sky2.gen();
        this.mesh.gen();
    };

    wave()
    {
        let this_ptr = this;
        function callback()
        {
            this_ptr.interval += 0.2;
            let s = this_ptr.spectrum1.ocean(this_ptr.interval, this_ptr.htilde0, this_ptr.htilde1),
            x = this_ptr.fft.ifft(s.x), /* float x[n][n] */
            y = this_ptr.fft.ifft(s.y), /* float y[n][n] */
            z = this_ptr.fft.ifft(s.z); /* float z[n][n] */
            this_ptr.tex1.tex(x, y, z);
            this_ptr.draw_mesh();
        }
        window.requestAnimationFrame(callback); /* update animation onscreen */
    };
    
    draw_mesh()
    {
        this.wave2.draw_mesh();
        this.sky1.draw_mesh(this.u_project, this.u_view);
        this.sky2.draw_mesh(this.u_project, this.u_view);
        this.wave();
        this.wave2.wave();
        matrixPerspective(44.0, 1.0, 0.2, 1000.0, this.u_project);
        matrixPerspective(54.0, 1.0, 0.01, 1000.0, this.u_inverse_project);
        matrixLookAt(this.camera.position, this.camera.orient, this.camera.up, this.u_view);
        this.u_inverse_view = matrixInverse(this.u_view);
        this.u_inverse_project = matrixInverse(this.u_inverse_project);
        let a = 
        {
            mode: this.mode,
            u_project: this.u_project,
            u_view: this.u_view,
            u_inverse_project: this.u_inverse_project,
            u_inverse_view: this.u_inverse_view,
            camera: this.camera,
            tex: this.tex1
        };
        this.mesh.draw_mesh(a);
    }
}