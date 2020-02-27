import { MinHeap } from "./minHeap";

// Astar
export function astar(board, startNode, finishNode) {
	let H = new MinHeap();
	console.log(H);
	H.insert(startNode);
	let visited = [];

	console.log(H[0]);
	while (visited.indexOf(finishNode) == -1 && H.length !== 0) {
		var currNode = H.popMin();
		var neighbors = currNode.neighbors.map(delta => {
			// console.log(delta, board);
			return board[delta[0]][delta[1]];
		});

		// === - add unvisited neighbors of curr to tovisit[] - ===
		for (var i = 0; i < neighbors.length; i++) {
			let nextNode = neighbors[i];
			if (visited.indexOf(nextNode) !== -1 || nextNode.isWall) continue; // don't visit twice
			let tempg = currNode.g + 1;
			let tempf = tempg + nextNode.h;
			if (tempg < nextNode.g) {
				nextNode.g = tempg;
				nextNode.f = tempf;
				nextNode.previousNode = currNode;
				H.insert(nextNode);
			}
		}
		// === - mark curr as visited - ===
		visited.push(currNode);
	}
	if (visited.indexOf(finishNode) !== -1) {
		// noLoop();
		// drawBestPath(finishNode);
		console.log("done!");
		// GOAL!!
	}
	if (H.heap.length === 0) {
		console.log("no solution");
	}
	return visited;
}
