import { vec3, ReadonlyVec3 } from 'gl-matrix';
import { Disk, Ray, intersectDisk } from 'ray-disk-intersection';

export type Cone = {
    cosa:number,    //the half angle between the axis and the surface
    axis:vec3|number[],      //axis as a unit vector ^V in the direction of increasing radius
    height:number,
    tipPos:vec3|number[],
};

export {
    Ray,
};

export function intersectCone(cone:Cone, ray:Ray) : {t:number, n:vec3} | null {
    const origin = ray.origin as ReadonlyVec3;
    const dir = ray.dir as ReadonlyVec3;

    const axis = cone.axis as ReadonlyVec3;
    const tipPos = cone.tipPos as ReadonlyVec3;

    const co = vec3.sub(vec3.create(), origin, tipPos);
    const rDir_dot_axis = vec3.dot(dir, axis);
    const co_dot_axis = vec3.dot(co, axis);
    const cosA2 = cone.cosa * cone.cosa;
    const a = rDir_dot_axis * rDir_dot_axis - cosA2;
    const b = 2 * (rDir_dot_axis * co_dot_axis - vec3.dot(dir, co) * cosA2);
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
    const cp = vec3.create();
    vec3.sub(cp, vec3.add(cp, origin, vec3.scale(cp, dir, t)), tipPos);
    const h = vec3.dot(cp, axis);
    if (h < 0 || h > cone.height) {
        return null;
    }

    const centerAtBottom = vec3.scaleAndAdd(vec3.create(), tipPos, axis, cone.height);
    const h2 = cone.height * cone.height;
    const disk:Disk = {
        p: centerAtBottom,
        n: axis as vec3,
        r: Math.sqrt((h2 / cosA2) - h2),
    };
    const tDisk = intersectDisk(disk, ray);
    if (tDisk !== null && tDisk < t) {
        return {
            t: tDisk,
            n: vec3.copy(vec3.create(), axis),
        };
    }
    const axis_dot_cp = vec3.dot(axis, cp);
    const cp2 = vec3.dot(cp, cp);
    const nor = vec3.create();
    vec3.normalize(nor, vec3.sub(nor, vec3.scale(nor, cp, axis_dot_cp / cp2), axis));
    return {
        t: t,
        n: nor,
    };
}