class complex
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    add(a, b)
    {
        return new complex(a.x + b.x, a.y + b.y);
    }

    sub(a, b)
    {
        return new complex(a.x - b.x, a.y - b.y);
    }

    mul(a, b)
    {
        return new complex(a.x * b.x - a.y * b.y, a.x * b.y + b.x * a.y);
    }

    scalar_mul(a, b)
    {
        return new complex(a.x * b, a.y * b);
    }

    scalar_div(a, b)
    {
        return new complex(a.x / b, a.y / b);
    }

    mod(a)
    {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }

    conj(a)
    {
        return new complex(a.x, -a.y);
    }

    polar(r, theta)
    {
        return new complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}