import { vec3 } from 'gl-matrix';
import { Ray } from 'ray-disk-intersection';
export declare type Cone = {
    cosa: number;
    axis: vec3 | number[];
    height: number;
    tipPos: vec3 | number[];
};
export { Ray, };
export declare function intersectCone(cone: Cone, ray: Ray): {
    t: number;
    n: vec3;
} | null;
