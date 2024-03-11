const DOMINO_WIDTH = 50;
const DOMINO_HEIGHT = 100;
const SPACING = 6;

function findAllBoards(w, h) {
    if (w % 2 == 1 && h % 2 == 1) {
        return [];
    }

    let dp = Array.from({ length:w }, () => (
        Array.from({ length:h }, ()=> (
            Array.from({ length: Math.pow(2,h)}, () => 0)
            )
     )));
    dp[0][0][0] = 1;
    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            for (let p = 0; p < Math.pow(2, h); ++p) {
                if (p && (1 << j) == 1) {
                    let r = p - (1 << j);
                    console.log(`1. ${w} ${h} ${r}`);
                    dp[i][j][r] += dp[i][j][p];
                } else {
                    let r = p + (1<<j);
                    console.log(`2. ${w} ${h} ${r}`);
                    dp[i][j][r] += dp[i][j][p];
                    if (j < h-1 && (p&(1<<(j+1)))) {
                        r = p + (1<<(j+1));
                        console.log(`3. ${w} ${h} ${r}`);
                        dp[i][j][r] += dp[i][j][p];
                    }
                }
            }
        }
    }
    
    console.log(dp);

    return [];
}

// 1 - Down, 2 - Up, 3 - Left, 4 - Right
// position of complementory piece
function drawDominoes(dominoes, itemId) {
    // check if valid
    for (let i = 0; i < dominoes.length-1; ++i) {
        for (let j = 0; j < dominoes[0].length-1; ++j) {
            if (dominoes[i][j] == 1 && dominoes[i+1][j] != 2 
                || dominoes[i][j] == 3 && dominoes[i][j+1] != 4) {
                    ctx.font = "30px Arial";
                    ctx.fillText("Erro1", 10, 50);
                throw new Error('Not a valid tiling!');
            }
        }
    }

    const canvas = document.getElementById(itemId);
    const ctx = canvas.getContext('2d');

    const rows = dominoes[0].length;
    const cols = dominoes.length;

    canvas.width = cols * (DOMINO_WIDTH)+SPACING/2;
    canvas.height = rows * (DOMINO_HEIGHT/2)+SPACING/2;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (dominoes[i][j] == 1) {
                // draw down
                // const x = Math.max(SPACING, j * (DOMINO_WIDTH + SPACING));
                // const y = Math.max(SPACING, i * (DOMINO_HEIGHT/2 + SPACING));
                const x = j * (DOMINO_WIDTH);
                const y = i * (DOMINO_HEIGHT/2);
                
                // ctx.fillStyle = (i + j) % 2 === 0 ? '#ccc' : '#999';
                ctx.fillStyle = '#999';
                ctx.fillRect(x+SPACING/2, y+SPACING/2, DOMINO_WIDTH-SPACING/2, DOMINO_HEIGHT-SPACING/2);
                
                ctx.beginPath();
                ctx.moveTo(x+SPACING/2, y+(DOMINO_HEIGHT/2)+SPACING/2);
                ctx.lineTo(x+DOMINO_WIDTH, y+(DOMINO_HEIGHT/2)+SPACING/2);
                ctx.stroke();
            } else if (dominoes[i][j] == 3) {
                // draw right
                // const x = Math.max(SPACING, j * (DOMINO_WIDTH + SPACING));
                // const y = Math.max(SPACING, i * (DOMINO_HEIGHT/2 + SPACING));
                const x = j * (DOMINO_WIDTH);
                const y = i * (DOMINO_HEIGHT/2);
                
                ctx.fillStyle = '#ccB';
                ctx.fillRect(x+SPACING/2, y+SPACING/2, DOMINO_HEIGHT-SPACING/2, DOMINO_WIDTH-SPACING/2);
                
                ctx.beginPath();
                ctx.moveTo(x+(DOMINO_WIDTH)+SPACING/2, y+SPACING/2);
                ctx.lineTo(x+(DOMINO_WIDTH)+SPACING/2, y+DOMINO_HEIGHT/2);
                ctx.stroke();
            } else if (dominoes[i][j] == 2 || dominoes[i][j] == 4) {
                continue;
            }
        }
    }
}

const board = [
    [1, 3, 4, 1],
    [2, 1, 1, 2],
    [1, 2, 2, 1],
    [2, 3, 4, 2],
] 

drawDominoes(board, 'dominoCanvas');
console.log(findAllBoards(4,4));
