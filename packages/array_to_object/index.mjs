export default function array_to_object(elements_array, key_of_id = 'id', options = {}){
	//const delete_id_key = options.delete_id_key ?? false

	let object = {}
	elements_array.map((element) => {
		object[key_of_id] = element[key_of_id]
	})

	return object
}