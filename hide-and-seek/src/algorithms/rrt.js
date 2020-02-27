// ====================================================
// RRT

// ==================================================
// === functions for RRT ============================
class RRTBranch {
	constructor(parent, spot) {
		this.parent = parent;
		this.spot = spot;
	}

	show(color) {
		stroke(color);
		strokeWeight(2);
		line(
			this.parent.spot.i * step + step / 2,
			this.parent.spot.j * step + step / 2,
			this.spot.i * step + step / 2,
			this.spot.j * step + step / 2
		);
	}
}

function initObstaclePixel() {
	for (var i = 0; i < size; i++) {
		obstacle_pixel_map[i] = [];
	}
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			obstacle_pixel_map[i][j] = 0;
			// remember to make the whole unit grid pixel 1 in the setup function
		}
	}
}

// assume static obstacles
function isStateValid(i, j) {
	// type: i, j -> pixel idx
	return obstacle_pixel_map[i][j] === 1;
}

// // fuzzy pixel approach
// function isSegmentValid(i1, j1, i2, j2) {
//     // apply fuzzy pixel on the segment to check if the state of every sample is valid
//     // b.c. inner points on this segment don't have to be exactly on a pixel
//
//     // here i1, j1, i2, j2 are node idx
//     // convert them to pixel idx before checking state validity
//     pixel_i1 = i1 * step;
//     pixel_j1 = j1 * step;
//     pixel_i2 = i2 * step;
//     pixel_j2 = j2 * step;
//     for (var i = pixel_i1; i < pixel_i2; i++){
//         // calculate the interpolation of pixel j accordingly
//         var j = (pixel_j2 - pixel_j1) * (i - pixel_i1) / (pixel_i2 - pixel_i1) + pixel_j1;
//         // j should be a float, we should check 2 fuzzy pixels near j: floor(j) and ceiling(j)
//         if (!isStateValid(i, Math.ceil(j)) || !isStateValid(i, Math.floor(j))){
//             return false
//         }
//     }
//     return true
// }

// another approach to check segment validity
function isSegmentValid(spot1, spot2) {
	// apply fuzzy pixel on the segment to check if the state of every sample is valid
	// b.c. inner points on this segment don't have to be exactly on a pixel

	// here i1, j1, i2, j2 are node idx
	// convert them to pixel idx before checking state validity
	[i1, j1, i2, j2] = [spot1.i, spot1.j, spot2.i, spot2.j];
	pixel_i1 = i1 * step + step / 2;
	pixel_j1 = j1 * step + step / 2;
	pixel_i2 = i2 * step + step / 2;
	pixel_j2 = j2 * step + step / 2;
	for (var i = pixel_i1; i < pixel_i2; i += Math.floor(step / 2)) {
		// calculate the interpolation of pixel j accordingly
		var j =
			((pixel_j2 - pixel_j1) * (i - pixel_i1)) / (pixel_i2 - pixel_i1) +
			pixel_j1;
		// j should be a float, we should check 2 fuzzy pixels near j: floor(j) and ceiling(j)
		// find the belonging grid index from the fuzzy pixel
		i_lord = Math.floor(i / step);
		j_lord = Math.floor(j / step);
		if (grid[i_lord][j_lord].wall) {
			return false;
		}
	}
	return true;
}

function isWithinScope(spot1, spot2) {
	return (
		Math.sqrt(
			(spot1.i - spot2.i) * (spot1.i - spot2.i) +
				(spot1.j - spot2.j) * (spot1.j - spot2.j)
		) < scope
	);
}

function genRandomSpot() {
	let tempSpot =
		grid[Math.floor(random(1) * unit)][Math.floor(random(1) * unit)];
	// tempSpot.h = manhattan_dist(tempSpot, grid[end[0]][end[1]]);
	return tempSpot;
}

function nearestVertex(spot) {
	let winner = undefined;
	let min_len = Infinity;
	for (var idx = 0; idx < RRT_tree.length; idx++) {
		let dist = Math.sqrt(
			(RRT_tree[idx].spot.i - spot.i) * (RRT_tree[idx].spot.i - spot.i) +
				(RRT_tree[idx].spot.j - spot.j) *
					(RRT_tree[idx].spot.j - spot.j)
		);
		if (dist < min_len && dist !== 0) {
			winner = RRT_tree[idx];
			min_len = dist;
		}
	}
	return winner;
}

function norm1(a, b) {
	return Math.sqrt(a * a + b * b);
}

function extend(parent_branch, son_spot) {
	// in terms of pixel
	let parent_spot = parent_branch.spot;
	[vec_i, vec_j] = [
		(son_spot.i - parent_spot.i) * step,
		(son_spot.j - parent_spot.j) * step
	];
	// Normalize the vector parent -> son and multiply by self.grow_len
	let normalen = norm1(vec_i, vec_j);
	[try_i, try_j] = [
		parent_spot.i * step + step / 2 + (vec_i / normalen) * grow_len * step,
		parent_spot.j * step + step / 2 + (vec_j / normalen) * grow_len * step
	];
	// find belonging lord of try_i and try_j
	i_lord = Math.floor(try_i / step);
	j_lord = Math.floor(try_j / step);
	if (i_lord < 0 || i_lord >= unit || j_lord < 0 || j_lord >= unit) {
		return undefined;
	}
	if (isSegmentValid(parent_spot, grid[i_lord][j_lord])) {
		return grid[i_lord][j_lord];
	}
	return undefined;
}

export function RRT() {
	let endSpot = grid[end[0]][end[1]];
	// let startTime = second();

	// let nowTime = second();
	if (counter > unit * unit * (1 - obstacle_density)) {
		console.log("RRT Timeout!");
	}
	let spot_rand = genRandomSpot();
	if (spot_rand.wall || visited.indexOf(nextSpot) !== -1) {
		return;
	}
	visited.push(spot_rand);
	counter++;
	let b_nearest = nearestVertex(spot_rand);
	let spot_new = extend(b_nearest, spot_rand);
	if (
		spot_new === undefined ||
		(spot_new !== undefined && spot_new.wall) ||
		visited.indexOf(spot_new) !== -1
	) {
		return;
	}
	b_new = new RRTBranch(b_nearest, spot_new);
	// drawLine(b_nearest.spot, spot_new);
	RRT_tree.push(b_new);
	b_new.show(livingcoral);
	// if (isSegmentValid(RRT_tree[RRT_tree.length - 1].spot, endSpot))
	if (isWithinScope(RRT_tree[RRT_tree.length - 1].spot, endSpot)) {
		let lastBranch = new RRTBranch(RRT_tree[RRT_tree.length - 1], endSpot);
		RRT_tree.push(lastBranch);
		lastBranch.show(livingcoral);
		console.log("done");
	}
}
// ====================================================
