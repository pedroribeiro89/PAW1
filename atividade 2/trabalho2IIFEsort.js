var mysort = (function() {

	function swap(array, i, j) {
		var aux = array[i];
		array[i] = array[j];
		array[j] = aux;
	}

	function partition(array, init, end, compareFunction) {
		var pivotValue = array[end];
		var i = init;
		for (var j = init; j < end ; ++j){
			// if (array[j] < pivotValue) {
			if (compareFunction(array[j], pivotValue) < 0) {
				swap(array, i, j);
				++i;
			}
		}
		// if(pivotValue < array[i]) {
		if (compareFunction(pivotValue, array[i]) < 0) {
			swap(array, i, end);
		}
		return i;
	}

	function quicksort(array, init, end, compareFunction) {
		if (init < end) {
			var pivotPosition = partition(array, init, end, compareFunction);
			quicksort(array, init, pivotPosition-1, compareFunction);
			quicksort(array, pivotPosition+1, end, compareFunction);
		}
		return array;
	}

	return function(array, compare) {     
		return quicksort(array, 0, array.length-1, compare);
	}
})();

//test case:
// console.log( sort([{x:1, v:5},{x:2, v:4},{x:3, v:1},{x:4, v:2},{x:5, v:3}], (a, b) => { return a.v - b.v; }) );