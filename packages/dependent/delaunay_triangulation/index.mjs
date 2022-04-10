import Delaunator from 'delaunator';

export default function delaunay_triangulation(points_array){
	const coords = points_objects_to_coords_list(points_array)

	const delaunay = new Delaunator(coords)
	const trianglesList = delaunay.triangles

	let triangles = []
	for (let i = 0; i < trianglesList.length; i += 3) {
	    triangles.push([
	        trianglesList[i],
	        trianglesList[i + 1],
	        trianglesList[i + 2]
	    ]);
	}

    return triangles

    function points_objects_to_coords_list(points_array){
		let coords = []
		points_array.map((point) => {
			coords.push(point.x)
			coords.push(point.y)
		})
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