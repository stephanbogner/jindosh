export default function get_unique_pairs_from_array_as_indexes(array) {
    // Why or how does this work?
    // Example with array of with length 4
    //
    // Run 1:
    // - index_1 = 0,   index_2 = 0 + 0 = 1
    // - index_1 = 0,   index_2 = 0 + 1 = 2
    // - index_1 = 0,   index_2 = 0 + 2 = 3
    //
    // Run 2:
    // - index_1 = 1,   index_2 = 1 + 1 = 2
    // - index_1 = 1,   index_2 = 1 + 2 = 3
    //
    // Run 3:
    // - index_1 = 2,   index_2 = 2 + 1 = 3
    //
    // Covered:
    // 0 <-> 1
    // 0 <-> 2
    // 0 <-> 3
    // 1 <-> 2
    // 1 <-> 3
    // 2 <-> 3

    const array_length = array.length;
    let pairs_of_indexes = [];
    
    for (let index_1 = 0; index_1 < array_length; index_1++) {
        for (let index_2 = index_1 + 1; index_2 < array_length; index_2++) {
            const pair_with_indexes = [index_1, index_2]
            pairs_of_indexes.push(pair_with_indexes);
        }
    }

    return pairs_of_indexes;
}