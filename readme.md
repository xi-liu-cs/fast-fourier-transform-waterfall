```math
\displaylines
{
  \text{let } h(t) \text{ be an arbitrary, aperiodic function}\\
  \text{wave height } h(\text{x}, t), \text{horizontal position } \text{x} = (x, z)\\
  h(\text{x}, t) = \sum_{\text{k}} \widetilde{h} (\text{k}, t) e ^ {i\text{k} \cdot \text{x}}\\
}
```
find height $h$ given horizontal position $x, z$, and $t$
decompose the wave height field as a sum of sin and cos waves
decomposition uses fft, rapid method of evaluating sums

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

```math
\displaylines
{
  k = (k_x, k_z)
  k_x = 2 pi n / l_x
  k_z = 2 pi n / l_z
  l is length of the wave
  -N / 2 <= n < N / 2
  -M / 2 <= m < M / 2
}
```

generates height field at discrete points x = (n l_x / N, m l_z / M)

float value
wave spectrum p_h(k)
p_h(k) = a(e ^ (-1 / (kl) ^ 2)) / k ^ 4 |k dot w| ^ 2
    w = wind direction
    l = v ^ 2 / g = max wave from wind of speed v

where L = V ^ 2 / g is the largest possible waves arising
from a continuous wind of speed V,
g is the gravitational constant, and w is
the direction of the wind

htilde0(k) = 1 / sqrt{2} (ξ_r + i ξ_i) sqrt{p_h(k)}
where ξr and ξi are ordinary independent draws from a gaussian
random number generator, with mean 0 and standard deviation 1.
Gaussian distributed random numbers tend to follow the experimental data on ocean waves

in the fft representation,
the 2d displacement vector field is computed using the fourier amplitudes
of the height field, as
D(X, t) = sum -i K / k htilde(K, t) e ^ {ikx}

oop make easy to switch shaders
load glsl files is still hard, need to setup servers to do it
why can i only do <script src = 'js'> but cannot just do <script src = 'glsl'>
https://stackoverflow.com/questions/48946159/load-glsl-file-webgl-in-html
currently shaders are written in the html files
to be easier to switched when just getelementbyid

if more time, do the fft and philips spectrum calculations in gpu in compute shaders instead of cpu
currently code is in cpu, cpu have the advantage of more flexible in the coding part
where classes can be easily called by other classes, webassembly also can be used
