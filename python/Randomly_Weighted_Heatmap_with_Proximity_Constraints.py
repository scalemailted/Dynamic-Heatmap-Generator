
'''
[v1]
Here's a script that generates a random temporal heat map with values as real numbers between 0 and 1 for each cell. 
The current state is independent of the prior state. 
The script includes parameters for length, width, cell_size, snapshots, and hotspot distribution, allowing you to control the occurrence of hot spots, the clustering of hot spots across both the spatial and temporal domains, and other stochastic options.

In this script, the apply_hotspot_distribution function applies the hotspot distribution to the random grid. 
The hotspot_threshold, warm_threshold, and cool_threshold parameters control the occurrence of hotspots and the clustering of hotspots across the spatial domain. 
You can adjust these parameters to change the distribution of hotspots and other temperature patterns in the heat map.

This script generates random heat maps with configurable distribution of hotspots and clustering across both spatial and temporal domains, 
with options to control the occurrence of hotspots and make hot spots rarer than warm or cool spots.

[v2]
Here's the refactored code that enforces the requirement that:
    - hot cells are more likely to be surrounded by warm cells, 
    - cool cells are more likely to be surrounded by cold cells

In this refactored code, I've added a new function called enforce_neighborhood. 
This function iterates through each cell in the grid and modifies the cell values based on the neighborhood conditions. 
    - Hot cells have their values set to the maximum value of their neighbors, 
    - Cold cells have their values set to the minimum value of their neighbors.

The generate_heat_map function has been updated to call the enforce_neighborhood function after applying the hotspot distribution.

[v2]
In this code, heatmaps are generated with hot, warm, cool, and cold areas based on a given hotspot distribution. 
The code enforces the conditions that hot nodes are surrounded by warm nodes and warm spots are neighbors of hot spots by updating the values of neighboring cells to be warm if they are below the warm threshold.

'''

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

def generate_heat_map(length, width, cell_size, snapshots, hotspot_distribution):
    heat_maps = []

    for _ in range(snapshots):
        grid = np.random.rand(length, width)
        grid = apply_hotspot_distribution(grid, hotspot_distribution)
        grid = enforce_neighborhood(grid, hotspot_distribution)
        heat_maps.append(grid)

    return heat_maps

def plot_heat_maps(heat_maps, cell_size):
    fig, ax = plt.subplots()
    cmap = plt.get_cmap("coolwarm")

    def update(frame):
        ax.clear()
        ax.imshow(heat_maps[frame], cmap=cmap, extent=[0, heat_maps[frame].shape[1], 0, heat_maps[frame].shape[0]])
        ax.set_xticks(np.arange(-0.5, heat_maps[frame].shape[1], cell_size), minor=True)
        ax.set_yticks(np.arange(-0.5, heat_maps[frame].shape[0], cell_size), minor=True)
        ax.grid(which="minor", color="k", linestyle="-", linewidth=1)

    ani = FuncAnimation(fig, update, frames=len(heat_maps), interval=500, repeat=False)
    plt.show()

def apply_hotspot_distribution(grid, hotspot_distribution):
    hotspot_threshold = hotspot_distribution["hotspot_threshold"]
    warm_threshold = hotspot_distribution["warm_threshold"]
    cool_threshold = hotspot_distribution["cool_threshold"]

    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            if grid[row, col] > hotspot_threshold:
                grid[row, col] = 1
            elif grid[row, col] > warm_threshold:
                grid[row, col] = 0.5
            elif grid[row, col] > cool_threshold:
                grid[row, col] = 0.25
            else:
                grid[row, col] = 0

    return grid


def enforce_neighborhood(grid, hotspot_distribution):
    new_grid = grid.copy()
    warm_threshold = hotspot_distribution["warm_threshold"]

    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            neighbors = [((row + i) % grid.shape[0], (col + j) % grid.shape[1]) for i in range(-1, 2) for j in range(-1, 2) if i != 0 or j != 0]

            if grid[row, col] == 1:  # hot cell
                for r, c in neighbors:
                    if new_grid[r, c] < warm_threshold:
                        new_grid[r, c] = 0.5

    return new_grid

# plot_heat_maps function remains the same

if __name__ == "__main__":
    length = 30
    width = 30
    cell_size = 1
    snapshots = 50
    hotspot_distribution = {
        "hotspot_threshold": 0.95,
        "warm_threshold": 0.8,
        "cool_threshold": 0.4
    }

    heat_maps = generate_heat_map(length, width, cell_size, snapshots, hotspot_distribution)
    plot_heat_maps(heat_maps, cell_size)

