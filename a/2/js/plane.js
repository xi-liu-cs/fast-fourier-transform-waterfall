function plane()
{
   S.revolutionMesh = S.createRevolutionMesh(16, 32, [
      {z:-1  , r:0  },
      {z:-.99, r:.1 },
      {z:-.7 , r:.5 - .1 * Math.sin(5 * time)},
      {z: .3 , r:.1 },
      {z: .8 , r:.3 },
      {z: 1  , r:0  },
   ]);
   
   S.revolution_mesh = S.createRevolutionMesh(16, 32, [
      {z: -.3, r: .2},
      {z: 1, r: .4},
      {z: 1, r: .3},
      {z: 2, r: .1},
      {z: 1, r: 0},
   
      {z:-1  , r:0  },
      {z:-.99, r:.1 },
      {z:-.7 , r:.5 },
      {z: .3 , r:.1 },
      {z: .8 , r:.3 },
      {z: 1  , r:0  },
   
      {z: 1, r: .4},
      {z: 1.5, r: .2},
      {z: 1.7, r: .1},
      {z: 2, r: .1},
      {z: 3, r: 0},
   ]);
   
   let extrusionData = {
      radius: 0.1,
      profile: [
         {x:-1 , y:-1 , z: 0},
         {x: 1 , y:-1 , z: 0},
         {x: 1 , y: 1 , z: 0},
         {x:-1 , y: 1 , z: 0},
      ],
      path: [
         {x:-.4, y:-.4, z: 0},
         {x: .4, y:-.4, z: 0},
         {x: .4, y: .4, z: 0},
         {x:-.4, y: .4, z: 0},
      ]
   },
   
   extrusion_data = {
      radius: 0.1,
      profile: [
         {x:-1 , y:-1 , z: 0},
         {x: 1 , y:-1 , z: 0},
         {x: 1 , y: 1 , z: 0},
         {x:-1 , y: 1 , z: 0},
      ],
      path: [
         {x: .4, y:-.4, z: 0},
         {x:-.4, y:-.4, z: 0},
         {x:-.4, y: .4, z: 0},
         {x: .4, y: .4, z: 0},
      ]
   },
   
   extrusion_data2 = {
      radius: 0.15,
      profile: [
         {x:-.5 , y:-1 , z: 0},
         {x: .5 , y:-1 , z: 0},
         {x: .5 , y: 1 , z: 0},
         {x:-.5 , y: 1 , z: 0},
      ],
      path: [
         {x: 0, y: 0, z: 0},
         {x: 2, y: 0, z: -.3},
   
         {x: -2, y: 0, z: -.3},
         {x: 0, y: 0, z: 0},
      ]
   };
   
   extrusion_data3 = {
      radius: 0.15,
      profile: [
         {x:-.5 , y:-1 , z: 0},
         {x: .5 , y:-1 , z: 0},
         {x: .5 , y: 1 , z: 0},
         {x:-.5 , y: 1 , z: 0},
      ],
      path: [
         {x: 0, y: 0, z: 0},
         {x: 2, y: 0, z: -.3},
      ]
   };
   
   S.extrusionMesh = S.createExtrusionMesh(24, 8, extrusionData);
   
   let mov = move.value;
   let m = new Matrix();
   m.save();
      m.scale(.3);
      m.rotx(-Math.PI / 3);
      m.roty(-Math.PI / 3);
      m.rotz(Math.PI / 3);
      m.rotx(Math.PI * mov * Math.cos(time));
      m.roty(Math.PI * mov * Math.sin(time));
      S.drawMesh(S.revolution_mesh, m.get(), 3, 'image/1.png');
      m.save();
         m.translate(0, 0, 1);
         m.save();
            m.scale(.7);
            S.drawMesh(S.extrusionMesh, m.get(), 1, 'image/2.png');
            S.drawMesh(S.createExtrusionMesh(24, 8, extrusion_data), m.get(), 1, 'image/2.png');
         m.restore();
         S.drawMesh(S.createExtrusionMesh(24, 8, extrusion_data2), m.get(), 1, 'image/1.png');
         m.translate(0, 0, -1.5);
         m.scale(.55);
         S.drawMesh(S.createExtrusionMesh(24, 8, extrusion_data2), m.get(), 1, 'image/1.png');
         m.rotz(-Math.PI / 2);
         S.drawMesh(S.createExtrusionMesh(24, 8, extrusion_data3), m.get(), 1, 'image/1.png');
      m.restore();
   m.restore();
}