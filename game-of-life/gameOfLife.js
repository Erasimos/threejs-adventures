
export class GameOfLife {
    constructor(gridSize, cells) {
        this.gridSize = gridSize;
        this.cells = cells;
    }

    countNeighbours(x, y){
        let count = 0;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;

                const nx = (x + dx + this.gridSize) % this.gridSize;
                const ny = (y + dy + this.gridSize) % this.gridSize;

                if (this.cells[nx][ny].alive) count++;
            }
        }
        return count;
    }

    computeNextState() {
        const nextState = [];

        for (let x = 0; x < this.gridSize; x++) {
            nextState[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                const neighbours = this.countNeighbours(x, y);
                const cell = this.cells[x][y];

                let alive;
                if (neighbours < 2) {
                    alive = false;
                } else if (neighbours > 3) {
                    alive = false;
                } else if (cell.alive && (neighbours === 2 || neighbours === 3)) {
                    alive = true;
                } else if (!cell.alive && neighbours === 3) {
                    alive = true;
                } else {
                    alive = false; 
                }

                nextState[x][y] = alive;
            }
        }

        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                this.cells[x][y].alive = nextState[x][y];
            }
        }
    }

    updateGridColors() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                const cell = this.cells[x][y];
                cell.mesh.material.color.set(cell.alive ? 0xffffff : 0x000000);
            }
        }
    }
}