(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jindosh = {}));
})(this, (function (exports) { 'use strict';

	// Shown: RGB to hex
	// Alternative: convert_from_RGB_to_hex

	function rgb_to_hex(RGB_object) {
	    // From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		const r = RGB_object.r;
		const g = RGB_object.g;
		const b = RGB_object.b;
	    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	function get_hexagon_shaped_point_grid(number_of_rings_around_center = 5, width = 200, options = {}){
			const minimal_output = options.minimal_output ?? false;

			// The grid from game Townscaper by Oskar Stålberg before any alterations https://twitter.com/OskSta/status/1147881669350891521
			let nodes_array = [];

			const scale_y_for_isometric = 0.57735;
			// 57,7% is what it takes to make a line that is 45° normally to be 30° which is what the isometric view is made up of
			// Math style proof:
			// - normal view: tan(45°) = (opposite side) / (adjacent side) = deltaYnormal / deltaX
			// - isometric view: tan(30°) = deltaYiso / deltaX

			// For both adjacent side which I called deltaX is the same because we only scale in y direction which gets us:
			// - normal view:  deltaX = deltaYnormal / tan(45°)
			// - isometric view:  deltaX = deltaYiso / tan(30°)
			// -> deltaYnormal / tan(45°) = deltaYiso / tan(30°)

			// With:
			// tan(45°) = 1
			// tan(30°) = 0.57735

			// deltaYnormal = deltaYiso / 0.57735
			// -> deltaYnormal * 0.57735 = deltaYiso

			const number_of_points_on_edge = number_of_rings_around_center + 1;
			for(let cube_x = 0; cube_x < number_of_points_on_edge; cube_x++){
				for(let cube_y = 0; cube_y < number_of_points_on_edge; cube_y++){
					for(let cube_z = 0; cube_z < number_of_points_on_edge; cube_z++){
						// Idea from https://www.redblobgames.com/grids/hexagons/#conversions-offset

						if(cube_x === 0 || cube_y === 0 || cube_z === 0){
							// If any of the coordinates is 0, that means it's a point on one of 3 sides, all other we don't need

							const projected_x_relative = cube_y - cube_x;
							const projected_y_relative = cube_x + cube_y - cube_z * 2;
							const is_outer_point = (cube_x === number_of_points_on_edge - 1) || (cube_y === number_of_points_on_edge - 1) || (cube_z === number_of_points_on_edge - 1);

							// x values: between -number_of_rings_around_center and number_of_rings_around_center
							// y values: between -number_of_rings_around_center*2 and number_of_rings_around_center*2
							const actual_x = (projected_x_relative / number_of_rings_around_center) * width * 0.5;
							const actual_y = (projected_y_relative / number_of_rings_around_center) * width * 0.5 * scale_y_for_isometric;

							const id = projected_x_relative + '/' + projected_y_relative;

							let node;
							if(minimal_output){
								node = {
									x: actual_x,
									y: actual_y,
								};
							}else {
								node = {
									x: actual_x,
									y: actual_y,
									relative_x: projected_x_relative,
									relative_y: projected_y_relative,
									id: id,
									is_outer_point: is_outer_point
								};
							}
							nodes_array.push(node);
						}
					}
				}	
			}

			return nodes_array
		}

	// Alternative: merge_class_names
	function merge_class_names(...classes) {
	  // From https://tailwindui.com/
	  return classes.filter(Boolean).join(' ')
	}

	function magnetic_force_between_two_points(point_1, point_2, options = {}) {
	    const force_key = options.force_key ?? 'f';
	    const weight_key = options.weight_key ?? 'w';
	    const default_force = options.default_force ?? 1;
	    const default_weight = options.default_weight ?? 1;
	    const force_scale = options.force_scale ?? 1;
	    const maximum_distance_of_force = options.maximum_distance_of_force ?? false;
	    
	    const distance_x = point_1.x - point_2.x;
	    const distance_y = point_1.y - point_2.y;

	    const actual_distance = Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)); // Distance between Point 1 and Point 2 (pythagoras)

	    if (maximum_distance_of_force && actual_distance >= maximum_distance_of_force) {
	        // No need to apply force because points are too far apart
	    	return {
	            point_1: point_1,
	            point_2: point_2
	        }
	    }else {
	        const weight_point_1 = point_1[weight_key] ?? default_weight;
	        const weight_point_2 = point_2[weight_key] ?? default_weight;
	        const total_weight = weight_point_1 + weight_point_2;

	        const minimum_distance = 0.00001; // If distance becomes 0 you will have a divide by zero error when calculating repulsion
	        const distance_to_calculate_with = Math.max(actual_distance, minimum_distance);
	        
	        const angle_in_radians_between_points = Math.atan2(distance_x, distance_y);
	        
	        const force_multiplier_point_1 = point_1[force_key] ?? default_force;
	        const force_multiplier_point_2 = point_2[force_key] ?? default_force;
	        const force_multiplier = (force_multiplier_point_1 + force_multiplier_point_2) / 2;

	        const arbitrary_force_scale_value = 50000;
	        const repulsion = 1 / Math.pow(distance_to_calculate_with, 2) * force_multiplier * arbitrary_force_scale_value * force_scale;
	        
	        // Heavier points are pushed less, that's why numbers are reversed
	        const repulsion_point_1 = (weight_point_2 / total_weight) * repulsion;
	        const repulsion_point_2 = (weight_point_1 / total_weight) * repulsion;

	        const shift_point_1 = {
	            dx: Math.sin(angle_in_radians_between_points) * repulsion_point_1,
	            dy: Math.cos(angle_in_radians_between_points) * repulsion_point_1
	        };

	        const shift_point_2 = {
	            dx: - Math.sin(angle_in_radians_between_points) * repulsion_point_2,
	            dy: - Math.cos(angle_in_radians_between_points) * repulsion_point_2
	        };

	        // let new_point_1 = JSON.parse(JSON.stringify(point_1))
	        // new_point_1.x += shift_point_1.x
	        // new_point_1.y += shift_point_1.y

	        // let new_point_2 = JSON.parse(JSON.stringify(point_2))
	        // new_point_2.x += shift_point_2.x
	        // new_point_2.y += shift_point_2.y

	        // return [new_point_1, new_point_2]
	        return [shift_point_1, shift_point_2]
	    }
	}

	function get_unique_pairs_from_array_as_indexes(array) {
	    // Why or how does this work?
	    // Example with array of with length 4
	    //
	    // Run 1:
	    // - index_1 = 0,   index_2 = 0 + 0 = 1
	    // - index_1 = 0,   index_2 = 0 + 1 = 2
	    // - index_1 = 0,   index_2 = 0 + 2 = 3
	    //
	    // Run 2:
	    // - index_1 = 1,   index_2 = 1 + 1 = 2
	    // - index_1 = 1,   index_2 = 1 + 2 = 3
	    //
	    // Run 3:
	    // - index_1 = 2,   index_2 = 2 + 1 = 3
	    //
	    // Covered:
	    // 0 <-> 1
	    // 0 <-> 2
	    // 0 <-> 3
	    // 1 <-> 2
	    // 1 <-> 3
	    // 2 <-> 3

	    const array_length = array.length;
	    let pairs_of_indexes = [];
	    
	    for (let index_1 = 0; index_1 < array_length; index_1++) {
	        for (let index_2 = index_1 + 1; index_2 < array_length; index_2++) {
	            const pair_with_indexes = [index_1, index_2];
	            pairs_of_indexes.push(pair_with_indexes);
	        }
	    }

	    return pairs_of_indexes;
	}

	function magnetic_force_between_points(points_array, options = {}) {
	    let points_array_clone = JSON.parse(JSON.stringify(points_array));

	    const point_pairs = get_unique_pairs_from_array_as_indexes(points_array_clone);

	    let accumulated_forces = [];

	    point_pairs.map((pair) => {
	        const point_1_index = pair[0];
	        const point_2_index = pair[1];
	        const point_1 = points_array_clone[ point_1_index ];
	        const point_2 = points_array_clone[ point_2_index ];

	        const points_with_new_positions = magnetic_force_between_two_points(point_1, point_2);

	        if(!accumulated_forces[point_1_index]){
	            accumulated_forces[point_1_index] = {x:0, y:0};
	        }
	        accumulated_forces[point_1_index].x += points_with_new_positions[0].dx;
	        accumulated_forces[point_1_index].y += points_with_new_positions[0].dy;

	        if(!accumulated_forces[point_2_index]){
	            accumulated_forces[point_2_index] = {x:0, y:0};
	        }
	        accumulated_forces[point_2_index].x += points_with_new_positions[1].dx;
	        accumulated_forces[point_2_index].y += points_with_new_positions[1].dy;
	    });

	    points_array_clone.map((point, index) => {
	        if(accumulated_forces[index]){
	            point.x += accumulated_forces[index].x / point_pairs.length;
	            point.y += accumulated_forces[index].y / point_pairs.length;
	        }
	    });
	    return points_array_clone
	}

	const epsilon = 1.1102230246251565e-16;
	const splitter = 134217729;
	const resulterrbound = (3 + 8 * epsilon) * epsilon;

	// fast_expansion_sum_zeroelim routine from oritinal code
	function sum(elen, e, flen, f, h) {
	    let Q, Qnew, hh, bvirt;
	    let enow = e[0];
	    let fnow = f[0];
	    let eindex = 0;
	    let findex = 0;
	    if ((fnow > enow) === (fnow > -enow)) {
	        Q = enow;
	        enow = e[++eindex];
	    } else {
	        Q = fnow;
	        fnow = f[++findex];
	    }
	    let hindex = 0;
	    if (eindex < elen && findex < flen) {
	        if ((fnow > enow) === (fnow > -enow)) {
	            Qnew = enow + Q;
	            hh = Q - (Qnew - enow);
	            enow = e[++eindex];
	        } else {
	            Qnew = fnow + Q;
	            hh = Q - (Qnew - fnow);
	            fnow = f[++findex];
	        }
	        Q = Qnew;
	        if (hh !== 0) {
	            h[hindex++] = hh;
	        }
	        while (eindex < elen && findex < flen) {
	            if ((fnow > enow) === (fnow > -enow)) {
	                Qnew = Q + enow;
	                bvirt = Qnew - Q;
	                hh = Q - (Qnew - bvirt) + (enow - bvirt);
	                enow = e[++eindex];
	            } else {
	                Qnew = Q + fnow;
	                bvirt = Qnew - Q;
	                hh = Q - (Qnew - bvirt) + (fnow - bvirt);
	                fnow = f[++findex];
	            }
	            Q = Qnew;
	            if (hh !== 0) {
	                h[hindex++] = hh;
	            }
	        }
	    }
	    while (eindex < elen) {
	        Qnew = Q + enow;
	        bvirt = Qnew - Q;
	        hh = Q - (Qnew - bvirt) + (enow - bvirt);
	        enow = e[++eindex];
	        Q = Qnew;
	        if (hh !== 0) {
	            h[hindex++] = hh;
	        }
	    }
	    while (findex < flen) {
	        Qnew = Q + fnow;
	        bvirt = Qnew - Q;
	        hh = Q - (Qnew - bvirt) + (fnow - bvirt);
	        fnow = f[++findex];
	        Q = Qnew;
	        if (hh !== 0) {
	            h[hindex++] = hh;
	        }
	    }
	    if (Q !== 0 || hindex === 0) {
	        h[hindex++] = Q;
	    }
	    return hindex;
	}

	function estimate(elen, e) {
	    let Q = e[0];
	    for (let i = 1; i < elen; i++) Q += e[i];
	    return Q;
	}

	function vec(n) {
	    return new Float64Array(n);
	}

	const ccwerrboundA = (3 + 16 * epsilon) * epsilon;
	const ccwerrboundB = (2 + 12 * epsilon) * epsilon;
	const ccwerrboundC = (9 + 64 * epsilon) * epsilon * epsilon;

	const B = vec(4);
	const C1 = vec(8);
	const C2 = vec(12);
	const D = vec(16);
	const u = vec(4);

	function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
	    let acxtail, acytail, bcxtail, bcytail;
	    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

	    const acx = ax - cx;
	    const bcx = bx - cx;
	    const acy = ay - cy;
	    const bcy = by - cy;

	    s1 = acx * bcy;
	    c = splitter * acx;
	    ahi = c - (c - acx);
	    alo = acx - ahi;
	    c = splitter * bcy;
	    bhi = c - (c - bcy);
	    blo = bcy - bhi;
	    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
	    t1 = acy * bcx;
	    c = splitter * acy;
	    ahi = c - (c - acy);
	    alo = acy - ahi;
	    c = splitter * bcx;
	    bhi = c - (c - bcx);
	    blo = bcx - bhi;
	    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
	    _i = s0 - t0;
	    bvirt = s0 - _i;
	    B[0] = s0 - (_i + bvirt) + (bvirt - t0);
	    _j = s1 + _i;
	    bvirt = _j - s1;
	    _0 = s1 - (_j - bvirt) + (_i - bvirt);
	    _i = _0 - t1;
	    bvirt = _0 - _i;
	    B[1] = _0 - (_i + bvirt) + (bvirt - t1);
	    u3 = _j + _i;
	    bvirt = u3 - _j;
	    B[2] = _j - (u3 - bvirt) + (_i - bvirt);
	    B[3] = u3;

	    let det = estimate(4, B);
	    let errbound = ccwerrboundB * detsum;
	    if (det >= errbound || -det >= errbound) {
	        return det;
	    }

	    bvirt = ax - acx;
	    acxtail = ax - (acx + bvirt) + (bvirt - cx);
	    bvirt = bx - bcx;
	    bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
	    bvirt = ay - acy;
	    acytail = ay - (acy + bvirt) + (bvirt - cy);
	    bvirt = by - bcy;
	    bcytail = by - (bcy + bvirt) + (bvirt - cy);

	    if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
	        return det;
	    }

	    errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
	    det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
	    if (det >= errbound || -det >= errbound) return det;

	    s1 = acxtail * bcy;
	    c = splitter * acxtail;
	    ahi = c - (c - acxtail);
	    alo = acxtail - ahi;
	    c = splitter * bcy;
	    bhi = c - (c - bcy);
	    blo = bcy - bhi;
	    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
	    t1 = acytail * bcx;
	    c = splitter * acytail;
	    ahi = c - (c - acytail);
	    alo = acytail - ahi;
	    c = splitter * bcx;
	    bhi = c - (c - bcx);
	    blo = bcx - bhi;
	    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
	    _i = s0 - t0;
	    bvirt = s0 - _i;
	    u[0] = s0 - (_i + bvirt) + (bvirt - t0);
	    _j = s1 + _i;
	    bvirt = _j - s1;
	    _0 = s1 - (_j - bvirt) + (_i - bvirt);
	    _i = _0 - t1;
	    bvirt = _0 - _i;
	    u[1] = _0 - (_i + bvirt) + (bvirt - t1);
	    u3 = _j + _i;
	    bvirt = u3 - _j;
	    u[2] = _j - (u3 - bvirt) + (_i - bvirt);
	    u[3] = u3;
	    const C1len = sum(4, B, 4, u, C1);

	    s1 = acx * bcytail;
	    c = splitter * acx;
	    ahi = c - (c - acx);
	    alo = acx - ahi;
	    c = splitter * bcytail;
	    bhi = c - (c - bcytail);
	    blo = bcytail - bhi;
	    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
	    t1 = acy * bcxtail;
	    c = splitter * acy;
	    ahi = c - (c - acy);
	    alo = acy - ahi;
	    c = splitter * bcxtail;
	    bhi = c - (c - bcxtail);
	    blo = bcxtail - bhi;
	    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
	    _i = s0 - t0;
	    bvirt = s0 - _i;
	    u[0] = s0 - (_i + bvirt) + (bvirt - t0);
	    _j = s1 + _i;
	    bvirt = _j - s1;
	    _0 = s1 - (_j - bvirt) + (_i - bvirt);
	    _i = _0 - t1;
	    bvirt = _0 - _i;
	    u[1] = _0 - (_i + bvirt) + (bvirt - t1);
	    u3 = _j + _i;
	    bvirt = u3 - _j;
	    u[2] = _j - (u3 - bvirt) + (_i - bvirt);
	    u[3] = u3;
	    const C2len = sum(C1len, C1, 4, u, C2);

	    s1 = acxtail * bcytail;
	    c = splitter * acxtail;
	    ahi = c - (c - acxtail);
	    alo = acxtail - ahi;
	    c = splitter * bcytail;
	    bhi = c - (c - bcytail);
	    blo = bcytail - bhi;
	    s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
	    t1 = acytail * bcxtail;
	    c = splitter * acytail;
	    ahi = c - (c - acytail);
	    alo = acytail - ahi;
	    c = splitter * bcxtail;
	    bhi = c - (c - bcxtail);
	    blo = bcxtail - bhi;
	    t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
	    _i = s0 - t0;
	    bvirt = s0 - _i;
	    u[0] = s0 - (_i + bvirt) + (bvirt - t0);
	    _j = s1 + _i;
	    bvirt = _j - s1;
	    _0 = s1 - (_j - bvirt) + (_i - bvirt);
	    _i = _0 - t1;
	    bvirt = _0 - _i;
	    u[1] = _0 - (_i + bvirt) + (bvirt - t1);
	    u3 = _j + _i;
	    bvirt = u3 - _j;
	    u[2] = _j - (u3 - bvirt) + (_i - bvirt);
	    u[3] = u3;
	    const Dlen = sum(C2len, C2, 4, u, D);

	    return D[Dlen - 1];
	}

	function orient2d(ax, ay, bx, by, cx, cy) {
	    const detleft = (ay - cy) * (bx - cx);
	    const detright = (ax - cx) * (by - cy);
	    const det = detleft - detright;

	    if (detleft === 0 || detright === 0 || (detleft > 0) !== (detright > 0)) return det;

	    const detsum = Math.abs(detleft + detright);
	    if (Math.abs(det) >= ccwerrboundA * detsum) return det;

	    return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
	}

	const EPSILON = Math.pow(2, -52);
	const EDGE_STACK = new Uint32Array(512);

	class Delaunator {

	    static from(points, getX = defaultGetX, getY = defaultGetY) {
	        const n = points.length;
	        const coords = new Float64Array(n * 2);

	        for (let i = 0; i < n; i++) {
	            const p = points[i];
	            coords[2 * i] = getX(p);
	            coords[2 * i + 1] = getY(p);
	        }

	        return new Delaunator(coords);
	    }

	    constructor(coords) {
	        const n = coords.length >> 1;
	        if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');

	        this.coords = coords;

	        // arrays that will store the triangulation graph
	        const maxTriangles = Math.max(2 * n - 5, 0);
	        this._triangles = new Uint32Array(maxTriangles * 3);
	        this._halfedges = new Int32Array(maxTriangles * 3);

	        // temporary arrays for tracking the edges of the advancing convex hull
	        this._hashSize = Math.ceil(Math.sqrt(n));
	        this._hullPrev = new Uint32Array(n); // edge to prev edge
	        this._hullNext = new Uint32Array(n); // edge to next edge
	        this._hullTri = new Uint32Array(n); // edge to adjacent triangle
	        this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash

	        // temporary arrays for sorting points
	        this._ids = new Uint32Array(n);
	        this._dists = new Float64Array(n);

	        this.update();
	    }

	    update() {
	        const {coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash} =  this;
	        const n = coords.length >> 1;

	        // populate an array of point indices; calculate input data bbox
	        let minX = Infinity;
	        let minY = Infinity;
	        let maxX = -Infinity;
	        let maxY = -Infinity;

	        for (let i = 0; i < n; i++) {
	            const x = coords[2 * i];
	            const y = coords[2 * i + 1];
	            if (x < minX) minX = x;
	            if (y < minY) minY = y;
	            if (x > maxX) maxX = x;
	            if (y > maxY) maxY = y;
	            this._ids[i] = i;
	        }
	        const cx = (minX + maxX) / 2;
	        const cy = (minY + maxY) / 2;

	        let minDist = Infinity;
	        let i0, i1, i2;

	        // pick a seed point close to the center
	        for (let i = 0; i < n; i++) {
	            const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
	            if (d < minDist) {
	                i0 = i;
	                minDist = d;
	            }
	        }
	        const i0x = coords[2 * i0];
	        const i0y = coords[2 * i0 + 1];

	        minDist = Infinity;

	        // find the point closest to the seed
	        for (let i = 0; i < n; i++) {
	            if (i === i0) continue;
	            const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
	            if (d < minDist && d > 0) {
	                i1 = i;
	                minDist = d;
	            }
	        }
	        let i1x = coords[2 * i1];
	        let i1y = coords[2 * i1 + 1];

	        let minRadius = Infinity;

	        // find the third point which forms the smallest circumcircle with the first two
	        for (let i = 0; i < n; i++) {
	            if (i === i0 || i === i1) continue;
	            const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
	            if (r < minRadius) {
	                i2 = i;
	                minRadius = r;
	            }
	        }
	        let i2x = coords[2 * i2];
	        let i2y = coords[2 * i2 + 1];

	        if (minRadius === Infinity) {
	            // order collinear points by dx (or dy if all x are identical)
	            // and return the list as a hull
	            for (let i = 0; i < n; i++) {
	                this._dists[i] = (coords[2 * i] - coords[0]) || (coords[2 * i + 1] - coords[1]);
	            }
	            quicksort(this._ids, this._dists, 0, n - 1);
	            const hull = new Uint32Array(n);
	            let j = 0;
	            for (let i = 0, d0 = -Infinity; i < n; i++) {
	                const id = this._ids[i];
	                if (this._dists[id] > d0) {
	                    hull[j++] = id;
	                    d0 = this._dists[id];
	                }
	            }
	            this.hull = hull.subarray(0, j);
	            this.triangles = new Uint32Array(0);
	            this.halfedges = new Uint32Array(0);
	            return;
	        }

	        // swap the order of the seed points for counter-clockwise orientation
	        if (orient2d(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
	            const i = i1;
	            const x = i1x;
	            const y = i1y;
	            i1 = i2;
	            i1x = i2x;
	            i1y = i2y;
	            i2 = i;
	            i2x = x;
	            i2y = y;
	        }

	        const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
	        this._cx = center.x;
	        this._cy = center.y;

	        for (let i = 0; i < n; i++) {
	            this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
	        }

	        // sort the points by distance from the seed triangle circumcenter
	        quicksort(this._ids, this._dists, 0, n - 1);

	        // set up the seed triangle as the starting hull
	        this._hullStart = i0;
	        let hullSize = 3;

	        hullNext[i0] = hullPrev[i2] = i1;
	        hullNext[i1] = hullPrev[i0] = i2;
	        hullNext[i2] = hullPrev[i1] = i0;

	        hullTri[i0] = 0;
	        hullTri[i1] = 1;
	        hullTri[i2] = 2;

	        hullHash.fill(-1);
	        hullHash[this._hashKey(i0x, i0y)] = i0;
	        hullHash[this._hashKey(i1x, i1y)] = i1;
	        hullHash[this._hashKey(i2x, i2y)] = i2;

	        this.trianglesLen = 0;
	        this._addTriangle(i0, i1, i2, -1, -1, -1);

	        for (let k = 0, xp, yp; k < this._ids.length; k++) {
	            const i = this._ids[k];
	            const x = coords[2 * i];
	            const y = coords[2 * i + 1];

	            // skip near-duplicate points
	            if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
	            xp = x;
	            yp = y;

	            // skip seed triangle points
	            if (i === i0 || i === i1 || i === i2) continue;

	            // find a visible edge on the convex hull using edge hash
	            let start = 0;
	            for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
	                start = hullHash[(key + j) % this._hashSize];
	                if (start !== -1 && start !== hullNext[start]) break;
	            }

	            start = hullPrev[start];
	            let e = start, q;
	            while (q = hullNext[e], orient2d(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1]) >= 0) {
	                e = q;
	                if (e === start) {
	                    e = -1;
	                    break;
	                }
	            }
	            if (e === -1) continue; // likely a near-duplicate point; skip it

	            // add the first triangle from the point
	            let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);

	            // recursively flip triangles from the point until they satisfy the Delaunay condition
	            hullTri[i] = this._legalize(t + 2);
	            hullTri[e] = t; // keep track of boundary triangles on the hull
	            hullSize++;

	            // walk forward through the hull, adding more triangles and flipping recursively
	            let n = hullNext[e];
	            while (q = hullNext[n], orient2d(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1]) < 0) {
	                t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
	                hullTri[i] = this._legalize(t + 2);
	                hullNext[n] = n; // mark as removed
	                hullSize--;
	                n = q;
	            }

	            // walk backward from the other side, adding more triangles and flipping
	            if (e === start) {
	                while (q = hullPrev[e], orient2d(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1]) < 0) {
	                    t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
	                    this._legalize(t + 2);
	                    hullTri[q] = t;
	                    hullNext[e] = e; // mark as removed
	                    hullSize--;
	                    e = q;
	                }
	            }

	            // update the hull indices
	            this._hullStart = hullPrev[i] = e;
	            hullNext[e] = hullPrev[n] = i;
	            hullNext[i] = n;

	            // save the two new edges in the hash table
	            hullHash[this._hashKey(x, y)] = i;
	            hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
	        }

	        this.hull = new Uint32Array(hullSize);
	        for (let i = 0, e = this._hullStart; i < hullSize; i++) {
	            this.hull[i] = e;
	            e = hullNext[e];
	        }

	        // trim typed triangle mesh arrays
	        this.triangles = this._triangles.subarray(0, this.trianglesLen);
	        this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
	    }

	    _hashKey(x, y) {
	        return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
	    }

	    _legalize(a) {
	        const {_triangles: triangles, _halfedges: halfedges, coords} = this;

	        let i = 0;
	        let ar = 0;

	        // recursion eliminated with a fixed-size stack
	        while (true) {
	            const b = halfedges[a];

	            /* if the pair of triangles doesn't satisfy the Delaunay condition
	             * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
	             * then do the same check/flip recursively for the new pair of triangles
	             *
	             *           pl                    pl
	             *          /||\                  /  \
	             *       al/ || \bl            al/    \a
	             *        /  ||  \              /      \
	             *       /  a||b  \    flip    /___ar___\
	             *     p0\   ||   /p1   =>   p0\---bl---/p1
	             *        \  ||  /              \      /
	             *       ar\ || /br             b\    /br
	             *          \||/                  \  /
	             *           pr                    pr
	             */
	            const a0 = a - a % 3;
	            ar = a0 + (a + 2) % 3;

	            if (b === -1) { // convex hull edge
	                if (i === 0) break;
	                a = EDGE_STACK[--i];
	                continue;
	            }

	            const b0 = b - b % 3;
	            const al = a0 + (a + 1) % 3;
	            const bl = b0 + (b + 2) % 3;

	            const p0 = triangles[ar];
	            const pr = triangles[a];
	            const pl = triangles[al];
	            const p1 = triangles[bl];

	            const illegal = inCircle(
	                coords[2 * p0], coords[2 * p0 + 1],
	                coords[2 * pr], coords[2 * pr + 1],
	                coords[2 * pl], coords[2 * pl + 1],
	                coords[2 * p1], coords[2 * p1 + 1]);

	            if (illegal) {
	                triangles[a] = p1;
	                triangles[b] = p0;

	                const hbl = halfedges[bl];

	                // edge swapped on the other side of the hull (rare); fix the halfedge reference
	                if (hbl === -1) {
	                    let e = this._hullStart;
	                    do {
	                        if (this._hullTri[e] === bl) {
	                            this._hullTri[e] = a;
	                            break;
	                        }
	                        e = this._hullPrev[e];
	                    } while (e !== this._hullStart);
	                }
	                this._link(a, hbl);
	                this._link(b, halfedges[ar]);
	                this._link(ar, bl);

	                const br = b0 + (b + 1) % 3;

	                // don't worry about hitting the cap: it can only happen on extremely degenerate input
	                if (i < EDGE_STACK.length) {
	                    EDGE_STACK[i++] = br;
	                }
	            } else {
	                if (i === 0) break;
	                a = EDGE_STACK[--i];
	            }
	        }

	        return ar;
	    }

	    _link(a, b) {
	        this._halfedges[a] = b;
	        if (b !== -1) this._halfedges[b] = a;
	    }

	    // add a new triangle given vertex indices and adjacent half-edge ids
	    _addTriangle(i0, i1, i2, a, b, c) {
	        const t = this.trianglesLen;

	        this._triangles[t] = i0;
	        this._triangles[t + 1] = i1;
	        this._triangles[t + 2] = i2;

	        this._link(t, a);
	        this._link(t + 1, b);
	        this._link(t + 2, c);

	        this.trianglesLen += 3;

	        return t;
	    }
	}

	// monotonically increases with real angle, but doesn't need expensive trigonometry
	function pseudoAngle(dx, dy) {
	    const p = dx / (Math.abs(dx) + Math.abs(dy));
	    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
	}

	function dist(ax, ay, bx, by) {
	    const dx = ax - bx;
	    const dy = ay - by;
	    return dx * dx + dy * dy;
	}

	function inCircle(ax, ay, bx, by, cx, cy, px, py) {
	    const dx = ax - px;
	    const dy = ay - py;
	    const ex = bx - px;
	    const ey = by - py;
	    const fx = cx - px;
	    const fy = cy - py;

	    const ap = dx * dx + dy * dy;
	    const bp = ex * ex + ey * ey;
	    const cp = fx * fx + fy * fy;

	    return dx * (ey * cp - bp * fy) -
	           dy * (ex * cp - bp * fx) +
	           ap * (ex * fy - ey * fx) < 0;
	}

	function circumradius(ax, ay, bx, by, cx, cy) {
	    const dx = bx - ax;
	    const dy = by - ay;
	    const ex = cx - ax;
	    const ey = cy - ay;

	    const bl = dx * dx + dy * dy;
	    const cl = ex * ex + ey * ey;
	    const d = 0.5 / (dx * ey - dy * ex);

	    const x = (ey * bl - dy * cl) * d;
	    const y = (dx * cl - ex * bl) * d;

	    return x * x + y * y;
	}

	function circumcenter(ax, ay, bx, by, cx, cy) {
	    const dx = bx - ax;
	    const dy = by - ay;
	    const ex = cx - ax;
	    const ey = cy - ay;

	    const bl = dx * dx + dy * dy;
	    const cl = ex * ex + ey * ey;
	    const d = 0.5 / (dx * ey - dy * ex);

	    const x = ax + (ey * bl - dy * cl) * d;
	    const y = ay + (dx * cl - ex * bl) * d;

	    return {x, y};
	}

	function quicksort(ids, dists, left, right) {
	    if (right - left <= 20) {
	        for (let i = left + 1; i <= right; i++) {
	            const temp = ids[i];
	            const tempDist = dists[temp];
	            let j = i - 1;
	            while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];
	            ids[j + 1] = temp;
	        }
	    } else {
	        const median = (left + right) >> 1;
	        let i = left + 1;
	        let j = right;
	        swap(ids, median, i);
	        if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
	        if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
	        if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);

	        const temp = ids[i];
	        const tempDist = dists[temp];
	        while (true) {
	            do i++; while (dists[ids[i]] < tempDist);
	            do j--; while (dists[ids[j]] > tempDist);
	            if (j < i) break;
	            swap(ids, i, j);
	        }
	        ids[left + 1] = ids[j];
	        ids[j] = temp;

	        if (right - i + 1 >= j - left) {
	            quicksort(ids, dists, i, right);
	            quicksort(ids, dists, left, j - 1);
	        } else {
	            quicksort(ids, dists, left, j - 1);
	            quicksort(ids, dists, i, right);
	        }
	    }
	}

	function swap(arr, i, j) {
	    const tmp = arr[i];
	    arr[i] = arr[j];
	    arr[j] = tmp;
	}

	function defaultGetX(p) {
	    return p[0];
	}
	function defaultGetY(p) {
	    return p[1];
	}

	function delaunay_triangulation(points_array){
		const coords = points_objects_to_coords_list(points_array);

		const delaunay = new Delaunator(coords);
		const trianglesList = delaunay.triangles;

		let triangles = [];
		for (let i = 0; i < trianglesList.length; i += 3) {
		    triangles.push([
		        trianglesList[i],
		        trianglesList[i + 1],
		        trianglesList[i + 2]
		    ]);
		}

	    return triangles

	    function points_objects_to_coords_list(points_array){
			let coords = [];
			points_array.map((point) => {
				coords.push(point.x);
				coords.push(point.y);
			});
			return coords
		}
	}

		// function point_from_object_coordinates_to_array(point_object){
		// 	return [point_object.x, point_object.y]
		// }

		// function points_from_object_coordinates_to_array(points_array){
		// 	return points_array.map((point) => {
		// 		return point_from_object_coordinates_to_array(point)
		// 	})
		// }

	exports.delaunay_triangulation = delaunay_triangulation;
	exports.get_hexagon_shaped_point_grid = get_hexagon_shaped_point_grid;
	exports.magnetic_force_between_points = magnetic_force_between_points;
	exports.magnetic_force_between_two_points = magnetic_force_between_two_points;
	exports.merge_class_names = merge_class_names;
	exports.rgb_to_hex = rgb_to_hex;
	exports.unique_pairs_from_array_as_indexes = get_unique_pairs_from_array_as_indexes;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
