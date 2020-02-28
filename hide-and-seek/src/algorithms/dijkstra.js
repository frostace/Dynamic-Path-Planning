export function dijkstra(board, startNode, finishNode) {
	let tovisit = [];
	let visited = [];
	tovisit.push(startNode);

	while (visited.indexOf(finishNode) === -1 && tovisit.length !== 0) {
		var currNode = tovisit[0];
		tovisit.splice(0, 1);

		// console.log(currNode.row, currNode.col);
		// maintain a neighbors attribute so we don't have to retrieve its neighbors every time
		var neighbors = currNode.neighbors.map(delta => {
			// console.log(delta, board);
			return board[delta[0]][delta[1]];
		});

		// console.log(neighbors);
		// === - add unvisited neighbors of curr to tovisit[] - ===
		for (var i = 0; i < neighbors.length; i++) {
			var nextNode = neighbors[i];
			// console.log(visited, currNode, nextNode);
			if (visited.indexOf(nextNode) !== -1 || nextNode.isWall) {
				continue;
			} // don't visit twice
			var tempDist = currNode.g + 1;
			// console.log(currNode, nextNode, tovisit);
			if (tempDist < nextNode.g) {
				nextNode.g = tempDist;
				nextNode.previousNode = currNode;
				tovisit.push(nextNode);
			}
		}
		// === - mark curr as visited - ===
		visited.push(currNode);
	}
	// renderGrid(tovisit, visited);
	if (visited.indexOf(finishNode) !== -1) {
		// noLoop();
		// drawBestPath(endNode);
		console.log("done!");
		// GOAL!!
	}
	if (tovisit.length === 0) {
		console.log("no solution");
	}
	return visited;
}
