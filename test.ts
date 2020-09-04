import tape = require('tape');
import {
    Cone,
    intersectCone,
} from './src';
import { vec3 } from 'gl-matrix';
import { table } from 'console';

tape('cone intersection 1', async (t) => {
    const cone:Cone = {
        cosa: Math.cos(Math.PI / 4),
        axis: [0, -1, 0],
        height: 5,
        tipPos: [0, 5, 0],
    };

    const ray = {
        origin: [10, 4.999999, 0],
        dir: [-1, 0, 0],
    };
    const result = intersectCone(cone, ray);
    console.log(result);
    if (result) {
        t.equal(Math.abs(result.t - 10) < 1e-6, true, 'intersect at tip position');
        t.equal(Math.abs(Math.sqrt(2) / 2 - result.n[0]) < 1e-6, true, 'normal.x at surface should be (√2)/2');
    }
    t.end();
});

tape('cone intersection 2', async (t) => {
    const cone:Cone = {
        cosa: Math.cos(Math.PI / 4),
        axis: [0, -1, 0],
        height: 5,
        tipPos: [0, 5, 0],
    };
    const ray = {
        origin: [10, 2.5, 0],
        dir: [-1, 0, 0],
    };

    const result = intersectCone(cone, ray);
    console.log(result);
    if (result) {
        t.equal(Math.abs(result.t - 7.5) < 1e-6, true, 'scale factor is 7.5');
        t.equal(Math.abs(Math.sqrt(2) / 2 - result.n[0]) < 1e-6, true, 'normal.x at surface should be (√2)/2');
    }
    t.end();
});

tape('cone intersection 2', async (t) => {
    const cone:Cone = {
        cosa: Math.cos(Math.PI / 4),
        axis: [0, -1, 0],
        height: 5,
        tipPos: [0, 5, 0],
    };

    const ray = {
        origin: [0, -2.5, 0],
        dir: vec3.normalize(vec3.create(), [0.2, 0.9, 0]),
    };

    const result = intersectCone(cone, ray);
    console.log('ray shoot from the bottom, should intersect with bottom disk');
    console.log(result);
    if (result) {
        t.equal(result.n[1], -1, 'the bottom disk normal.y is -1');
    }
    t.end();
});