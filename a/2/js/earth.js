function earth()
{
    let m = new Matrix(),
    mov = move.value;
    m.save();
        m.translate(.23 * Math.PI * Math.sin(time), .23 * Math.PI * Math.cos(time), 0);
        m.save();
            m.scale(.1);
            m.rotx(Math.PI / 2);
            m.rotz(Math.PI * .5 * mov * time);
            S.drawMesh(S.sphereMesh, m.get(), 5, 'image/2.png');
        m.restore();
    m.restore();
}