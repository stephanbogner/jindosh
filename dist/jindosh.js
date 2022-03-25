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

	exports.magnetic_force_between_points = magnetic_force_between_points;
	exports.magnetic_force_between_two_points = magnetic_force_between_two_points;
	exports.merge_class_names = merge_class_names;
	exports.rgb_to_hex = rgb_to_hex;
	exports.unique_pairs_from_array_as_indexes = get_unique_pairs_from_array_as_indexes;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
