import { vec3, ReadonlyVec3 } from 'gl-matrix';

export type TestCone = {
    cosa:number,    //he half angle between the axis and the surface
    axis:vec3|number[],      //axis as a unit vector ^V in the direction of increasing radius
    height:number,
    tipPos:vec3|number[],
};

export function intersectCone(cone:TestCone, ray:{ origin:vec3 | number[], dir:vec3 | number[] }) {
    const co = vec3.sub(vec3.create(), ray.origin as ReadonlyVec3, cone.tipPos as ReadonlyVec3);
    const rDir_dot_axis = vec3.dot(ray.dir as ReadonlyVec3, cone.axis as ReadonlyVec3);
    const co_dot_axis = vec3.dot(co, cone.axis as ReadonlyVec3);
    const cosA2 = cone.cosa * cone.cosa;
    const a = rDir_dot_axis * rDir_dot_axis - cosA2;
    const b = 2 * (rDir_dot_axis * co_dot_axis - vec3.dot(ray.dir as ReadonlyVec3, co) * cosA2);
    const c = co_dot_axis * co_dot_axis - vec3.dot(co, co) * cosA2;

    let det = b * b - 4 * a * c;
    if (det < 0) {
        return null;
    }
    det = Math.sqrt(det);
    const t1 = (-b - det) / (2. * a);
    const t2 = (-b + det) / (2. * a);
    let t = t1;
    if (t < 0. || t2 > 0. && t2 < t) {
        t = t2;
    }
    if (t < 0.) {
        return null;
    }
    const cp = vec3.sub(vec3.create(), vec3.add(vec3.create(), ray.origin as ReadonlyVec3, vec3.scale(vec3.create(), ray.dir as ReadonlyVec3, t)), cone.tipPos as ReadonlyVec3);
    const h = vec3.dot(cp, cone.axis as ReadonlyVec3);
    if (h < 0 || h > cone.height) {
        return null;
    }
    const axis_dot_cp = vec3.dot(cone.axis as ReadonlyVec3, cp);
    const cp2 = vec3.dot(cp, cp);
    const n = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), vec3.scale(vec3.create(), cp, axis_dot_cp / cp2), cone.axis as ReadonlyVec3));
    return {
        t: t,
        n: n,
    };
}