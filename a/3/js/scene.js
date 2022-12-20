window.onload = function()
{
    let canvas = document.getElementById('canvas'),
    gl = canvas.getContext('webgl2'),
    wave1 = new wave(gl, canvas, gl.TRIANGLES);
    wave1.gen();
    wave1.draw_mesh();

    document.getElementById('forward_input').onchange =
    function()
    {
        wave1.camera.forward();
    };
    
    document.getElementById('backward_input').onchange =
    function()
    {
        wave1.camera.backward();
    };
};