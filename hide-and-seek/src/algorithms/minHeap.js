// ==================================================
// define heap structure
export class MinHeap {
	constructor() {
		/* Initialing the array heap and adding a dummy element at index 0 */
		this.heap = [];
	}

	popMin() {
		var temp = this.heap[0];
		this.remove(0);
		return temp;
	}

	insert(node) {
		this.heap.push(node);
		var curr = this.heap.length - 1;
		// console.log(curr, this.heap);
		while (
			curr !== 0 &&
			this.heap[Math.floor(curr / 2)].f > this.heap[curr].f
		) {
			[this.heap[Math.floor(curr / 2)], this.heap[curr]] = [
				this.heap[curr],
				this.heap[Math.floor(curr / 2)]
			];
			curr = Math.floor(curr / 2);
		}
	}

	remove(idx) {
		// swap idx with the last node, heapify the whole tree
		[this.heap[idx], this.heap[this.heap.length - 1]] = [
			this.heap[this.heap.length - 1],
			this.heap[idx]
		];
		// remove the last node
		this.heap.splice(this.heap.length - 1, 1);
		this.heapify(idx);
	}

	heapify(idx) {
		var min_idx = idx;
		let l = idx * 2;
		let r = idx * 2 + 1;
		if (l < this.heap.length && this.heap[l].f < this.heap[min_idx].f) {
			min_idx = l;
		}
		if (r < this.heap.length && this.heap[r].f < this.heap[min_idx].f) {
			min_idx = r;
		}
		if (min_idx !== idx) {
			[this.heap[min_idx], this.heap[idx]] = [
				this.heap[idx],
				this.heap[min_idx]
			];
			this.heapify(min_idx);
		}
	}
}
// ==================================================
