class array
{
    add(a, b, c)
    {
        let n = a.length;
        for(let i = 0; i < n; ++i)
            c[i] = a[i] + b[i];
        return c;
    }

    scalar_mul(a, b, c)
    {
        let n = b.length;
        for(let i = 0; i < n; ++i)
            c[i] = a * b[i];
        return c;
    }

    cross(a, b, c)
    { 
        if(!a || !b || !a.length || !b.length)
            return;
        c[0] = a[1] * b[2] - a[2] * b[1];
        c[1] = a[2] * b[0] - a[0] * b[2];
        c[2] = a[0] * b[1] - a[1] * b[0]; 
    }

    norm(a)
    {
        let n = a.length, res = 0;
        for(let i = 0; i < n; ++i)
            res += a[i] * a[i];
        return Math.sqrt(res);
    }

    normalize(a, b)
    {
        let n = this.norm(a);
        if(n == 0)
            return;
        b[0] = a[0] / n;
        b[1] = a[1] / n;
        b[2] = a[2] / n;
    }

    dim(a)
    {
        if(!a)
            return [];
        let out = [];
        while(1)
        {
            out.push(a.length);
            if(Array.isArray(a[0]))
                a = a[0];
            else
                break;
        }
        return out;
    }
}