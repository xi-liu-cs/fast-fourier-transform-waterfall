class wave2
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
        this.camera = new camera([25, 4.3, 330], [25, 3.6, 324], [1, 1, 0]);
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
        this.sky1.gen();
        this.mesh.gen();
    };

    wave()
    {
        let this_ptr = this;
        function callback()
        {
            this_ptr.interval += 0.2;
            let s = this_ptr.spectrum1.ocean(this_ptr.interval, this_ptr.htilde0, this_ptr.htilde1),
            x = this_ptr.fft.ifft(s.x),
            y = this_ptr.fft.ifft(s.y),
            z = this_ptr.fft.ifft(s.z);
            this_ptr.tex1.tex(x, y, z);
            this_ptr.draw_mesh();
        }
        window.requestAnimationFrame(callback);
    };
    
    draw_mesh()
    {
        if(mode.value == 0)
            this.wave();
        matrixPerspective(44.0, 1.0, 0.1, 1000.0, this.u_project);
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