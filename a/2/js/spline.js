rooms.spline = function() {

lib();

description = `<b>scene</b>`;

code = {
'init': 
line(27),
fragment: `
S.setFragmentShader(\`
    const int nL = \` + S.nL + \`;
    const int nM = \` + S.nM + \`;
    uniform vec3 uBgColor;
    uniform vec3 uLd[nL];
    uniform vec3 uLc[nL];
    uniform mat4 uMaterial;
    varying vec3 vPos, vNor;

    void main() {
        vec3 N = normalize(vNor);
        vec3  ambient  = uMaterial[0].rgb;
        vec3  diffuse  = uMaterial[1].rgb;
        vec3  specular = uMaterial[2].rgb;
        float p        = uMaterial[2].a;
        vec3 c = mix(ambient, uBgColor, .3);
        for (int l = 0 ; l < nL ; l++) {
            vec3 R = 2. * dot(N, uLd[l]) * N - uLd[l];
            c += uLc[l] * (diffuse * max(0.,dot(N, uLd[l]))
                        + specular * pow(max(0., R.z), p));
        }
        gl_FragColor = vec4(c, 1.);
    }
\`);
`,
vertex: `
S.setVertexShader(\`
    attribute vec3 aPos, aNor;
    uniform   mat4 uMatrix, uInvMatrix, uProject;
    varying   vec3 vPos, vNor;

    void main() {
        vPos = (uProject * uMatrix * vec4(aPos, 1.)).xyz;
        vNor = (vec4(aNor, 0.) * uInvMatrix).xyz;
        gl_Position = vec4(vPos.xy, -.01 * vPos.z, 1.);
    }
\`)
`,
render: `
    S.revolutionMesh = S.createRevolutionMesh(16, 32, [
        {z:-1  , r:0  },
        {z:-.99, r:.1 },
        {z:-.7 , r:.5 },
        {z: .3 , r:.1 },
        {z: .8 , r:.3 },
        {z: 1  , r:0  },
    ]);

    let extrusionData = {
        radius: 0.2,
        profile: [
            {x:-1 , y:-1 , z: 0},
            {x: 1 , y:-1 , z: 0},
            {x: 1 , y: 1 , z: 0},
            {x:-1 , y: 1 , z: 0},
        ],
        path: [
            {x:-1, y:-1, z: 0},
            {x: 1, y:-1, z: 0},
            {x: 1, y: 1, z: 0},
            {x:-1, y: 1, z: 0},
        ]
    };
    
    /* extrusion_data = {
        radius: 0.2,
        profile: [
           {x:-1 , y:-1 , z: 0},
           {x: 1 , y:-1 , z: 0},
           {x: 1 , y: 1 , z: 0},
           {x:-1 , y: 1 , z: 0},
        ],
        path: [
           {x: 1, y:-1, z: 0},
           {x:-1, y:-1, z: 0},
           {x:-1, y: 1, z: 0},
           {x: 1, y: 1, z: 0},
        ]
     }; */

    S.extrusionMesh = S.createExtrusionMesh(24, 8, extrusionData);

    // SET THE PROJECTION MATRIX BASED ON CAMERA FOCAL LENGTH

    let fl = 5.0;
    S.setUniform('Matrix4fv', 'uProject', false,
        [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);

    // SPECIFY SCENE LIGHTING

    S.nL = 2;
    S.setUniform('3fv', 'uLd', [ .57,.57,.57, -.57,-.57,-.57 ]);
    S.setUniform('3fv', 'uLc', [ 1,1,1, .5,.3,.1 ]);
    S.setUniform('3fv', 'uBgColor', [ .89,.81,.75 ]);

    // RENDER THE SCENE

    let m = new Matrix();
    m.save();
        m.scale(.5);
        m.rotx(-Math.PI/5 * Math.sin(time));
        m.roty(Math.PI * Math.cos(time));
        m.rotz(Math.PI/5 * Math.cos(time));
        S.drawMesh(S.revolutionMesh, m.get(), 0);
        S.drawMesh(S.extrusionMesh, m.get(), 1);
        /* S.drawMesh(S.createExtrusionMesh(24, 8, extrusion_data), m.get(), 1); */
    m.restore();
`,
events: `
    ;
`
};

}    