// === Init ===========================================
// scale param.
let size = 400;
let unit = 30;
let step = Math.floor(size / unit);
let diam = step / 2;
let obstacle_diam = step / 3;
let visited_scale = 0.55;
let obstacle_density = 0.2;
let obstacle_pixel_map = []; // i gave weight pixel-wise to the whole canvas, where there is an obstacle, its pixel weight should be infinity
let fps = 20;
let grow_len = 1;

// default start and end points
let start = [0, 0]; // in terms of index
let end = [unit - 1, unit - 1];

// colors
let blue = [0, 0, 255];
let green = [107, 165, 57];
let yellow = [255, 173, 0];
let livingcoral = [255, 111, 97];
let grey = [190, 198, 196];
let black = [81, 83, 74];
let white = [255, 255, 255];

// init grid
let grid = [];
let RRT_tree = [];
let neighbor_candidates = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
];

let nextSpot = Spot(0, 0);
let tempg = 0;
let tempf = 0;
let tovisit = [];
let visited = [];
let counter = 0; // RRT counter
// ==================================================

// === Basic Canvas Functions =======================
function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0; // cost
    this.g = size; // distance taken
    this.h = 0; // heuristic
    this.previous = undefined;
    this.neighbors = [];
    this.wallneighbors = [];

    this.wall = false;

    this.show = function(color, scale = 1) {
        // first cover the original canvas with white
        fill(white);
        noStroke();
        rect(this.i * step, this.j * step, step, step);
        // then fill with a new color
        fill(color);
        noStroke();
        ellipse(this.i * step + step / 2, this.j * step + step / 2, diam * scale, diam * scale);
    };

    this.getNeighbors = function() {
        return this.neighbors;
    };
}

function getStartandEnd() {

}

// generate random obstacle in grid
function randomObstacle() {
    for (var i = 0; i < unit; i++) {
        for (var j = 0; j < unit; j++) {
            if (random(1) < obstacle_density) {
                grid[i][j].wall = true;
            }
            if (i === start[0] && j === start[1]) {
                grid[i][j].wall = false;
            }
            if (i === end[0] && j === end[1]) {
                grid[i][j].wall = false;
            }
        }
    }
}

// generate obstacle with mouse
function drawObstacle() {

}

// render the grid once we make a move
function renderGrid(tovisit, visited) {
    for (var i = 0; i < tovisit.length; i++) {
        tovisit[i].show(livingcoral);
    }
    for (var i = 0; i < visited.length; i++) {
        visited[i].show(grey, visited_scale);
    }
}

// draw the global best path
function drawBestPath(final) {
    createP("showing best path!");
    var node = final;
    while (node !== undefined) {
        node.show(green);
        node = node.previous;
    }
}
// ==================================================

// ==================================================
// define heap structure
class MinHeap {

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
        while (curr !== 0 && this.heap[Math.floor(curr / 2)].f > this.heap[curr].f) {
            [this.heap[Math.floor(curr / 2)], this.heap[curr]] = [this.heap[curr], this.heap[Math.floor(curr / 2)]];
            curr = Math.floor(curr / 2);
        }
    }

    remove(idx) {
        // swap idx with the last node, heapify the whole tree
        [this.heap[idx], this.heap[this.heap.length - 1]] = [this.heap[this.heap.length - 1], this.heap[idx]];
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
            [this.heap[min_idx], this.heap[idx]] = [this.heap[idx], this.heap[min_idx]];
            this.heapify(min_idx);
        }
    }
}
// ==================================================

// init global heap object
let H = new MinHeap();

// ==================================================
// use manhattan distance projection to calculate heuristic
function manhattan_dist(spot1, spot2) {
    return max(abs(spot1.i - spot2.i), abs(spot1.j - spot2.j))
}

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
      line(this.parent.spot.i * step + step / 2, this.parent.spot.j * step + step / 2, this.spot.i * step + step / 2, this.spot.j * step + step / 2);
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
    return (obstacle_pixel_map[i][j] === 1)
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
        var j = (pixel_j2 - pixel_j1) * (i - pixel_i1) / (pixel_i2 - pixel_i1) + pixel_j1;
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

function genRandomSpot() {
    let tempSpot = grid[Math.floor(random(1) * unit)][Math.floor(random(1) * unit)];
    // tempSpot.h = manhattan_dist(tempSpot, grid[end[0]][end[1]]);
    return tempSpot;
}

function nearestVertex(spot) {
    let winner = undefined;
    let min_len = Infinity;
    for (var idx = 0; idx < RRT_tree.length; idx++) {
        let dist = Math.sqrt((RRT_tree[idx].spot.i - spot.i) * (RRT_tree[idx].spot.i - spot.i) + (RRT_tree[idx].spot.j - spot.j) * (RRT_tree[idx].spot.j - spot.j));
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
    [vec_i, vec_j] = [(son_spot.i - parent_spot.i) * step, (son_spot.j - parent_spot.j) * step];
    // Normalize the vector parent -> son and multiply by self.grow_len
    let normalen = norm1(vec_i, vec_j);
    [try_i, try_j] = [parent_spot.i * step + step / 2 + vec_i / normalen * grow_len * step, parent_spot.j * step + step / 2 + vec_j / normalen * grow_len * step];
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

function drawLine(spot1, spot2){
    line(spot1.i * step + step / 2, spot1.j * step + step / 2, spot2.i * step + step / 2, spot2.j * step + step / 2);
}
// ==================================================
// ==================================================

function setup() {
    createCanvas(size, size);
    background(255);
    frameRate(fps); // fps
    // init every grid as a Spot object
    for (var i = 0; i < unit; i++) {
        grid[i] = [];
    }
    for (i = 0; i < unit; i++) {
        for (var j = 0; j < unit; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
    // generate obstacle
    randomObstacle();
    // init canvas, neighbors, heuristic
    for (var i = 0; i < unit; i++) {
        for (var j = 0; j < unit; j++) {
            if (grid[i][j].wall) {
                // if wall
                fill(black);
                rect(i * step + step / 2 - obstacle_diam / 2, j * step + step / 2 - obstacle_diam / 2, obstacle_diam, obstacle_diam, obstacle_diam / 4);
            } else {
                // if not wall, add neighbor
                for (var k = 0; k < neighbor_candidates.length; k++) {
                    var x = neighbor_candidates[k][0];
                    var y = neighbor_candidates[k][1];
                    if (i + x < 0 || i + x >= unit || j + y < 0 || j + y >= unit) {
                        continue;
                    }
                    if (!grid[i + x][j + y].wall) {
                        grid[i][j].neighbors.push(grid[i + x][j + y]);
                        grid[i][j].h = manhattan_dist(grid[i][j], grid[end[0]][end[1]]);
                    } else {
                        grid[i][j].wallneighbors.push(grid[i + x][j + y]);
                    }
                }
            }
            if (i === start[0] && j === start[1]) {
                grid[i][j].show(green);
                grid[i][j].g = 0;
            }
            if (i === end[0] && j === end[1]) {
                grid[i][j].show(yellow);
            }
        }
    }

    // init dijkstra
    tovisit.push(grid[start[0]][start[1]]);
    // init Astar
    H.insert(grid[start[0]][start[1]]);
    // init RRT
    let randspot = genRandomSpot();
    let startSpot = grid[start[0]][start[1]];
    let nil = new RRTBranch(undefined, randspot);
    let initBranch = new RRTBranch(nil, startSpot);

    RRT_tree.push(initBranch);
}

// ====================================================
// dijkstra
function dijkstra() {
    let startSpot = grid[start[0]][start[1]];
    let endSpot = grid[end[0]][end[1]];

    var currSpot = tovisit[0];
    tovisit.splice(0, 1);
    // console.log("visiting: ", currSpot.i, currSpot.j);
    var neighbors = currSpot.getNeighbors();

    // === - add unvisited neighbors of curr to tovisit[] - ===
    for (var i = 0; i < neighbors.length; i++) {
        nextSpot = neighbors[i];
        if (visited.indexOf(nextSpot) !== -1) continue; // don't visit twice
        tempg = currSpot.g + 1;
        if (tempg < nextSpot.g) {
            nextSpot.g = tempg;
            nextSpot.previous = currSpot;
            tovisit.push(nextSpot);
        }
    }
    // === - mark curr as visited - ===
    visited.push(currSpot);

    renderGrid(tovisit, visited);
    if (visited.indexOf(endSpot) !== -1) {
        noLoop();
        drawBestPath(endSpot);
        console.log("done!");
        return; // GOAL!!
    }
    if (tovisit.length === 0) {
        createP("no solution")
    }
}

// ====================================================
// Astar
function astar() {
    let startSpot = grid[start[0]][start[1]];
    let endSpot = grid[end[0]][end[1]];

    var currSpot = H.popMin();
    var neighbors = currSpot.getNeighbors();

    // === - add unvisited neighbors of curr to tovisit[] - ===
    for (var i = 0; i < neighbors.length; i++) {
        nextSpot = neighbors[i];
        if (visited.indexOf(nextSpot) !== -1) continue; // don't visit twice
        tempf = currSpot.g + 1 + nextSpot.h;
        if (tempg < nextSpot.g) {
            nextSpot.f = tempf;
            nextSpot.previous = currSpot;
            H.insert(nextSpot);
        }
    }
    // === - mark curr as visited - ===
    visited.push(currSpot);

    renderGrid(H.heap, visited);
    if (visited.indexOf(endSpot) !== -1) {
        noLoop();
        drawBestPath(endSpot);
        console.log("done!");
        return; // GOAL!!
    }
    if (H.heap.length === 0) {
        createP("no solution")
    }
}

// ====================================================
// RRT
function RRT() {

    let endSpot = grid[end[0]][end[1]];
    // let startTime = second();

    // let nowTime = second();
    if (counter > unit * unit * (1 - obstacle_density)) {
        console.log("RRT Timeout!");
        createP("RRT Timeout!");
        noLoop();
    }
    let spot_rand = genRandomSpot();
    if (spot_rand.wall || visited.indexOf(nextSpot) !== -1) {return;}
    visited.push(spot_rand)
    counter++;
    let b_nearest = nearestVertex(spot_rand);
    let spot_new = extend(b_nearest, spot_rand);
    if (spot_new === undefined || spot_new !== undefined && spot_new.wall) {return;}
    b_new = new RRTBranch(b_nearest, spot_new);
    drawLine(b_nearest.spot, spot_new);
    RRT_tree.push(b_new);
    b_new.show(blue);
    if (isSegmentValid(RRT_tree[RRT_tree.length - 1].spot, endSpot)) {
      let lastBranch = new RRTBranch(RRT_tree[RRT_tree.length - 1], endSpot);
      RRT_tree.push(lastBranch);
      lastBranch.show(blue);
      console.log("done");
      createP("RRT tree built!");
      noLoop();
    }
}

function draw() {
    RRT();
    // noLoop();
}
