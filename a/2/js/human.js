function human()
{
    let m = new Matrix();
    ld0 = normalize([Math.cos(time), Math.sin(time), 1]),
    ld1 = normalize([-1, -1, 1]),
    ld_data = [];
    for(let i = 0; i < 3; ++i)
        ld_data.push(ld0[i]);
    for(let i = 0; i < 3; ++i)
        ld_data.push(ld1[i]);
    S.setUniform('1f', 'u_time', time);
    S.setUniform('3fv', 'u_light_direct', ld_data);
    S.setUniform('3fv', 'u_light_color', [1, 1, 1, .5, .3, .1]);
    S.setUniform('Matrix4fv', 'u_material', false, S.material.flat());
    S.setUniform('Matrix4fv', 'uProject', false,
    [1,0,0,0, 0,1,0,0, 0,0,1,-.2, 0,0,0,1]);

    let rate = 2 * time * move_rate.value / 100,
    t = rate - Math.PI / 2,
    arm_length = .1 + .9 * arm_len.value / 100,
    leg_length = .1 + .9 * leg_len.value / 100,
    n_finger = finger_number.value,
    n_toe = toe_number.value;

    m.identity();
    m.translate(.5, 0, 0);
    m.scale(.3);
    m.roty(Math.sin(.5 * rate));
    m.save();
        m.save(); /* head */
            m.rotx(.1 * Math.cos(t));
            m.translate(0, .73, 0);
            m.rotz(.3 * Math.cos(2 * time));
            m.save();
                m.translate(0, .12, 0);
                m.scale(.1, .14, .1);
                m.save(); /* hair */
                    m.translate(0, .5, 0);
                    m.scale(.9, .7, .8);
                    m.rotx(-Math.PI / 2);
                    S.draw_mesh2(S.half_sphere_mesh2, m.get(), S.material[7]);
                    m.save(); /* left */
                        m.scale(.5, .65, .7);
                        m.translate(-1.25, -.18, .2);
                        m.rotx(-Math.PI);
                        m.roty(-Math.PI / 2);
                        S.draw_mesh2(S.half_sphere_mesh2, m.get(), S.material[7]);
                    m.restore();
                    m.save(); /* right */
                        m.scale(.5, .8, .7);
                        m.translate(1.25, -.18, .2);
                        m.rotx(Math.PI);
                        m.roty(Math.PI / 2);
                        S.draw_mesh2(S.half_sphere_mesh2, m.get(), S.material[7]);
                    m.restore();
                m.restore();
                m.save(); /* ear */
                    m.translate(-1, -.06, 0);
                    m.scale(.07, .19, .2);
                    m.save();
                        m.translate(0, .22, 0);
                        m.scale(1, .7, 1);
                        S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                    m.restore();
                    m.save();
                        m.rotx(Math.PI);
                        S.draw_mesh2(S.half_sphere_mesh, m.get(), S.material[0]);
                    m.restore();
                    m.translate(0, -.5, 0);
                    m.scale(1, .5, .5);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                m.restore();
                m.save(); /* ear */
                    m.translate(1, -.06, 0);
                    m.scale(.07, .19, .2);
                    m.save();
                        m.translate(0, .22, 0);
                        m.scale(1, .7, 1);
                        S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                    m.restore();
                    m.save();
                        m.rotx(Math.PI);
                        S.draw_mesh2(S.half_sphere_mesh, m.get(), S.material[0]);
                    m.restore();
                    m.translate(0, -.5, 0);
                    m.scale(1, .5, .5);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                m.restore();
                S.draw_mesh2(S.sphere_mesh, m.get(), S.material[1]);
                m.save(); /* eye */
                    m.translate(-.5, .26, .8);
                    m.scale(.17, .06, .1);
                    m.save(); /* eyebrow */
                        m.translate(.2, 2, -.5);
                        m.scale(1.6, .5, 1.4);
                        S.draw_mesh4(octahedron(20, 10), m.get(), S.material[7]);
                        m.translate(.2, 0, 0);
                        m.roty(Math.PI / 3)
                        S.draw_mesh4(octahedron(20, 10), m.get(), S.material[7]);
                    m.restore();
                    m.save();
                        m.scale(.5, 1, 1);
                        m.translate(-.3, 0, 0);
                        S.draw_mesh2(S.sphere_mesh, m.get(), S.material[7]);
                    m.restore();
                    m.scale(1.4, 1, 1.4);
                    S.draw_mesh4(octahedron(20, 10), m.get(), S.material[6]);
                m.restore();
                m.save(); /* eye */
                    m.translate(.5, .26, .8);
                    m.scale(.17, .06, .1);
                    m.save(); /* eyebrow */
                        m.translate(-.2, 2, -.5);
                        m.scale(1.6, .5, 1.4);
                        S.draw_mesh4(octahedron(20, 10), m.get(), S.material[7]);
                        m.translate(.2, 0, 0);
                        m.roty(Math.PI / 3);
                        S.draw_mesh4(octahedron(20, 10), m.get(), S.material[7]);
                    m.restore();
                    m.save();
                        m.scale(.5, 1, 1);
                        m.translate(.3, 0, 0);
                        S.draw_mesh2(S.sphere_mesh, m.get(), S.material[7]);
                    m.restore();
                    m.save();
                        m.scale(1.4, 1, 1.4);
                        S.draw_mesh4(octahedron(20, 10), m.get(), S.material[6]);
                    m.restore();
                m.restore();
                m.save(); /* nose */
                    m.translate(.6, -.06, 1.2);
                    cone3([], 0, S.material[0], m); /* m.scale(.07, .18, .07); S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]); */
                m.restore();
                m.save(); /* mouth */
                    m.translate(0, -.4, 1);
                    m.scale(.25, .07, .07);
                    S.draw_mesh4(octahedron(20, 10), m.get(), S.material[0]); /* S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]); */
                m.restore();
            m.restore();
        m.restore();

        m.rotx(.1 * Math.cos(t));
        for(let i = -1; i <= 1; i += 2)
        {/* arm */
            let t = rate + i * Math.PI / 2;
            m.save();
                m.translate(i * .2, .6 + .03 * Math.cos(t), 0);
                m.rotx(Math.cos(t));
                m.save(); /* joint */
                    m.rotx(Math.PI / 2);
                    m.scale(.018, arm_length / 11, .018);
                    S.draw_mesh2(S.tube_mesh, m.get(), S.material[0]);
                    m.scale(1, 1, 2);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                m.restore();
                m.save(); /* top */
                    m.translate(0, -arm_length / 2, 0);
                    m.scale(.03, arm_length / 2, .03);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                    S.draw_mesh2(S.tube_mesh, m.get(), S.material[0]);
                m.restore();
                m.translate(0, -arm_length, 0);
                m.rotx(-1 + .7 * Math.sin(t));
                m.save(); /* joint */
                    m.rotx(Math.PI / 2);
                    m.scale(.018, arm_length / 11, .018);
                    S.draw_mesh2(S.tube_mesh, m.get(), S.material[0]);
                m.restore();
                m.save(); /* bottom */
                    m.translate(0, -arm_length / 2, 0);
                    m.scale(.027, arm_length / 2, .027);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
                    S.draw_mesh2(S.tube_mesh, m.get(), S.material[0]);
                m.restore();
                m.save(); /* joint */
                    m.rotx(Math.PI / 2);
                    m.scale(.018, arm_length / 11, .018);
                    S.draw_mesh2(S.tube_mesh, m.get(), S.material[0]);
                m.restore();
                m.translate(0, -arm_length, .03);
                m.save(); /* hand */
                    m.translate(0, -arm_length / 10, -.03);
                    m.scale(.01, arm_length / 10, .02);
                    S.draw_mesh2(S.cube_mesh, m.get(), S.material[1]);
                m.restore();
                for(let j = 0; j < n_finger; ++j)
                {/* finger */
                    m.save();
                        m.rotx(j / Math.PI / 2);
                        m.translate(0, -arm_length / 5, 0);
                        m.scale(.01, arm_length / 5, .01);
                        S.draw_mesh2(S.sphere_mesh, m.get(), S.material[1]);
                    m.restore();
                }
            m.restore();
        }

        for(let i = -1; i <= 1; i += 2)
        {/* leg */
            let t = rate - i * Math.PI / 2;
            m.save();
                m.translate(i * .1, .1 + .03 * Math.cos(t), 0);
                m.rotx(Math.cos(t));
                m.save(); /* top */
                    m.translate(0, -leg_length / 2, 0);
                    m.scale(.05, leg_length / 2, .05);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[1]);
                    m.save();
                        m.scale(.9, 1, .9);
                        S.draw_mesh2(S.tube_mesh, m.get(), S.material[1]);
                    m.restore();
                m.restore();
                m.translate(0, -leg_length, 0);
                m.rotx(1 + Math.sin(t));
                m.save(); /* joint */
                    m.rotx(Math.PI / 2);
                    m.scale(.02, arm_length / 11, .02);
                    S.draw_mesh2(S.tube_mesh, m.get(), S.material[1]);
                    m.scale(1, 1, 2);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[1]);
                m.restore();
                m.save(); /* bottom */
                    m.translate(0, -leg_length / 2, 0);
                    m.scale(.05, leg_length / 2, .05);
                    S.draw_mesh2(S.sphere_mesh, m.get(), S.material[1]);
                    m.save();
                        m.scale(.8, .8, .8);
                        S.draw_mesh2(S.tube_mesh, m.get(), S.material[1]);
                    m.restore();
                m.restore();
                m.translate(0, -leg_length, 0);
                m.rotx(-Math.PI);
                m.roty(Math.PI / 2);
                m.rotz(Math.PI / 2);
                m.save(); /* foot */
                    m.translate(0, -arm_length / 6, 0);
                    m.scale(.01, arm_length / 6, .02);
                    S.draw_mesh2(S.cube_mesh, m.get(), S.material[1]);
                m.restore();
                m.rotx(-Math.PI / 10);
                for(let j = 0; j < n_toe; ++j)
                {/* toe */
                    m.save();
                        m.rotx(j / Math.PI / 2.3);
                        m.translate(0, -arm_length / 5, 0);
                        m.scale(.01, arm_length / 5, .01);
                        S.draw_mesh2(S.sphere_mesh, m.get(), S.material[1]);
                    m.restore();
                }
            m.restore();
        }
    m.restore();

    /* body */
    m.save();
        m.rotx(.1 * Math.cos(t));
        m.save(); /* top */
            m.translate(0, .55, 0);
            m.scale(.21, .2, .13);
            m.rotx(Math.PI / 2);
            S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
        m.restore();
        m.rotx(.07 * Math.cos(t));
        m.save();
            m.translate(0, .3, 0);
            m.scale(.15, .3, .11);
            m.rotx(Math.PI / 2);
            S.draw_mesh2(S.sphere_mesh, m.get(), S.material[0]);
        m.restore();
        m.save();
            m.translate(0, .4, 0);
            m.scale(.15, .4, .1);
            m.rotx(Math.PI / 2);
            S.draw_mesh2(S.half_sphere_mesh, m.get(), S.material[0]);
        m.restore();
    m.restore();

    /* neck */
    m.save();
    m.rotx(.1 * Math.cos(t));
    m.translate(0, .7, 0);
    m.scale(.06, .08, .06);
    m.rotx(Math.PI / 2);
    S.draw_mesh2(S.tube_mesh, m.get(), S.material[1]);
    m.restore();
}