'''
[v3]
This script simulates a cellular automaton based on Conway's Game of Life rules and generates a heat map visualization of the grid. 
The heat map's color represents the cell's state and its surrounding neighbors. 
Hot cells (red) are cells that are alive in the current frame and will remain alive in the next frame. 
The warmth level of other cells is determined by the number of neighbors they have, normalized to the range [0, 1]. 
Cells that are alive and will die in the next frame count for two in this computation. 
The script generates an animation showing the heat maps for a specified number of snapshots, using a coolwarm color map to represent the warmth level of cells.

'''

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

def generate_heat_map(length, width, cell_size, snapshots, p_alive, rules):
    grid = np.random.choice([0, 1], size=(length, width), p=[1-p_alive, p_alive])
    heat_maps = []

    for _ in range(snapshots):
        next_grid = evolve_grid(grid, rules)
        heat_maps.append(grid_to_heat_map(grid, next_grid))
        grid = next_grid

    return heat_maps

'''
def grid_to_heat_map(grid, next_grid):
    heat_map = np.zeros(grid.shape)
    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            current_state = grid[row, col]
            next_state = next_grid[row, col]
            num_alive_neighbors = count_alive_neighbors(grid, row, col)
            
            if current_state == 1 and next_state == 1:
                heat_map[row, col] = 1      # hot
            else:
                if current_state == 1:
                    num_alive_neighbors += 1  # hot cells count for two in the computation
                heat_map[row, col] = num_alive_neighbors / 8  # normalize the warmth level to [0, 1]

    return heat_map
'''

def grid_to_heat_map(grid, next_grid):
    heat_map = np.zeros(grid.shape)
    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            current_state = grid[row, col]
            next_state = next_grid[row, col]
            num_alive_neighbors = count_alive_neighbors(grid, row, col)
            
            if current_state == 1 and next_state == 1:
                heat_map[row, col] = 1      # hot
            else:
                if current_state == 1:
                    num_alive_neighbors += 1  # hot cells count for two in the computation
                heat_map[row, col] = min(num_alive_neighbors / 8, 0.90)  # normalize the warmth level to [0, 1]

    return heat_map



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

if __name__ == "__main__":
    length = 30
    width = 30
    cell_size = 1
    snapshots = 50
    p_alive = 0.25
    rules = conways_rules

    heat_maps = generate_heat_map(length, width, cell_size, snapshots, p_alive, rules)
    plot_heat_maps(heat_maps, cell_size)




'''
def grid_to_heat_map(grid, next_grid):
    heat_map = np.zeros(grid.shape)
    for row in range(grid.shape[0]):
        for col in range(grid.shape[1]):
            current_state = grid[row, col]
            next_state = next_grid[row, col]
            num_alive_neighbors = count_alive_neighbors(grid, row, col)
            
            if current_state == 1 and next_state == 1:
                heat_map[row, col] = 1      # hot
            elif current_state == 1 and num_alive_neighbors >= 3 and next_state == 0:
                heat_map[row, col] = 0.75  # warmer
            elif current_state == 1 and num_alive_neighbors < 3 and next_state == 0:
                heat_map[row, col] = 0.5   # warm
            elif current_state == 0 and num_alive_neighbors >= 3 and next_state == 1:
                heat_map[row, col] = 0.25  # cool
            elif current_state == 0 and num_alive_neighbors < 3 and next_state == 1:
                heat_map[row, col] = 0.125 # cooler
            elif current_state == 0 and next_state == 0:
                heat_map[row, col] = 0      # cold

    return heat_map
'''