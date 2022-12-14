rooms.scene = function()
{
    lib();

    description = `<b>spline aircraft</b><br>
    <button id = 'move' onclick = 'handle_click()' value = 0 style = 'width : 200px; height: 50px; background-color: black; color: white'>start or stop movement</button><br>
    <input type = range id = move_rate> rate<br>
    <input type = range id = arm_len value = 28> arm length<br>
    <input type = range id = leg_len value = 40> leg length<br>
    <input type = range id = finger_number value = 5> finger number<br>
    <input type = range id = toe_number value = 5> toe number<br>`;

    code = 
    {
        'init': 
        line(27) + 
        `S.n_light = 2;
        S.textures = {};
        `,
        fragment: `
        let header = \`const int n_light = \` + S.n_light + \`;
        const int nL = \` + S.nL + \`;
        const int nM = \` + S.nM + \`;\`
        shader_file('js/scene.frag', 1, header);
        `,
        vertex: `
        shader_file('js/scene.vert', 0, '');
        `,
        render: `
        /* set the projection matrix based on camera focal length */
        let fl = 5.0;
        S.setUniform('Matrix4fv', 'uProject', false,
        [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);

        /* specify scene lighting */
        S.nL = 2;
        S.setUniform('3fv', 'uLd', [ .57,.57,.57, -.57,-.57,-.57 ]);
        S.setUniform('3fv', 'uLc', [ 1,1,1, .5,.3,.1 ]);
        S.setUniform('3fv', 'uBgColor', [ .89,.81,.75 ]);

        sky();
        earth();
        plane();
        human();
        `,
        events: `;`
    };
}