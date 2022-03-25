import unique_pairs_from_array_as_indexes from "@jindosh/unique_pairs_from_array_as_indexes";
import magnetic_force_between_two_points from "@jindosh/magnetic_force_between_two_points";

export default function magnetic_force_between_points(points_array, options = {}) {
    let points_array_clone = JSON.parse(JSON.stringify(points_array))

    const point_pairs = unique_pairs_from_array_as_indexes(points_array_clone)

    let accumulated_forces = [];

    point_pairs.map((pair) => {
        const point_1_index = pair[0]
        const point_2_index = pair[1]
        const point_1 = points_array_clone[ point_1_index ]
        const point_2 = points_array_clone[ point_2_index ]

        const points_with_new_positions = magnetic_force_between_two_points(point_1, point_2)

        if(!accumulated_forces[point_1_index]){
            accumulated_forces[point_1_index] = {x:0, y:0}
        }
        accumulated_forces[point_1_index].x += points_with_new_positions[0].dx
        accumulated_forces[point_1_index].y += points_with_new_positions[0].dy

        if(!accumulated_forces[point_2_index]){
            accumulated_forces[point_2_index] = {x:0, y:0}
        }
        accumulated_forces[point_2_index].x += points_with_new_positions[1].dx
        accumulated_forces[point_2_index].y += points_with_new_positions[1].dy
    })

    points_array_clone.map((point, index) => {
        if(accumulated_forces[index]){
            point.x += accumulated_forces[index].x / point_pairs.length
            point.y += accumulated_forces[index].y / point_pairs.length
        }
    })
    return points_array_clone
}