function sky()
{   
   let m = new Matrix(),
   mov = move.value;
   m.save();
      m.translate(0, 0, -100);
      S.drawMesh(S.squareMesh, m.get(), 0, 'image/0.png');
   m.restore();
   m.save();
      m.translate(0, -1, -100);
      S.drawMesh(S.square_mesh(.01 * mov * time), m.get(), 5);
   m.restore();
}