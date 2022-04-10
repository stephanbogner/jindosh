import array_to_object_lookup_table from 'array_to_object_lookup_table'

// Handy if you have a nested structure stored in a table based database, e.g. SQL or postgres

export default function nest_elements_in_array(elements_as_array, key_for_id = 'id', key_for_parent_element = 'parent', key_for_children = 'children', options = {}){
	let elements = JSON.parse(JSON.stringify(elements_as_array));

	const id_index_lookup_table = array_to_object_lookup_table(elements, key_for_id)

    // Important: Only works with 1 level of nesting

    elements.map((element, index) => {
        const parent_element_id_if_existant = element[key_for_parent_element]

    	if(parent_element_id_if_existant){
            const parent_element_index = id_index_lookup_table[parent_element_id]

            // Create children array if not existant
            if(!elements[parent_element_index][key_for_children]){
                elements[parent_element_index][key_for_children] = [];
            }

            elements[parent_element_index][key_for_children].push(element);
            elements[index] = null; // Empty this element, as it has been moved as child to another element
        }
    })

    elements = elements.filter(n => n) // Remove empty parts of array
    return elements;
}