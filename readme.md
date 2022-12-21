# waterfall from mountains
Xi Liu<br>
This project is done for computer graphics course at New York University, fall 2022, using WebGL.<br>
Wave simulation using fast fourier transformation. The task is to find height $h$ given horizontal position $x, z$, and $t$.<br>
Decompose the wave height field as a sum of sin and cos waves decomposition using fft.<br>
let $S(\mathbb{R} ^ n, \mathbb{C}) = \{f \in \mathbb{C} ^ {\infty}(\mathbb{R} ^ n, \mathbb{C) | \forall \alpha, \beta \in \mathbb{N}, \sup_{x \in \mathbb{R}} |x ^ {\alpha} (D ^ {\beta} f)(x)| < \infty\}$, $f \in \mathscr{S}(\mathbb{R} ^ n)$ be a signal. Discrete fourier transform of a discrete signal $\textbf{f}$
```math
\displaylines
{
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

generates height field at discrete points $x = (n l_x / N, m l_z / M)$

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

oop make easy to switch shaders
load glsl files is still hard, need to setup servers to do it
why can i only do <script src = 'js'> but cannot just do <script src = 'glsl'>
currently shaders are written in the html files
to be easier to switched when just getelementbyid

for future work, the fft and philips spectrum calculations in gpu compute shaders instead of cpu
currently code is in cpu, cpu have the advantage of more flexible in the coding part
where classes can be easily called by other classes, webassembly also can be used

![0](a/image/0.png)
![1](a/image/1.png)
![2](a/image/2.png)
