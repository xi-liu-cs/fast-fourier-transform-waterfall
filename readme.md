# waterfall from mountains
![2](a/image/2.png)
Xi Liu<br>
This project is done for computer graphics course at New York University, fall 2022, using WebGL.<br>
Wave simulation using fast fourier transformation. The task is to find height $h$ given horizontal position $x, z$, and $t$.<br>
Decompose the wave height field as a sum of sin and cos waves decomposition using fft.<br>
Let $\mathscr{S}(\mathbb{R} ^ n, \mathbb{C}) = \\{f \in \mathbb{C} ^ {\infty}(\mathbb{R} ^ n, \mathbb{C}) | \forall \alpha, \beta \in \mathbb{N} ^ n, \sup_{x \in \mathbb{R} ^ n} |x ^ {\alpha} \delta ^ {\beta} f(x)| < \infty\\}$ be a schwartz space, $f \in \mathscr{S}(\mathbb{R} ^ n)$ be a signal. Define $\widetilde f$ as the fourier transform of $f$
```math
\displaylines
{
  \widetilde{f}(k) = \int_{\mathbb{R} ^ n} f(x) e ^ {-2 \pi i k x} dx\\
  \text{for discrete signal $f$ with $N$ samples}\\
  \widetilde{f}[k] = \sum_{n = 0} ^ {N - 1} f[n] e ^ {\frac{-2 \pi i k n}{N}}\\
  \text{computing $\widetilde{f}$ of $f$ with $N$ samples naively require $N$ complex multiplications}\\
  \text{and $N - 1$ complex additions for each element of $\widetilde{f}$, so its total time complexity is $\mathcal{O}(n ^ 2)$}\\
  \text{with fft, the time complexity is reduced to $\mathcal{O}(n \log n)$}\\
  \text{let } h(t) \text{ be an arbitrary, aperiodic function}\\
  \text{wave height } h(\text{x}, t), \text{horizontal position } \text{x} = (x, z)\\
  h(\text{x}, t) = \sum_{\text{k}} \widetilde{h} (\text{k}, t) e ^ {i\text{k} \cdot \text{x}}\\
}
```

expresses wave height at horizontal position $(x, z)$ as sum of sinusoids
with complex time dependent amplitudes

```math
\displaylines
{
  \mathbf{x} = (x, z)\\
  h(\mathbf{x}, t) = \sum \widetilde{h} (\mathbf{k}, t) e ^ {i\mathbf{k} \cdot \mathbf{x}}\\
}
```

$\mathbf{k}$ is a 2d vector with components
for a wave with horizontal dimensions $L_x \times L_z$
```math
\displaylines
{
  k = (k_x, k_z)\\
  k_x = 2 \pi n / L_x\\
  k_z = 2 \pi n / L_z\\
  -N / 2 \leq n < N / 2\\
  -M / 2 \leq m < M / 2\\
}
```

generates height field at discrete points $x = (n L_x / N, m L_z / M)$

float value
wave spectrum $p_h(k)$
```math
p_h(k) = \frac{a(e ^ {-1 / (kl) ^ 2})}{k ^ 4} |k \cdot w| ^ 2
```
$w$ = wind direction
$l = v ^ 2 / g$ = max wave from wind of speed v

where $L = V ^ 2 / g$ is the largest possible waves arising
from a continuous wind of speed $V$,
$g$ is the gravitational constant, and $w$ is
the direction of the wind

$\widetilde{h}(k) = 1 / \sqrt{2} (\xi_r + i \xi_i) \sqrt{p_h(k)}$
where $ξr$ and $ξi$ are ordinary independent draws from a gaussian
random number generator, with mean 0 and standard deviation 1.
Gaussian distributed random numbers tend to follow the experimental data on ocean waves

in the fft representation,
the 2d displacement vector field is computed using the fourier amplitudes
of the height field, as
$D(X, t) = \sum -i K / k \widetilde{h}(K, t) e ^ {ikx}$

```javascript
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
}
```

for the fft computation, the cooley tukey fft algorithm is used.
the result of 2d ifft is a wave height field.
then the glsl functions texture2d is used to lookup from within that texture.

do not try to see this project on a mobile device, since a lot of the mobile
devices do not support opengl extensions for floating point textures
```javascript
this.gl.getExtension("EXT_color_buffer_float"); /* enable gl.RGBA32F to be color renderable */
this.gl.getExtension("OES_texture_float_linear"); /* linear filtering with float pixel textures */
```

to lower the branch divergence on the gpu, several shaders are used now. for future work, the fft and philips spectrum calculations can be done in gpu compute shaders instead of cpu. currently code is in cpu, cpu have the advantage of more flexible in the coding part where classes can be easily called by other classes. webassembly also can be used

![0](a/image/0.png)
![1](a/image/1.png)
