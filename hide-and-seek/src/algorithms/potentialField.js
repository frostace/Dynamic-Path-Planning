// import "../libraries/p5";
// import "../libraries/p5.dom";
// import "../libraries/p5.sound";
import {
	boardRowNum,
	START_NODE_ROW,
	START_NODE_COL,
	FINISH_NODE_ROW,
	FINISH_NODE_COL,
	neighborCandidates
} from "../constants.js";
import { QuadTree } from "./quadtree";

// Potential Field
export function potentialField(board, startNode, finishNode) {
	let potentialCurrNode = startNode;
	let visited = [];
	console.log(board, startNode, finishNode, potentialCurrNode);
	console.log(
		potentialCurrNode !== finishNode,
		potentialCurrNode.row !== finishNode.row,
		potentialCurrNode.col !== finishNode.col
	);
	while (
		!(
			potentialCurrNode.row === finishNode.row &&
			potentialCurrNode.col === finishNode.col
		)
	) {
		console.log(potentialCurrNode.row, potentialCurrNode.col);
		visited.push(potentialCurrNode);
		let potentialNextNode = findNextNode(
			board,
			potentialCurrNode,
			finishNode
		);
		potentialNextNode.previousNode = potentialCurrNode;
		potentialCurrNode = potentialNextNode;
	}
	console.log("done");
	return visited;
}

// ==================================================
// ==== function for potential field ================
// attracted by the goal
// energy is a scalar or a vector????
function attractEnergy(currNode, goalNode) {
	let attEnergy = createVector(
		goalNode.row - currNode.row,
		goalNode.col - currNode.col
	);
	let d = attEnergy.mag();
	attEnergy.setMag(d * d);
	return attEnergy;
}

// repelled by the obstacles
// we should store nearby obstacles in a quadtree
function repellEnergy(currNode, obstacles) {
	let repEnergy = createVector(0, 0);
	if (obstacles.length === 0) {
		return createVector(0, 0);
	}
	for (let obstacle in obstacles) {
		let tempEnergy = createVector(
			currNode.row - obstacle.row,
			currNode.col - obstacle.col
		);
		let d = tempEnergy.mag();
		tempEnergy.setMag(obstacle.weight / d / d);
		repEnergy.add(tempEnergy);
	}
	return repEnergy;
}

function potentialEnergy(currNode, goalNode) {
	let obstacles = findNearbyObstacles(currNode);
	let energy = Vector.add(
		attractEnergy(currNode, goalNode),
		repellEnergy(currNode, obstacles)
	);
	console.log(currNode.row, currNode.col, energy);
	return energy;
}

// find nearby obstacles of the current Node with QuadTree
function findNearbyObstacles(currNode) {
	let obstacles = [];

	return obstacles;
}

// find the nextNode along the negative gradient
function findNextNode(board, currNode, goalNode) {
	let winner;
	let minEnergy = Infinity;
	// console.log("looking for next node of:", currNode);
	for (let [di, dj] of neighborCandidates) {
		let newi = currNode.row + di;
		let newj = currNode.col + dj;
		if (
			newi < 0 ||
			newi >= boardRowNum ||
			newj < 0 ||
			newj >= boardRowNum
		) {
			continue;
		}
		let neighbor = board[newi][newj];
		if (neighbor === undefined || neighbor.wall) {
			continue;
		}
		let tempEnergy = potentialEnergy(neighbor, goalNode).mag();
		// console.log(tempEnergy, minEnergy);
		if (tempEnergy < minEnergy) {
			minEnergy = tempEnergy;
			winner = neighbor;
		}
	}
	return winner;
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.magnitude = this.mag();
	}
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	setMag(val) {
		if (val === 0) {
			this.x = 0;
			this.y = 0;
			return;
		}
		this.x = (this.x / this.magnitude) * val;
		this.y = (this.y / this.magnitude) * val;
	}
	static add(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}
}

const createVector = (x, y) => {
	let v = new Vector(x, y);
	return v;
};
