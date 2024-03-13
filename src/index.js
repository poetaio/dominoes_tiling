const DOMINO_WIDTH = 50;
const SPACING = 6;

class Domino {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function findAllBoards(w, h) {
    if (w % 2 == 1 && h % 2 == 1) {
        return [];
    }

    let dp = Array.from({ length:w }, () => (
        Array.from({ length:h+1 }, ()=> (
            Array.from({ length: Math.pow(2,h)}, () => 0)
        )
     )));
     let solutions = Array.from({ length:w }, () => (
         Array.from({ length:h+1 }, ()=> (
             Array.from({ length: Math.pow(2,h)}, () => (Array.from({length: 0}, () => Array()))
      )))));
    dp[0][0][0] = 1;
    solutions[0][0][0] = Array.from({length:1}, () => Array());
    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            for (let p = 0; p < Math.pow(2, h); ++p) {
                if ((p & (1 << j)) > 0) {
                    let r = p - (1 << j);
                    dp[i][j+1][r] += dp[i][j][p];
                    solutions[i][j+1][r] = [...solutions[i][j+1][r], ...solutions[i][j][p]];  
                } else {
                    let r = p + (1<<j);
                    // add horizontal domino to the solution
                    solutions[i][j+1][r] = [...solutions[i][j+1][r], ...solutions[i][j][p].map(x => ([...x, new Domino(new Point(i,j), new Point(i+1, j))]))];   
                        dp[i][j+1][r] += dp[i][j][p];
                    if (j < h-1 && (p&(1<<(j+1)))==0) {
                        r = p + (1<<(j+1));
                        // add vertical domino to the solution
                        solutions[i][j+1][r] = [...solutions[i][j+1][r], ...solutions[i][j][p].map(x =>( [...x, new Domino(new Point(i,j), new Point(i, j+1))]))];
                        dp[i][j+1][r] += dp[i][j][p];
                    }
                }
            }
        }
        if (i < w-1) {
            for (let p = 0; p < Math.pow(2,h);++p) {
                dp[i+1][0][p] = dp[i][h][p];
                solutions[i+1][0][p] = solutions[i][h][p];
            }
        }
    }

    return solutions;
}

function initCanvas(itemId, cols, rows) {
    const canvas = document.getElementById(itemId);
    const ctx = canvas.getContext('2d');

    canvas.width = cols * (DOMINO_WIDTH+SPACING);
    canvas.height = rows * (DOMINO_WIDTH+SPACING);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return ctx;
}

// 1 - Down, 2 - Up, 3 - Left, 4 - Right
// position of complementory piece
// function drawDominoes(board, itemId) {
    // check if valid
    // for (let i = 0; i < board.length-1; ++i) {
    //     for (let j = 0; j < board[0].length-1; ++j) {
    //         if (board[i][j] == 1 && board[i+1][j] != 2 
    //             || board[i][j] == 3 && board[i][j+1] != 4) {
    //                 ctx.font = "30px Arial";
    //                 ctx.fillText("Erro1", 10, 50);
    //             throw new Error('Not a valid tiling!');
    //         }
    //     }
    // }

    // const rows = board[0].length;
    // const cols = board.length;

    // const ctx = initCanvas(itemId, board[0].length, board.length);

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         if (board[i][j] == 1) {
    //             // draw down
    //             // const x = Math.max(SPACING, j * (DOMINO_WIDTH + SPACING));
    //             // const y = Math.max(SPACING, i * (DOMINO_WIDTH + SPACING));
    //             const x = j * (DOMINO_WIDTH);
    //             const y = i * (DOMINO_WIDTH);
                
    //             // ctx.fillStyle = (i + j) % 2 === 0 ? '#ccc' : '#999';
    //             ctx.fillStyle = '#999';
    //             ctx.fillRect(x+SPACING/2, y+SPACING/2, DOMINO_WIDTH, DOMINO_WIDTH*2);
                
    //             ctx.beginPath();
    //             ctx.moveTo(x+SPACING/2, y+(DOMINO_WIDTH)+SPACING/2);
    //             ctx.lineTo(x+DOMINO_WIDTH, y+(DOMINO_WIDTH)+SPACING/2);
    //             ctx.stroke();
    //         } else if (board[i][j] == 3) {
    //             // draw right
    //             // const x = Math.max(SPACING, j * (DOMINO_WIDTH + SPACING));
    //             // const y = Math.max(SPACING, i * (DOMINO_WIDTH + SPACING));
    //             const x = j * (DOMINO_WIDTH);
    //             const y = i * (DOMINO_WIDTH);
                
    //             ctx.fillStyle = '#ccB';
    //             ctx.fillRect(x+SPACING/2, y+SPACING/2, DOMINO_WIDTH*2, DOMINO_WIDTH);
                
    //             ctx.beginPath();
    //             ctx.moveTo(x+(DOMINO_WIDTH)+SPACING/2, y+SPACING/2);
    //             ctx.lineTo(x+(DOMINO_WIDTH)+SPACING/2, y+DOMINO_WIDTH);
    //             ctx.stroke();
    //         } else if (board[i][j] == 2 || board[i][j] == 4) {
    //             continue;
    //         }
    //     }
    // }
// }

function drawDominoesSet(w, h, dominoesSet, canvasId) {
    // todo: add validation
    
    const ctx = initCanvas(canvasId, w, h);

    for (let i = 0; i < dominoesSet.length; ++i) {
        const domino = dominoesSet[i];
        if (domino.x.x == domino.y.x) {
            // draw a horizontal domino
            // draw a vertical domino
            const x = domino.x.x * (DOMINO_WIDTH + SPACING) + SPACING/2;
            const y = domino.x.y * (DOMINO_WIDTH + SPACING) + SPACING/2;
            
            ctx.fillStyle = '#999';
            ctx.fillRect(x, y, DOMINO_WIDTH, DOMINO_WIDTH*2+SPACING);
            
            ctx.beginPath();
            ctx.moveTo(x, y+(DOMINO_WIDTH)+SPACING/2);
            ctx.lineTo(x+DOMINO_WIDTH, y+(DOMINO_WIDTH)+SPACING/2);
            ctx.stroke();

            console.group()
            console.log(x, y, DOMINO_WIDTH, DOMINO_WIDTH*2+SPACING);
            console.log(x, y+(DOMINO_WIDTH), x+DOMINO_WIDTH, y+(DOMINO_WIDTH))
            console.groupEnd();
        } else {
            const x = domino.x.x * (DOMINO_WIDTH + SPACING) + SPACING/2;
            const y = domino.x.y * (DOMINO_WIDTH + SPACING) + SPACING/2;
                
            ctx.fillStyle = '#ccB';
            ctx.fillRect(x, y, DOMINO_WIDTH*2+SPACING, DOMINO_WIDTH);
            
            ctx.beginPath();
            ctx.moveTo(x+(DOMINO_WIDTH)+SPACING/2, y);
            ctx.lineTo(x+(DOMINO_WIDTH)+SPACING/2, y+DOMINO_WIDTH);
            ctx.stroke();
        }
    }
}

function renderSolutions(pageNum, itemsPerPage, rows, cols, solutions, canvasListClass) {
    pageNum--;
    for (let i = pageNum*itemsPerPage; i < solutions.length && i < itemsPerPage; ++i) {
        const canvasList = document.querySelector(`.${canvasListClass}`);
        console.log(canvasList);
        const newLi = document.createElement('li');
        newLi.classList.add('canvas_list__item');
        const canvas = document.createElement('canvas');
        canvas.classList.add('canvas_list__item_canvas');
        canvas.id = `canvas_list__item_canvas_${i}`
        newLi.appendChild(canvas);
        canvasList.appendChild(newLi);

        drawDominoesSet(cols, rows, solutions[i], canvas.id);
    }
}

const board = [
    [1, 3, 4, 1],
    [2, 1, 1, 2],
    [1, 2, 2, 1],
    [2, 3, 4, 2],
] 

// drawDominoes(board, 'dominoCanvas');
const rows = 6;
const cols = 6;
const solutions = findAllBoards(rows, cols);
console.log('solutio0n 0: ');
console.log(solutions[cols-1][rows][0]);
const finalSolutions = solutions[cols-1][rows][0];

// drawDominoesSet(rows, cols, finalSolutions[155], 'dominoCanvas')
renderSolutions(1, 100, rows, cols, finalSolutions, 'canvas_list');
