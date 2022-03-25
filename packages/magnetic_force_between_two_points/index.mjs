export default function magnetic_force_between_two_points(point_1, point_2, options = {}) {
    const force_key = options.force_key ?? 'f'
    const weight_key = options.weight_key ?? 'w'
    const default_force = options.default_force ?? 1
    const default_weight = options.default_weight ?? 1
    const force_scale = options.force_scale ?? 1
    const maximum_distance_of_force = options.maximum_distance_of_force ?? false
    
    const distance_x = point_1.x - point_2.x
    const distance_y = point_1.y - point_2.y

    const actual_distance = Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2)) // Distance between Point 1 and Point 2 (pythagoras)

    if (maximum_distance_of_force && actual_distance >= maximum_distance_of_force) {
        // No need to apply force because points are too far apart
    	return {
            point_1: point_1,
            point_2: point_2
        }
    }else{
        const weight_point_1 = point_1[weight_key] ?? default_weight
        const weight_point_2 = point_2[weight_key] ?? default_weight
        const total_weight = weight_point_1 + weight_point_2;

        const minimum_distance = 0.00001 // If distance becomes 0 you will have a divide by zero error when calculating repulsion
        const distance_to_calculate_with = Math.max(actual_distance, minimum_distance)
        
        const angle_in_radians_between_points = Math.atan2(distance_x, distance_y)
        
        const force_multiplier_point_1 = point_1[force_key] ?? default_force
        const force_multiplier_point_2 = point_2[force_key] ?? default_force
        const force_multiplier = (force_multiplier_point_1 + force_multiplier_point_2) / 2;

        const arbitrary_force_scale_value = 50000;
        const repulsion = 1 / Math.pow(distance_to_calculate_with, 2) * force_multiplier * arbitrary_force_scale_value * force_scale;
        
        // Heavier points are pushed less, that's why numbers are reversed
        const repulsion_point_1 = (weight_point_2 / total_weight) * repulsion;
        const repulsion_point_2 = (weight_point_1 / total_weight) * repulsion;

        const shift_point_1 = {
            dx: Math.sin(angle_in_radians_between_points) * repulsion_point_1,
            dy: Math.cos(angle_in_radians_between_points) * repulsion_point_1
        }

        const shift_point_2 = {
            dx: - Math.sin(angle_in_radians_between_points) * repulsion_point_2,
            dy: - Math.cos(angle_in_radians_between_points) * repulsion_point_2
        }

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