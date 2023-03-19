'''
[ v1 ]
This script allows you to control the:
    - length, 
    - width, 
    - cell size, 
    - number of snapshots, 
    - probability distribution of alive cells,
    - evolutionary rules. 

This code uses Conway's Game of Life rules, 

[ v2 ]
Here's the refactored code for the Conway's Game of Life, where:
    - hot cells represent stable cell configurations, 
    - warm spots are alive cells, 
    - dead cells are cold. 
The warmer the cell, the more neighbors it has, and cooler cells have fewer neighbors.

In this refactored code, 
I've added the grid_to_heat_map function to convert the binary grid from the Game of Life into a heat map representation. 
This function iterates through each cell in the grid and calculates the heat map value based on the number of alive neighbors and whether the cell is alive or dead.

The generate_heat_map function has been updated to use the grid_to_heat_map function to create heat maps for each snapshot of the simulation. 
The other functions and the plotting code remain the same.
'''

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import json



def generate_heat_map(length, width, cell_size, snapshots, p_alive, rules):
    grid = np.random.choice([0, 1], size=(length, width), p=[1-p_alive, p_alive])
    heat_maps = [grid_to_heat_map(grid)]

    for _ in range(snapshots):
        grid = evolve_grid(grid, rules)
        heat_maps.append(grid_to_heat_map(grid))

    return heat_maps

def grid_to_heat_map(grid):
    heat_map = np.zeros(grid.shape)
    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            num_alive_neighbors = count_alive_neighbors(grid, row, col)
            if grid[row, col] == 1:
                heat_map[row, col] = 0.5 + num_alive_neighbors * 0.1
            else:
                heat_map[row, col] = num_alive_neighbors * 0.1
    return heat_map

# Other functions (evolve_grid, count_alive_neighbors, conways_rules) remain the same

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


def conways_rules(cell, num_alive_neighbors):
    if cell == 1 and (num_alive_neighbors == 2 or num_alive_neighbors == 3):
        return 1
    elif cell == 0 and num_alive_neighbors == 3:
        return 1
    else:
        return 0

def count_alive_neighbors(grid, row, col):
    alive_neighbors = 0

    for row_offset in [-1, 0, 1]:
        for col_offset in [-1, 0, 1]:
            if row_offset == 0 and col_offset == 0:
                continue

            neighbor_row = (row + row_offset) % grid.shape[0]
            neighbor_col = (col + col_offset) % grid.shape[1]

            if grid[neighbor_row, neighbor_col] == 1:
                alive_neighbors += 1

    return alive_neighbors


def evolve_grid(grid, rules):
    new_grid = grid.copy()

    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            num_alive_neighbors = count_alive_neighbors(grid, row, col)
            new_grid[row, col] = rules(grid[row, col], num_alive_neighbors)

    return new_grid


def save_heat_maps_to_json(heat_maps, file_name):
    heat_maps_list = [heat_map.tolist() for heat_map in heat_maps]
    with open(file_name, 'w') as f:
        json.dump(heat_maps_list, f)

# Alternatively, you can use NumPy's binary format
def save_heat_maps_to_file_np(heat_maps, file_name):
    np.save(file_name, heat_maps)

def main():
    length = 30
    width = 30
    cell_size = 1
    snapshots = 50
    p_alive = 0.25
    rules = conways_rules

    heat_maps = generate_heat_map(length, width, cell_size, snapshots, p_alive, rules)

    # Save heatmaps to a file
    save_heat_maps_to_json(heat_maps, 'heat_maps.json')

    plot_heat_maps(heat_maps, cell_size)

if __name__ == "__main__":
    main()




