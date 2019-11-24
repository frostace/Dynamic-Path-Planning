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
    this.heap = [null]
  }

  getMin(){
    return this.heap.splice(0, 1);
  }
  
  insert(){
    node = 
    
  }
  
  remove(){
    
    
  }
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
