const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

function make_cell_list() {
    let cells = [...document.getElementById("cell-holder").children];
    let cell_board = [];
    for (let i = 0; i < 25; i += 5) {
        cell_board.push(cells.slice(i, i + 5))
    }
    return cell_board;
}

function setup_game(starting_cells) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = starting_cells[y][x];
        }
    }
}

const CELLS = make_cell_list();
let selected_x = -1;
let selected_y = -1;
var cycle=0;

setup_game(boards[cycle].cells)
document.getElementById("words").innerHTML = "Words to spell: " + boards[cycle].words.join(", ")


function move(x, y) {
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = ""
    CELLS[selected_y][selected_x].classList.add("blank");
    select(x, y);
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;
}

function select(x, y) {
    if (CELLS[y][x].innerHTML.length > 0) {
        if (selected_x >= 0 && selected_y >= 0)
            CELLS[selected_y][selected_x].classList.remove("selected");
        CELLS[y][x].classList.add("selected");
        selected_y = y;
        selected_x = x;
    }
}

function is_close(a, b) {
    return Math.abs(a - b) <= 1
}

function can_move(x, y) {
    let can_move = is_close(selected_x, x) && selected_y == y || is_close(selected_y, y) && selected_x == x;

    return selected_x >= 0 && selected_y >= 0 && can_move && CELLS[y][x].innerHTML.length > 0
}
function cycleNum(){
    cycle=(cycle+1)%3;
    console.log(cycle);
    reset();
}
function reset(){
    setup_game(boards[cycle].cells)
    document.getElementById("words").innerHTML = "Words to spell: " + boards[cycle].words.join(", ")
    for( i in CELLS){
        for(k in CELLS[i]){
            CELLS[i][k].classList.remove("selected","blank")
        }
    }
    selected_x=-1;
    selected_y=-1;
}
function addCellState(i,k){
    if(CELLS[i][k].classList.contains("blank")){
        return;
    }
    CELLS[i][k].classList.add("animated");
}
function revokeCellState(i,k){
    CELLS[i][k].classList.remove("animated");
}
function randAnim(){
    requestAnimationFrame(randAnim);
    for( i in CELLS){
        for(k in CELLS[i]){
            if(!(CELLS[i][k].classList.contains("blank"))){
                setTimeout(revokeCellState,Math.random()*(1500-500)+500,i,k);
                addCellState(i,k);
            }else{
                addCellState(i,k);
            }
        }
    }
}
randAnim();
function on_click(x, y) {
    if (selected_x == x && selected_y == y) {
        unselect(x, y)
    }
    else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
}