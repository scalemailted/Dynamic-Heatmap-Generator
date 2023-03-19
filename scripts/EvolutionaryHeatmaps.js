class HeatmapConwayGoL {
    constructor(canvasId, length, width, cellSize, snapshots, pAlive) {
        this.canvasId = canvasId 
        this.length = length;
        this.width = width;
        this.cellSize = cellSize;
        this.snapshots = snapshots;
        this.pAlive = pAlive;
    }

    // Shared methods go here:
    // randomChoice
    randomChoice(arr, p) {
        const sum = p.reduce((a, b) => a + b);
        const rand = Math.random() * sum;
        let s = 0;
        for (let i = 0; i < arr.length; i++) {
            s += p[i];
            if (rand < s) {
                return arr[i];
            }
        }
        return arr[arr.length - 1];
    }

    // generateGrid
    generateGrid() {
        const { length, width, pAlive } = this;
        const grid = Array.from({ length }, () => Array.from({ length: width }, () => this.randomChoice([0, 1], [1 - pAlive, pAlive])));
        return grid;
    }

    // countAliveNeighbors
    countAliveNeighbors(grid, row, col) {
        const numRows = grid.length;
        const numCols = grid[0].length;
        let aliveNeighbors = 0;

        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                if (rowOffset === 0 && colOffset === 0) {
                    continue;
                }

                const neighborRow = (row + rowOffset + numRows) % numRows;
                const neighborCol = (col + colOffset + numCols) % numCols;

                if (grid[neighborRow][neighborCol] === 1) {
                    aliveNeighbors += 1;
                }
            }
        }

        return aliveNeighbors;
    }

    // evolveGrid
    evolveGrid(grid, rules) {
        const numRows = grid.length;
        const numCols = grid[0].length;
        const newGrid = grid.map(row => row.slice());

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const numAliveNeighbors = this.countAliveNeighbors(grid, row, col);
                newGrid[row][col] = rules(grid[row][col], numAliveNeighbors);
            }
        }

        return newGrid;
    }

    // conwaysRules
    conwaysRules(cell, numAliveNeighbors) {
        if (cell === 1 && (numAliveNeighbors === 2 || numAliveNeighbors === 3)) {
            return 1;
        } else if (cell === 0 && numAliveNeighbors === 3) {
            return 1;
        } else {
            return 0;
        }
    }

    // drawHeatMap
    drawHeatMap(heatMap) {
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas.getContext("2d");
        const { width, length, ctx, cellSize } = this;
        this.canvas.width = width * cellSize;
        this.canvas.height = length * cellSize;
        const numRows = heatMap.length;
        const numCols = heatMap[0].length;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const value = heatMap[row][col];
                const [r,g,b] = coolwarm(value)
                ctx.fillStyle = `rgb(${r},${g},${b})`
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    getHeatmaps(){
        if (!this.heatmaps){
            this.setHeatmaps()
        }
        return this.heatmaps;
    }

    // setHeatmaps
    setHeatmaps() {
        let grid = this.generateGrid();
        this.heatmaps = [];

        for (let i = 0; i < this.snapshots; i++){
            grid = this.evolveGrid(grid, this.conwaysRules);
            const heatmap = this.gridToHeatMap(grid);
            this.heatmaps.push(heatmap);

        }
    }

}

class HeatmapConwayGoLWithSpatialRules extends HeatmapConwayGoL {
    // Unique methods for this class

    // gridToHeatMap
    gridToHeatMap(grid) {
        const numRows = grid.length;
        const numCols = grid[0].length;
        const heatMap = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 0));

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const numAliveNeighbors = this.countAliveNeighbors(grid, row, col);
                if (grid[row][col] === 1) {
                    heatMap[row][col] = Math.min(0.5 + numAliveNeighbors * 0.1, 1);
                } else {
                    heatMap[row][col] = Math.min(numAliveNeighbors * 0.1, 1);
                }
            }
        }

        return heatMap;
    }

    // run
    run() {
        let grid = this.generateGrid();
        let heatMap = this.gridToHeatMap(grid);
        this.drawHeatMap(heatMap);

        let currentSnapshot = 0;
        const interval = setInterval(() => {
            grid = this.evolveGrid(grid, this.conwaysRules.bind(this));
            heatMap = this.gridToHeatMap(grid);
            this.drawHeatMap(heatMap);

            currentSnapshot++;
            if (currentSnapshot >= this.snapshots) {
                clearInterval(interval);
            }
        }, 500);
    }
}

class HeatmapConwayGoLWithTemporalRules extends HeatmapConwayGoL {
    // Unique methods for this class
    // generateHeatMaps
    generateHeatMaps(length, width, cellSize, snapshots, pAlive, rules) {
        let grid = generateGrid(length, width, pAlive);
        let heatMaps = [];

        for (let i = 0; i < snapshots; i++) {
            let nextGrid = evolveGrid(grid, rules);
            heatMaps.push(gridToHeatMap(grid, nextGrid));
            grid = nextGrid;
        }

        return heatMaps;
    }

    // gridToHeatMap
    gridToHeatMap(grid, nextGrid) {
        const numRows = grid.length;
        const numCols = grid[0].length;
        const heatMap = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 0));

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const currentState = grid[row][col];
                const nextState = nextGrid[row][col];
                let numAliveNeighbors = this.countAliveNeighbors(grid, row, col);

                if (currentState === 1 && nextState === 1) {
                    heatMap[row][col] = 1; // hot
                } else {
                    if (currentState === 1) {
                        numAliveNeighbors += 1; // hot cells count for two in the computation
                    }
                    heatMap[row][col] = Math.min(numAliveNeighbors / 8, 0.90); // normalize the warmth level to [0, 1]
                }
            }
        }

        return heatMap;
    }


    // setHeatmaps
    setHeatmaps() {
        let grid = this.generateGrid();
        let nextGrid = this.evolveGrid(grid, this.conwaysRules);
        this.heatmaps = [];

        for (let i = 0; i < this.snapshots; i++){
            grid = this.evolveGrid(grid, this.conwaysRules);
            nextGrid = this.evolveGrid(grid, this.conwaysRules);
            const heatmap = this.gridToHeatMap(grid,nextGrid);
            this.heatmaps.push(heatmap);

        }
    }

    // run
    run() {
        let grid = this.generateGrid();
        let nextGrid = this.evolveGrid(grid, this.conwaysRules.bind(this));
        let heatMap = this.gridToHeatMap(grid, nextGrid);
        this.drawHeatMap(heatMap);

        let currentSnapshot = 0;
        const interval = setInterval(() => {
            grid = nextGrid;
            nextGrid = this.evolveGrid(grid, this.conwaysRules.bind(this));
            heatMap = this.gridToHeatMap(grid, nextGrid);
            this.drawHeatMap(heatMap);

            currentSnapshot++;
            if (currentSnapshot >= this.snapshots) {
                clearInterval(interval);
            }
        }, 500);
    }

    
}

/*
const length = 30;
const width = 30;
const cellSize = 20;
const snapshots = 50;
const pAlive = 0.25;

const heatmapEvoSpace = new HeatmapConwayGoLWithSpatialRules("heatmapCanvas", length, width, cellSize, snapshots, pAlive);
//heatmapEvoSpace.run();

const heatmapEvoTime = new HeatmapConwayGoLWithTemporalRules("heatmapCanvas", length, width, cellSize, snapshots, pAlive);
//heatmapEvoTime.run();
*/
