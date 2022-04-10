export default function get_hexagon_shaped_point_grid(number_of_rings_around_center = 5, width = 200, options = {}){
		const minimal_output = options.minimal_output ?? false;

		// The grid from game Townscaper by Oskar Stålberg before any alterations
		// https://twitter.com/OskSta/status/1147881669350891521
		let nodes_array = [];

		const scale_y_for_isometric = 0.57735
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
						const is_outer_point = (cube_x === number_of_points_on_edge - 1) || (cube_y === number_of_points_on_edge - 1) || (cube_z === number_of_points_on_edge - 1)

						// x values: between -number_of_rings_around_center and number_of_rings_around_center
						// y values: between -number_of_rings_around_center*2 and number_of_rings_around_center*2
						const actual_x = (projected_x_relative / number_of_rings_around_center) * width * 0.5;
						const actual_y = (projected_y_relative / number_of_rings_around_center) * width * 0.5 * scale_y_for_isometric;

						const id = projected_x_relative + '/' + projected_y_relative;

						let node
						if(minimal_output){
							node = {
								x: actual_x,
								y: actual_y,
							}
						}else{
							node = {
								x: actual_x,
								y: actual_y,
								relative_x: projected_x_relative,
								relative_y: projected_y_relative,
								id: id,
								is_outer_point: is_outer_point
							}
						}
						nodes_array.push(node)
					}
				}
			}	
		}

		return nodes_array
	}