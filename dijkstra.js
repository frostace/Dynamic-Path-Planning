let size = 400;
let unit = 10;
let step = Math.floor(size / unit);
let start = [0, 0]; // in terms of index
let end = [unit - 1, unit - 1];
let blue = [0, 0, 255];
let green = [0, 255, 0];
let yellow = [255, 255, 0];
let red = [255, 0, 0];
let black = [0, 0, 0];
let white = [255, 255, 255];
var grid = new Array();
var i, j, k;
let tovisit = [];
let visited = [];
let neighbor_candidates = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0]
];


function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = size;
  this.h = 0;
  this.previous = undefined;
  this.neighbors = [];

  this.wall = false;

  this.show = function(color) {
    fill(color);
    noStroke();
    // rect(this.i * step, this.j * step, step, step)；
    ellipse(this.i * step + step / 2, this.j * step + step / 2, step, step);
  }
  
  this.getNeighbors = function(){
    return this.neighbors;
  }
}

function setup() {
  createCanvas(size, size);
  background(255);
  // init every grid as a Spot object
  for (var i = 0; i < unit; i++) {
    grid[i] = new Array();
  }
  for (i = 0; i < unit; i++) {
    for (var j = 0; j < unit; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  // generate obstacle
  randomObstacle();
  // init neighbors
  // init canvas
  for (i = 0; i < unit; i++) {
    for (var j = 0; j < unit; j++) {
      if (grid[i][j].wall) {
        fill(0);
        ellipse(i * step + step / 2, j * step + step / 2, step, step);
      } else {
        for (k = 0; k < neighbor_candidates.length; k++) {
          var x = neighbor_candidates[k][0];
          var y = neighbor_candidates[k][1];
          if (i + x < 0 || i + x >= unit || j + y < 0 || j + y >= unit) {
            continue;
          }
          if (!grid[i + x][j + y].wall) {
            grid[i][j].neighbors.push(grid[i + x][j + y]);
          }
        }
      }
      if (i == start[0] && j == start[1]) {
        grid[i][j].show(green);
        grid[i][j].g = 0;
      }
      if (i == end[0] && j == end[1]) {
        grid[i][j].show(yellow);
      }
    }
  }
}

// render the grid once we make a move
function renderGrid() {
  for (i = 0; i < tovisit.length; i++) {
    tovisited[i].show(green);
  }
  for (i = 0; i < visited.length; i++) {
    visited[i].show(red)
  }
}

// generate random obstacle in grid
function randomObstacle() {
  for (var i = 0; i < unit; i++) {
    for (var j = 0; j < unit; j++) {
      if (random(1) < 0.1) {
        grid[i][j].wall = true;
      }
      if (i == start[0] && j == start[1]) {
        grid[i][j].wall = false;
      }
      if (i == end[0] && j == end[1]) {
        grid[i][j].wall = false;
      }
    }
  }
}

// generate obstacle with mouse
function drawObstacle() {
  
}

function dijkstra(start, end) {
  console.log("dijkstra");
  tovisit.push(grid[start[0]][start[1]]);
  while (tovisit.length > 0) {
    var currSpot = tovisit.splice(0, 1);
    console.log(currSpot);
    var neighbors = currSpot.getNeighbors();
    console.log(neighbors);
    console.log(currSpot);
    for (i = 0; i < neighbors.length; i++) {
      nextSpot = neighbors[i];
      if (visited.indexOf(nextSpot) != -1) continue; // don't visit twice
      var tempg = currSpot.g + 1;
      if (tempg < nextSpot.g) {
        nextSpot.g = tempg;
        nextSpot.previous = currSpot;
        tovisit.push(nextSpot);
      }
    }
    visited.push(currSpot);
    if (visited.indexOf(grid[end[0]][end[1]]) != -1) {
      noLoop();
      console.log("done!");
      return; // GOAL!!
    }
  }
}

function astar() {

}

function draw() {

  dijkstra(start, end);
}
