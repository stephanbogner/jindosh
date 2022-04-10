import delaunay_triangulation from './index.mjs'

let points = [
	{x: 10, y: 100},
	{x: 20, y: 90},
	{x: 15, y: 110},
	{x: 5, y: 125},
]

const triangles_point_indexes = delaunay_triangulation(points)
console.log('Triangles with point indexes')
console.log(triangles_point_indexes)

triangles_point_indexes.map((triangle, index) => {
	console.log('')
	console.log('Triangle #' + (index+1))
	console.log('p1', points[triangle[0]])
	console.log('p2', points[triangle[1]])
	console.log('p3', points[triangle[2]])
})