"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectCone = void 0;
var gl_matrix_1 = require("gl-matrix");
var ray_disk_intersection_1 = require("ray-disk-intersection");
function intersectCone(cone, ray) {
    var origin = ray.origin;
    var dir = ray.dir;
    var axis = cone.axis;
    var tipPos = cone.tipPos;
    var co = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), origin, tipPos);
    var rDir_dot_axis = gl_matrix_1.vec3.dot(dir, axis);
    var co_dot_axis = gl_matrix_1.vec3.dot(co, axis);
    var cosA2 = cone.cosa * cone.cosa;
    var a = rDir_dot_axis * rDir_dot_axis - cosA2;
    var b = 2 * (rDir_dot_axis * co_dot_axis - gl_matrix_1.vec3.dot(dir, co) * cosA2);
    var c = co_dot_axis * co_dot_axis - gl_matrix_1.vec3.dot(co, co) * cosA2;
    var det = b * b - 4 * a * c;
    if (det < 0) {
        return null;
    }
    det = Math.sqrt(det);
    var t1 = (-b - det) / (2. * a);
    var t2 = (-b + det) / (2. * a);
    var t = t1;
    if (t < 0. || t2 > 0. && t2 < t) {
        t = t2;
    }
    if (t < 0.) {
        return null;
    }
    var cp = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.sub(cp, gl_matrix_1.vec3.add(cp, origin, gl_matrix_1.vec3.scale(cp, dir, t)), tipPos);
    var h = gl_matrix_1.vec3.dot(cp, axis);
    if (h < 0 || h > cone.height) {
        return null;
    }
    var centerAtBottom = gl_matrix_1.vec3.scaleAndAdd(gl_matrix_1.vec3.create(), tipPos, axis, cone.height);
    var h2 = cone.height * cone.height;
    var disk = {
        p: centerAtBottom,
        n: axis,
        r: Math.sqrt((h2 / cosA2) - h2),
    };
    var tDisk = ray_disk_intersection_1.intersectDisk(disk, ray);
    if (tDisk !== null && tDisk < t) {
        return {
            t: tDisk,
            n: gl_matrix_1.vec3.copy(gl_matrix_1.vec3.create(), axis),
        };
    }
    var axis_dot_cp = gl_matrix_1.vec3.dot(axis, cp);
    var cp2 = gl_matrix_1.vec3.dot(cp, cp);
    var nor = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.normalize(nor, gl_matrix_1.vec3.sub(nor, gl_matrix_1.vec3.scale(nor, cp, axis_dot_cp / cp2), axis));
    return {
        t: t,
        n: nor,
    };
}
exports.intersectCone = intersectCone;
//# sourceMappingURL=index.js.map