export default function array_to_object_lookup_table(elements_array, key_of_id = 'id', options = {}){
	//const delete_id_key = options.delete_id_key ?? false

	let object_lookup_table = {}
	elements_array.map((element, index) => {
		object_lookup_table[key_of_id] = index
	})

	return object_lookup_table
}