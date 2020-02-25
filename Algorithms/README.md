# Path-Planning-Visualization

I am gonna migrate this project to a dynamic path planning game in which the obstacles are dynamic and can be interactively added with mouse or touchpad, the destination is also moving as well.


Dijkstra                   |  Astar
:-------------------------:|:-------------------------:
![image](https://github.com/frostace/Path-Planning-Visualization/blob/master/dijkstra%20-%20demo.gif)  |  ![image](https://github.com/frostace/Path-Planning-Visualization/blob/master/astar%20-%20demo.gif)
RRT                        |  BIRRT
![image](https://github.com/frostace/Path-Planning-Visualization/blob/master/rrt%20-%20demo.gif)  |  
Potential Fields           |  PRM
![image](https://github.com/frostace/Path-Planning-Visualization/blob/master/potential%20field%20-%20demo.gif)

## BUGs:
1. ~~showing spots superposition problem<br>~~
2. ~~pass undefined variable to functions issue:~~
    * e.g. 239 passing an undefined variable to isSegmentValid function
    * 293 visiting an undefined entry of grid
        * b.c. i set the grow length to be 2, which may lead to the issue of growing the tree outside of the board, and visiting the undefined grid.
3. ~~when generating random spots, i should not instantize a new spot, i have to randomly pick a pair of indices and take the spot out of the grid matrix. otherwise i cannot get the spot.wall attribute correctly, cause they are all new objects.~~
4. ~~isSegmentValid sometimes malfunction, and the last branch can walk through an obstacle~~
5. ~~RRT branches superposition issue.=~~

## TODO:
1. ~~add diagonal ability~~
2. ~~figure out delay time issue~~
3. ~~after adding delay function, i can merge it into the dijkstra function~~
4. ~~I need to implement heap first to implement A*~~
5. ~~implement A* function, compare~~
6. ~~UI adjustment: rounded rectangle -> obstacle~~
7. ~~resize the demo gifs~~
8. Stochastic1 - PRM
9. Stochastic2 - RRT

## Astar
1. add heuristic calculation
2. give same weight to diagonal and vertical and horizontal
3. implement heap
4. run dijkstra with a heap, always poping the node with the least cost

## Visibility Graphs

## Voronoi Graphs

## Potential Fields

## PRM

## RRT
1. ~~implement is_state_valid function~~
2. ~~implement is_segment_valid function~~
3. ~~nearest_vertex~~
4. ~~extend~~
5. shortening the final path
6. improve the UI
