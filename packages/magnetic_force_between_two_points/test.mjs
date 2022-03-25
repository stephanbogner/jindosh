import magnetic_force_between_two_points from "./index.mjs";

const point_1 = {
	customData: 'of point_1',
	x: 0,
	y: 0
}

const point_2 = {
	customData: 'of point_2',
	x: 100,
	y: 0
}

const result = magnetic_force_between_two_points(point_1, point_2, {force_scale: 0.5});
console.log(result)