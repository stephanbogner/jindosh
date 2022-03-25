import magnetic_force_between_points from "./index.mjs";

const point_1 = {
	x: 0,
	y: 0
}

const point_2 = {
	x: 100,
	y: 0
}

const point_3 = {
	x: 100,
	y: 100
}

let points = [point_1, point_2, point_3]

points = magnetic_force_between_points(points)
console.log('run 1', points)
points = magnetic_force_between_points(points)
console.log('run 2', points)
points = magnetic_force_between_points(points)
console.log('run 3', points)