// scale param.
let size = 400;
let unit = 30;
let step = Math.floor(size / unit);
let diam = step / 2;
let obstacle_diam = step / 3;
let visited_scale = 0.55;
let obstacle_density = 0.2;
let fps = 20;

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = size;
  this.h = 0;
  this.previous = undefined;
  this.neighbors = [];

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

class MinHeap {

  constructor() {
    /* Initialing the array heap and adding a dummy element at index 0 */
    this.heap = [];
  }

  popMin(){
    var temp = this.heap[0];
    this.remove(0);
    return temp;
  }
  
  insert(node){
    this.heap.push(node);
    var curr = this.heap.length - 1;
    // console.log(curr, this.heap);
    while (curr != 0 && this.heap[Math.floor(curr / 2)].f > this.heap[curr].f){
      [this.heap[Math.floor(curr / 2)], this.heap[curr]] = [this.heap[curr], this.heap[Math.floor(curr / 2)]];
      curr = Math.floor(curr / 2);
    }
  }
  
  remove(idx){
    // swap idx with the last node, heapify the whole tree
    [this.heap[idx], this.heap[this.heap.length - 1]] = [this.heap[this.heap.length - 1], this.heap[idx]];
    // remove the last node
    this.heap.splice(this.heap.length - 1, 1);
    this.heapify(idx);
  }
  
  heapify(idx){
    var min_idx = idx;
    let l = idx * 2;
    let r = idx * 2 + 1;
    if (l < this.heap.length && this.heap[l].f < this.heap[min_idx].f){
      min_idx = l;
    }
    if (r < this.heap.length && this.heap[r].f < this.heap[min_idx].f){
      min_idx = r;
    }
    if (min_idx != idx){
      [this.heap[min_idx], this.heap[idx]] = [this.heap[idx], this.heap[min_idx]];
      this.heapify(min_idx);
    }
  }
}

// test in setup function
function setup() {
  createCanvas(400, 400);
  let H = new MinHeap();
  for (var i = 0; i < 5; i++){
    let s = new Spot(i, i);
    s.f = 7 - i;
    H.insert(s);
    console.log(H);
  }
  // let x = H.popMin();
  // console.log(x);
  for (var i = 0; i < 5; i++){
    console.log(H.popMin());
  }
}

function draw() {
  background(220);
}
