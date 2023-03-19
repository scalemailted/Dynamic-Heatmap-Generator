class HeatmapRandomBase {
    constructor(canvasId, length, width, cellSize, snapshots, hotspotDistribution) {
      this.canvasId = canvasId
      this.length = length;
      this.width = width;
      this.cellSize = cellSize;
      this.snapshots = snapshots;
      this.hotspotDistribution = hotspotDistribution;
    }
  
    generateRandomGrid() {
      const grid = new Array(this.length).fill(null).map(() =>
        new Array(this.width).fill(null).map(() => Math.random())
      );
      return grid;
    }
  
    applyHotspotDistribution(grid) {
      const hotThreshold = this.hotspotDistribution.hotThreshold;
      const warmThreshold = this.hotspotDistribution.warmThreshold;
      const coolThreshold = this.hotspotDistribution.coolThreshold;
  
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] > hotThreshold) {
            grid[row][col] = 1;
          } else if (grid[row][col] > warmThreshold) {
            grid[row][col] = 0.5;
          } else if (grid[row][col] > coolThreshold) {
            grid[row][col] = 0.25;
          } else {
            grid[row][col] = 0;
          }
        }
      }
  
      return grid;
    }
  
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
            const [r, g, b] = coolwarm(value);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    setHeatmaps() {
      this.heatmaps = this.generateHeatMap();
    }

    getHeatmaps(){
      if (!this.heatmaps){
        this.setHeatmaps()
      }
      return this.heatmaps;
    }
  }
  
  class HeatmapRandomWeightedWithConstraints extends HeatmapRandomBase {
    generateHeatMap() {
        const heatMaps = [];
        for (let i = 0; i < this.snapshots; i++) {
                let grid = this.generateRandomGrid();
                grid = this.applyHotspotDistribution(grid);
                grid = this.enforceNeighborhood(grid);
                heatMaps.push(grid);
        }
        return heatMaps;
    }
  
    // enforceNeighborhood method implementation here
    enforceNeighborhood(grid) {
        const newGrid = JSON.parse(JSON.stringify(grid));
        const warmThreshold = this.hotspotDistribution.warmThreshold;

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const neighbors = [];
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i !== 0 || j !== 0) {
                            neighbors.push([(row + i + grid.length) % grid.length, (col + j + grid[row].length) % grid[row].length]);
                        }
                    }
                }

                if (grid[row][col] === 1) { // hot cell
                    for (const [r, c] of neighbors) {
                        if (newGrid[r][c] < warmThreshold) {
                            newGrid[r][c] = 0.5;
                        }
                    }
                }
            }
        }

        return newGrid;
    }

    // run method implementation here
    run() {
        let heatMaps = this.generateHeatMap();
        this.drawHeatMap(heatMaps[0]);

        let currentSnapshot = 0;
        const interval = setInterval(() => {
            this.drawHeatMap(heatMaps[currentSnapshot]);

            currentSnapshot++;
            if (currentSnapshot >= this.snapshots) {
                clearInterval(interval);
            }
        }, 500);
    }
  }
  
  class HeatmapRandomWeighted extends HeatmapRandomBase {
    generateHeatMap() {
        const heatMaps = [];
    
        for (let i = 0; i < this.snapshots; i++) {
                let grid = this.generateRandomGrid();
                grid = this.applyHotspotDistribution(grid);
                heatMaps.push(grid);
        }
    
        return heatMaps;
    }
  
    // run method implementation here
    run() {
        let heatMaps = this.generateHeatMap();
        this.drawHeatMap(heatMaps[0]);

        let currentSnapshot = 0;
        const interval = setInterval(() => {
            this.drawHeatMap(heatMaps[currentSnapshot]);

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
const hotspotDistribution = {
    hotspotThreshold: 0.95,
    warmThreshold: 0.8,
    coolThreshold: 0.4
};

const heatmapRandom1 = new HeatmapRandomWeighted("heatmapCanvas", length, width, cellSize, snapshots, hotspotDistribution);
//heatmapRandom1.run();

const heatmapRandom2 = new HeatmapRandomWeightedWithConstraints("heatmapCanvas", length, width, cellSize, snapshots, hotspotDistribution);
//heatmapRandom2.run();
*/
