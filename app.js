const cells_class = initializeBoard(board, 8);
const cells_div_node = document.querySelectorAll('.cell');
const cells_div = Array.from(cells_div_node);
const query = window.location.search;
const queryParams = getQueryParams(query)
const isSingleplayer = queryParams.mode === 'singleplayer';
let player = queryParams.player;

const boardPreArray = new Array(64).fill('');


document.addEventListener('DOMContentLoaded', (event) => {
    if(isSingleplayer && player==='player'){
        boardPrePopulate(boardPreArray,'b');
    }else if(isSingleplayer && player==='bot'){
        boardPrePopulate(boardPreArray,'w');
    }else{
        boardPrePopulate(boardPreArray);
    }
    dialog.close();
});

cells_div.forEach((cell,index)=>{
    cell.addEventListener('click', async () => {
        if(player === 'player'){
        if(!ispaused){
        swap.removeEventListener('click',swapRicochetHandler);
        if (cells_class[index].occupied === false) {
            left.classList.add('hidden');
            right.classList.add('hidden');
                swap.classList.add('hidden');
            if(memory!==null){
                if(validCellsArray.some(item => item[0] === Number(cells_div[index].dataset.row) && item[1] === Number(cells_div[index].dataset.column))){
                    cells_class[memory].removePiece();
                    cells_class[index].setPiece(htmlMemory);
                    filledcells = filledcells.filter(el=>el!==memory);
                    filledcells.push(index);
                    printMove(memory,index,'move',isBlackTurn);
                    memory=null;
                    htmlMemory = null;  
                    memoryReplace = null;
                    memoryRicochet = null; 
                    resetBgc(); 
                    await shoot(isBlackTurn,'1');
                    isBlackTurn=!isBlackTurn;
                    if(isSingleplayer){
                        botTurn(isBlackTurn);
                        await shoot(isBlackTurn);
                        isBlackTurn = !isBlackTurn;
                    }
                    //board.classList.toggle('rotate');
                    // filledcells.forEach(index=>{
                    // if(cells_div[index].firstChild.classList[0] === 'titan'  || cells_div[index].firstChild.classList[0] === 'tank'){
                    //     cells_div[index].classList.toggle('rotate');
                    // }
                    // })      
                }else{
                    memory = null;
                    htmlMemory = null;
                    memoryReplace = null;
                    memoryRicochet = null;
                    resetBgc();
                }
            }
        } else {
            if((isBlackTurn && cells_class[index].team === 'b') || (!isBlackTurn && cells_class[index].team === 'w')){
                resetBgc();
                validCellsArray = validcells(cells_class[index]);
                colorValidCells(validCellsArray);
                memory = index;
                cells_class[index].setBgc('#c3d6e5');
                htmlMemory = cells_class[index].piecediv;
                
                if(cells_class[memory].piece.includes('ricochet')){
                    filledcells.forEach(index=>{
                        if(!cells_class[index].piece.includes('titan')){
                            cells_class[index].setBgc('#cde5d4');
                        }
                    })
                    memoryRicochet = memory;
                }
                else if(memoryRicochet || memoryRicochet===0){
                    console.log("holla")
                    if(!cells_class[index].piece.includes('titan')){
                        swap.classList.remove('hidden');
                        left.classList.add('hidden');
                        right.classList.add('hidden');
                        memoryReplace = index;
                        cells_class[memoryReplace].setBgc('#c3d6e5');
                        swap.addEventListener('click',swapRicochetHandler, { once: true });
                    }else{
                        left.classList.add('hidden');
                        right.classList.add('hidden');
                        swap.classList.add('hidden');
                        memoryReplace = null;
                        memoryRicochet = null;
                        resetBgc();
                    }
                    left.removeEventListener('click', rotateLeftHandler);
                    right.removeEventListener('click', rotateRightHandler);
                }


                if (cells_class[memory].piece.includes('ricochet') || cells_class[memory].piece.includes('semi')) {
                    left.classList.remove('hidden');
                    right.classList.remove('hidden');
                    left.addEventListener('click', rotateLeftHandler,{ once: true });
                    right.addEventListener('click', rotateRightHandler,{ once: true });
                }

            }
            else if((memoryRicochet || memoryRicochet===0) && ((!isBlackTurn && cells_class[index].team === 'b') || (isBlackTurn && cells_class[index].team === 'w'))){
                resetBgc();
                if(!cells_class[index].piece.includes('titan')){
                    left.classList.add('hidden');
                    right.classList.add('hidden');
                    swap.classList.remove('hidden');
                    memoryReplace = index;
                    cells_class[memoryReplace].setBgc('#c3d6e5');
                    swap.addEventListener('click',swapRicochetHandler, { once: true });
                }else{
                    left.classList.add('hidden');
                    right.classList.add('hidden');
                    swap.classList.add('hidden');
                    memoryReplace = null;
                    memoryRicochet = null;
                    resetBgc();
                }
                left.removeEventListener('click', rotateLeftHandler);
                right.removeEventListener('click', rotateRightHandler);
            }
        }
    }
    }
    });
})

pause_resume.addEventListener('click',async ()=>{
    if(!ispaused){
        pause_resume.innerHTML = "<img src='play.svg'>";
        pauseTimer();
    }else{
        pause_resume.innerHTML = "<img src='pause.svg'>";
        if(isShooting){
            pause_resume.innerHTML = "<img src='play.svg'>";
        }
        if (player === 'bot') {
            botTurn(isBlackTurn);
            await shoot(isBlackTurn);
            isBlackTurn = !isBlackTurn;
            player = 'player';
        }
        startTimer( );
    }
    ispaused = !ispaused;
})

reset.addEventListener('click',()=>{
    if(intervalId){
        clearInterval(intervalId);
    }
    dialog.close();
    resetComplete();
})

undo.addEventListener('click',undoFunction);
redo.addEventListener('click',redoFunction);
replaybtn.addEventListener('click',async ()=>{
    dialog.close();
    await replay();
});

listSet.addEventListener('click',(e)=>{
    const clickedItem = e.target;
    const items = Array.from(listSet.children);
    const index = items.indexOf(clickedItem);
    movesMemory[currentMove].forEach(cell => {
        cells_class[cell.index].removePiece();
    });
    movesMemory[index + 1].forEach(cell => {
        const newPieceDiv = cell.piecediv;
        newPieceDiv.style.transform = cell.rotation;
        cells_class[cell.index].setPiece(newPieceDiv);
    });
    currentMove = index+1;
    if(!ispaused){
        ispaused = !ispaused;
    }
    pause_resume.innerHTML = "<img src='play.svg'>";
    pauseTimer();
    if(currentMove === movesMemory.length - 1)
        pause_resume.classList.remove('hidden');
    else
    pause_resume.classList.add('hidden');
})



















