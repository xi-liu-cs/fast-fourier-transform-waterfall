class fft
{
    constructor(n)
    {
        this.c = new complex();
        this.n = n;
    }

    fft(a)
    {
        let n = a.length,
        n_div_2 = n >> 1,
        out = new Array(n);
        if(n <= 1)
        {
            out[0] = a[0];
            if(Number.isNaN(a[0].x) || Number.isNaN(a[0].y))
                out[0] = new complex(0.0, 0.0);
            return out;
        }
        let even = new Array(n_div_2),
        odd = new Array(n_div_2);
        for(let i = 0; i < n_div_2; ++i)
        {
            even[i] = a[2 * i];
            odd[i] = a[2 * i + 1];
        }
        even = this.fft(even);
        odd = this.fft(odd);
        let omega = -2.0 * Math.PI / n;
        for(let i = 0; i < n_div_2; ++i)
        {
            let polar = this.c.polar(1.0, i * omega);
            odd[i] = this.c.mul(odd[i], polar);
        }
        for(let i = 0; i < n_div_2; ++i)
        {
            out[i] = this.c.add(even[i], odd[i]);
            out[i + n_div_2] = this.c.sub(even[i], odd[i]);
        }
        return out;
    }
    
    inverse(a)
    {
        let n = a.length;
        for(let i = 0; i < n; ++i)
            a[i] = this.c.conj(a[i]);
        let out = this.fft(a);
        for(let i = 0; i < n; ++i)
            out[i] = this.c.conj(out[i]);
        return out;
    }

    ifft(a)
    {
        let n = this.n,
        n2 = n * n,
        a1 = new Array(n),
        a2 = new Array(n),
        a3 = new Array(n),
        out = new Array(n);
        for(let i = 0; i < n; ++i)
            a1[i] = this.inverse(a[i]);
        for(let i = 0; i < n; ++i)
        {
            a3[i] = new Array(n);
            for(let j = 0; j < n; ++j)
                a3[i][j] = this.c.scalar_div(a1[j][i], n2);
            a2[i] = this.inverse(a3[i]);
        }
        for(let i = 0; i < n; ++i)
        {
            out[i] = new Array(n);
            for (let j = 0; j < n; ++j)
                out[i][j] = a2[i][j].x;
        }
        return out; /* float out[n][n] */
    }
}