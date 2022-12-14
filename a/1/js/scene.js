function main()
{
    let canvas = document.getElementById('canvas'),
    gl = canvas.getContext('webgl'),
    vertex_size = 16;

    let a = {gl: gl, vertex_size: vertex_size, vertex_file: 'glsl/0.vert', fragment_file: 'glsl/0.frag'};
    lib(a);

    let rectangle = mesh(a).rectangle_mesh;
    mesh(a).draw_mesh(rectangle);

    gl.clearColor(0.0, 0.0, 0.0, 0.4);
    gl.clear(gl.COLOR_BUFFER_BIT);
}