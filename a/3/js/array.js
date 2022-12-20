class array
{
    add(a, b, c)
    {
        let n = a.length;
        for(let i = 0; i < n; ++i)
            c[i] = a[i] + b[i];
        return c;
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