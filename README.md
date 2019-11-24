# Path-Planning-Visualization

## DEMO - DIJKSTRA

![image](https://github.com/frostace/Path-Planning-Visualization/blob/master/dijkstra%20-%20demo.gif)

## DEMO - ASTAR

![image](https://github.com/frostace/Path-Planning-Visualization/blob/master/astar%20-%20demo.gif)

## BUGs:

~~1. showing spots superposition problem~~

## TODO:
~~1. add diagonal ability~~<br>
~~2. figure out delay time issue~~<br>
~~3. after adding delay function, i can merge it into the dijkstra function~~<br>
~~4. I need to implement heap first to implement A*<br>~~
~~5. implement A* function, compare<br>~~
~~6. UI adjustment: rounded rectangle -> obstacle~~<br>
7. resize the demo gifs<br>
8. Stochastic1 - PRM<br>
9. Stochastic2 - RRT<br>

## Astar
1. add heuristic calculation
2. give same weight to diagonal and vertical and horizontal
3. implement heap
4. run dijkstra with a heap, always poping the node with the least cost

## RRT
1. implement is_state_valid function
2. implement is_segment_valid function
