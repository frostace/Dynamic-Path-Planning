export class QuadTree {
	constructor(board) {
		this.top_left = undefined;
		this.top_right = undefined;
		this.bottom_left = undefined;
		this.bottom_right = undefined;
		this.root = new TreeRegion();
	}

	findNearbyObstacles(targetRegion, currRegion) {
		if (
			currRegion === undefined ||
			haveNoIntersection(targetRegion, currRegion)
		)
			return [];
		let rowMid = Math.floor((currRegion.row1 + currRegion.row2) / 2);
		let colMid = Math.floor((currRegion.col1 + currRegion.col2) / 2);
		let tl = this.findNearbyObstacles(
			new TreeRegion(
				targetRegion.row1,
				rowMid,
				targetRegion.col1,
				colMid
			),
			currRegion.top_left
		);
		let tr = this.findNearbyObstacles(
			new TreeRegion(
				rowMid + 1,
				targetRegion.row2,
				colMid + 1,
				targetRegion.col2
			),
			currRegion.top_right
		);
		let obstacles = [];
	}
}

class TreeRegion {
	constructor(row1, row2, col1, col2) {
		this.row1 = row1;
		this.row2 = row2;
		this.col1 = col1;
		this.col2 = col2;
		this.regionNodes = [];
	}
}

function haveNoIntersection(region1, region2) {
	return (
		region1.row2 < region1.row1 ||
		region1.row1 > region2.row2 ||
		region1.col2 < region1.col1 ||
		region1.col1 > region2.col2
	);
}
