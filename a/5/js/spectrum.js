class spectrum
{
    constructor(gl, n)
    {
        this.amplitude = 0.0001;
        this.g = 9.81; /* gravity */
        this.gl = gl;
        this.length = 1000;
        this.n = n;
        this.wind_speed = 100;
        this.wind_x = 1;
        this.wind_y = 1;
        this.k_length_multiplier = 2.0 - wave_input.value * 0.02 + 0.01; /* divide by 50 (* 0.02) to make input within [0.4, 2.0], '2.0 - ...' to make slide right more wave */
    }

    gauss_rand(a)
    {
        let rand = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random()),
        sqrt_a = Math.sqrt(a),
        sqrt_2 = Math.sqrt(2.0),
        x = rand * sqrt_a / sqrt_2;
        return new complex(x, x);
    }

    /* p_h(k) = a(e ^ (-1 / (kl) ^ 2)) / k ^ 4 |k dot w| ^ 2
    w = wind direction
    l = v ^ 2 / g = max wave from wind of speed v */
    spectrum(a)
    {
        let k_length = Math.sqrt(a.k_x * a.k_x + a.k_y * a.k_y); /* change wave */
        k_length *= this.k_length_multiplier;
        let k_length2 = k_length * k_length,
        k_length4 = k_length2 * k_length2,
        wind_length = Math.sqrt(a.wind_x * a.wind_x + a.wind_y * a.wind_y),
        l_philips = a.wind_speed * a.wind_speed * wind_length / a.g,
        l_phillips2 = l_philips * l_philips,
        k_x = a.k_x / k_length,
        k_y = a.k_y / k_length,
        wind_k_dot = k_x * a.wind_x / wind_length + k_y * a.wind_y / wind_length,
        wind_k_dot2 = wind_k_dot * wind_k_dot,
        wind_k_dot4 = wind_k_dot2 * wind_k_dot2;
        if(!wind_k_dot)
            return 0.0;
        return a.amplitude * Math.exp(-1.0 / (k_length2 * l_phillips2)) / k_length4 * wind_k_dot4;
    }

    htilde0()
    {
        let n = 2 * this.n,
        a = new Array(n);
        for(let i = 0; i < n; ++i)
        {
            a[i] = new Array(n);
            for(let j = 0; j < n; ++j)
            {
                let spectrum = 
                {
                    amplitude: this.amplitude,
                    g: this.g,
                    wind_speed: this.wind_speed,
                    wind_x: this.wind_x,
                    wind_y: this.wind_y,
                    k_x: 2.0 * Math.PI * (i - this.n / 2.0) / this.length,
                    k_y: 2.0 * Math.PI * (j - this.n / 2.0) / this.length,
                };
                a[i][j] = this.gauss_rand(this.spectrum(spectrum));
            }
        }
        return a;
    }

    htilde1()
    {
        let n = 2 * this.n,
        a = new Array(n);
        for(let i = 0; i < n; ++i)
        {
            a[i] = new Array(n);
            for(let j = 0; j < n; ++j)
            {
                let spectrum =
                {
                    amplitude: this.amplitude,
                    g: this.g,
                    wind_speed: this.wind_speed,
                    wind_x: this.wind_x,
                    wind_y: this.wind_y,
                    k_x: 2.0 * Math.PI * (-i - this.n / 2.0) / this.length,
                    k_y: 2.0 * Math.PI * (-j - this.n / 2.0) / this.length,
                };
                a[i][j] = new complex().conj(this.gauss_rand(this.spectrum(spectrum)));
            }
        }
        return a;
    }

    ocean(t, h0, h1)
    {
        if(move.value == 1)
            t = 1;
        let n = this.n,
        a = {x: new Array(n), y: new Array(n), z: new Array(n)};
        for(let i = 0; i < n; ++i)
        {
            a.x[i] = new Array(n);
            a.y[i] = new Array(n);
            a.z[i] = new Array(n);
            for(let j = 0; j < n; ++j)
            {
                let k_x = 2.0 * Math.PI * (i - this.n / 2.0) / this.length,
                k_y = 2.0 * Math.PI * (j - this.n / 2.0) / this.length,
                k_length = Math.sqrt(k_x * k_x + k_y * k_y),
                omega = Math.sqrt(this.g * k_length),
                polar = new complex().polar(1.0, t * omega),
                h0_t = new complex().mul(h0[i][j], polar),
                h1_t = new complex().mul(h1[i][j], new complex().conj(polar)),
                h_tilde = new complex().add(h0_t, h1_t),
                h_img = new complex().mul(new complex(0, 1.0), h_tilde),
                x = new complex().scalar_mul(h_img, k_x / k_length),
                z = new complex().scalar_mul(h_img, k_y / k_length);
                a.x[i][j] = x;
                a.y[i][j] = h_tilde;
                a.z[i][j] = z;
            }
        } /* console.log(new array().dim([a.x, a.y, a.z])); */
        return a; /* complex a[3][n][n] */
    }
}