function getQueryParams(url) {
    const queryParams = {};

    const queryString = url.substring(url.indexOf('?') + 1);

    const pairs = queryString.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        queryParams[key] = decodeURIComponent(value || '');
    });
    return queryParams;
}

function initializeBoard(boardElement, size) {
    let id_num = 0;
    const cells = [];
    const colors = ["#ccc", "#ddd"]; 
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cellElement = document.createElement('div');
            cellElement.id = `index--${i}-${j}`;
            const colorIndex = (i + j) % 2;
            boardElement.appendChild(cellElement);
            const cell = new Cell(cellElement, i, j,id_num++);
            cell.setBgc(`${colors[colorIndex]}`)
            cells.push(cell);
        }
    }
    return cells;
}

function shuffle(array){
    for(let i=0;i<array.length;i++){
        const j = Math.floor(Math.random()*(array.length));
        let temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
}

function randomise(mainArray){
    const blackArray = [0,2,4,6,9,11,13];
    const whiteArray = [63,61,59,57,54,52,50];
    const whitePieces = [titan_w,cannon_w,ricochet_w_1,ricochet_w_2,semi_w_1,semi_w_2,tank_w];
    const blackPieces = [titan_b,cannon_b,ricochet_b_1,ricochet_b_2,semi_b_1,semi_b_2,tank_b];
    shuffle(whitePieces);
    shuffle(blackPieces);
    let i;
    for(i=0;i<7;i++){
        mainArray[whiteArray[i]]=whitePieces[i];
        mainArray[blackArray[i]]=blackPieces[i];
    }
}

function boardPrePopulate(array,team){
    randomise(array);
    let movesarray = [];
    for(i=0;i<64;i++){
        if(array[i]){
            cells_class[i].setPiece(array[i]); 
            filledcells.push(i);
            movesarray.push({index:i,piecediv:cells_class[i].piecediv,rotation:cells_class[i].piecediv.style.transform});
            if(team !== null && cells_class[i].team === team){
                filledBotcells.push(i);
            }
        }
    }
    movesMemory.push(movesarray)
}

const validcells = function(object){

    let a = object.row;
    let b = object.column;
    let array = [];

    if(object.piece && object.piece.includes('cannon')){
        array = [
            [a,b-1],
            [a,b+1]
        ]
    }else if(object.piece && object.piece.includes('bullet')){
        array = [
        ];
    } else{
        array = [
            [a-1,b-1],
            [a-1,b],
            [a-1,b+1],
            [a,b-1],
            [a,b+1],
            [a+1,b-1],
            [a+1,b],
            [a+1,b+1]
        ];
    }  

    const moves = array.filter((el)=>
        el[0]>=0 && el[0]<=7 && el[1]>=0 && el[1]<=7 && !filledcells.includes(el[0]*8 + el[1])
   )

    return moves;
}

const colorValidCells = function(moves){
    moves.forEach(move=>{      
        const lmao = cells_class[cells_div.findIndex(div=>div.dataset.row===move[0].toString() && div.dataset.column===move[1].toString())];
        lmao.setBgc("#e6e6fa");
    })
}

const resetBgc = function(){
    const colors = ["#ccc", "#ddd"]; 

    cells_class.forEach(cell => {
        const colorIndex = (cell.row + cell.column) % 2; 
        cell.setBgc(`${colors[colorIndex]}`); 
    });
    (memoryRicochet|| memoryRicochet===0) && cells_class[memoryRicochet].setBgc('#c3d6e5')
}

const animateBullet = (bullet, path, reverse) => {
   
    bullet.classList.remove('move-up', 'move-left','move-down', 'move-right','move-up-right','move-up-left','move-down-right','move-down-left');
    bullet.style.animationDirection = null;

    
    if (path === 'up') {
        bullet.classList.add(`move-up`);
    }else if (path === 'down') {
        bullet.classList.add(`move-down`);
    }else if (path === 'left') {
        bullet.classList.add(`move-left`);
    }else if (path === 'right') {
        bullet.classList.add(`move-right`);
    }else if (path === 'up-right') {
        bullet.classList.add(`move-up-right`);
    } else if (path === 'up-left') {
        bullet.classList.add(`move-up-left`);
    }else if (path === 'down-right') {
        bullet.classList.add(`move-down-right`);
    }
    else if (path === 'down-left') {
        bullet.classList.add(`move-down-left`);
    }
    if(reverse){
        bullet.style.animationDirection = 'reverse';
    }
};

const shoot = async function(blackTurn, spell=null,index=0) {
    left.classList.add('hidden');
    right.classList.add('hidden');
    swap.classList.add('hidden');
    let movesarray = [];
    cells_class.forEach((cell, index) => {
        if (cell.piece) {
            movesarray.push({ index: index, piecediv: cell.piecediv,rotation:cell.piecediv.style.transform });
        }
    });
    console.log(movesarray);
    isShooting = !isShooting;
    if (blackTurn) {
        timer2 = 300;
        if(index===0){
            const indexOfCannon = cells_class.findIndex(cell => cell.piece === "cannon_b");
            addCoins(blackTurn, 10);
            if (indexOfCannon !== -1) {
                await moveBullet(indexOfCannon, blackTurn, spell);
            } 
        }else{
            await moveBullet(index, blackTurn, spell);
        }
    } else {
        if(index===0){
            const indexOfCannon = cells_class.findIndex(cell => cell.piece === "cannon_w");
            addCoins(blackTurn, 10);
            if (indexOfCannon !== -1) {
                await moveBullet(indexOfCannon, blackTurn, spell);
            } 
        }else{
            await moveBullet(index, blackTurn, spell);
        }
    }
    if(!isreplay){
        movesMemory.push(movesarray);
        isShooting = !isShooting;
    }
    currentMove = currentMove + 1;
};


const moveBullet = async function(index,blackTurn,spell){
        let path;
        if (cells_class[index].piece.includes('_b')) {
            path = "down";
            ispaused = !ispaused;
            await controlBullet(index, path, blackTurn,spell,bullet_b);
        } else if (cells_class[index].piece.includes('_w')) {
            path = "up";
            ispaused = !ispaused;
            await controlBullet(index, path, blackTurn,spell,bullet_w);
        }
}   

const controlBullet = function(index, path, blackTurn, spell,bullet) {
    return new Promise((resolve) => {

        intervalId = setInterval(() => {
            const nextIndex = setIndex(index, path);

            if (path === "down" && cells_class[index].row === 7) {
                clearInterval(intervalId);
                ispaused = !ispaused;
                cells_class[index].removeBullet();
                resolve();
                return;
            } else if (path === "up" && cells_class[index].row === 0) {
                clearInterval(intervalId);
                ispaused = !ispaused;
                cells_class[index].removeBullet();
                resolve(); 
                return;
            } else if (path === "right" && cells_class[index].column === 7) {
                clearInterval(intervalId);
                ispaused = !ispaused;
                cells_class[index].removeBullet();
                resolve(); 
                return;
            } else if (path === "left" && cells_class[index].column === 0) {
                clearInterval(intervalId);
                ispaused = !ispaused;
                cells_class[index].removeBullet();  
                resolve(); 
                return;
            }

            if (!cells_class[nextIndex].occupied) {
                animateBullet(bullet,path,false);
                cells_class[nextIndex].setBullet(blackTurn);
                index = nextIndex;
            } else {
                if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('titan')) {
                    if (cells_class[nextIndex].piece === 'titan_b') {
                        //alert('white won');
                        console.log('hi')
                    } else {
                        //alert('black won');
                        console.log('hi')
                    }
                    clearInterval(intervalId);
                    ispaused = true;
                    //body.classList.add('blur');
                    dialog.showModal();
                    dialog.style.display = "flex";
                    resolve(); // Resolve the Promise
                } else if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('tank')) {
                    const tankHit = cells_class[nextIndex].piecediv;
                    if (blackTurn && cells_class[nextIndex].team === 'b' || !blackTurn && cells_class[nextIndex].team === 'w') {
                        index = nextIndex;
                        animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 300);
                    } else {
                        modifyHealth(nextIndex, tankHit);
                        clearInterval(intervalId);
                        animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                        ispaused = !ispaused;
                        addCoins(blackTurn, 50);
                        resolve(); // Resolve the Promise
                    }
                } else if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('ricochet')) {
                    const ricochetHit = cells_class[nextIndex].piecediv;
                    if (ricochetHit.style.transform === 'rotate(0deg)' || ricochetHit.style.transform === 'rotate(180deg)') {
                        if (path === "up") {
                            index = nextIndex;
                            path = "right";
                            animateBullet(bullet,'up-right',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "down") {
                            index = nextIndex;
                            path = "left";
                            animateBullet(bullet,'down-left',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "left") {
                            index = nextIndex;
                            path = "down";
                            animateBullet(bullet,'up-right',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "right") {
                            index = nextIndex;
                            path = "up";
                            animateBullet(bullet,'down-left',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        }
                    } else if (ricochetHit.style.transform === 'rotate(90deg)' || ricochetHit.style.transform === 'rotate(270deg)') {
                        if (path === "up") {
                            index = nextIndex;
                            path = "left";
                            animateBullet(bullet,'up-left',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "down") {
                            index = nextIndex;
                            path = "right";
                            animateBullet(bullet,'down-right',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "left") {
                            index = nextIndex;
                            path = "up";
                            animateBullet(bullet,'down-right',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "right") {
                            index = nextIndex;
                            path = "down";
                            animateBullet(bullet,'up-left',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        }
                    }
                } else if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('semi')) {
                    const semiricochetHit = cells_class[nextIndex].piecediv;
                    if (semiricochetHit.style.transform === 'rotate(0deg)') {
                        if (path === "down") {
                            index = nextIndex;
                            path = "right";
                            animateBullet(bullet,'down-right',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "left") {
                            index = nextIndex;
                            path = "up";
                            animateBullet(bullet,'down-right',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else {
                            clearInterval(intervalId);
                            ispaused = !ispaused;
                            animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); // Resolve the Promise
                        }
                    } else if (semiricochetHit.style.transform === 'rotate(90deg)') {
                        if (path === "up") {
                            index = nextIndex;
                            path = "right";
                            animateBullet(bullet,'up-right',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "left") {
                            index = nextIndex;
                            path = "down";
                            animateBullet(bullet,'up-right',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else {
                            clearInterval(intervalId);
                            ispaused = !ispaused;
                            animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); // Resolve the Promise
                        }
                    } else if (semiricochetHit.style.transform === 'rotate(180deg)') {
                        if (path === "up") {
                            index = nextIndex;
                            path = "left";
                            animateBullet(bullet,'up-left',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "right") {
                            index = nextIndex;
                            path = "down";
                            animateBullet(bullet,'up-left',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else {
                            clearInterval(intervalId);
                            ispaused = !ispaused;
                            animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); // Resolve the Promise
                        }
                    } else if (semiricochetHit.style.transform === 'rotate(270deg)') {
                        if (path === "down") {
                            index = nextIndex;
                            path = "left";
                            animateBullet(bullet,'down-left',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "right") {
                            index = nextIndex;
                            path = "up";
                            animateBullet(bullet,'down-left',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else {
                            clearInterval(intervalId);
                            ispaused = !ispaused;
                            animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); // Resolve the Promise
                        }
                    }
                } else if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('cannon')) {
                    const cannonHit = cells_class[nextIndex].piecediv;
                    animateBullet(bullet,path,false);
                    cells_class[nextIndex].setBullet(blackTurn, path);
                    timeoutId = setTimeout(() => {
                        cells_class[nextIndex].removeBullet();
                    }, 150);
                    modifyHealth(nextIndex, cannonHit);
                    clearInterval(intervalId);
                    ispaused = !ispaused;
                    resolve(); // Resolve the Promise
                }
            }
        }, 300);
    });
};


const setIndex = function(index,path){
    if(path === "down")
        return index+8;
    else if(path === "left")
        return index-1;
    else if(path === "right")
        return index+1;
    else
        return index-8;
}

const modifyHealth= function(index,div){
    if(div.dataset.health>=1)
        div.dataset.health--;
    else{
        cells_class[index].removePiece();
        filledcells = filledcells.filter(el=>el!==index);
        filledBotcells = filledBotcells.filter(el=>el!==index);
    }
}

const rotateLeftLogic = function(clicked){
    return new Promise((resolve) => {
        let transform = clicked.style.transform;

        if (transform === 'rotate(0deg)') {
            clicked.style.transform = 'rotate(90deg)';
        } else if (transform === 'rotate(90deg)') {
            clicked.style.transform = 'rotate(180deg)';
        } else if (transform === 'rotate(180deg)') {
            clicked.style.transform = 'rotate(270deg)';
        } else {
            clicked.style.transform = 'rotate(0deg)';
        }

        setTimeout(() => {
            resolve();
        }, 100);
    });
}

    const rotateLeft = async (cell,blackTurn) => {
        const clicked = cell.piecediv;
        await rotateLeftLogic(clicked);
        printMove(memory,memory,'left',blackTurn);

        memory = null;
        htmlMemory = null;
        memoryReplace = null;
        memoryRicochet = null;
        resetBgc();
        await shoot(isBlackTurn);
        isBlackTurn = !isBlackTurn; // Toggle the turn
        if(isSingleplayer){
            botTurn(isBlackTurn);
            await shoot(isBlackTurn);
            isBlackTurn = !isBlackTurn;
        }
        // board.classList.toggle('rotate');
        // filledcells.forEach(index=>{
        //     if(cells_div[index].firstChild.classList[0] === 'titan'  || cells_div[index].firstChild.classList[0] === 'tank'){
        //         cells_div[index].classList.toggle('rotate');
        //     }
        //     })
        left.removeEventListener('click', rotateLeftHandler);
        right.removeEventListener('click', rotateRightHandler);
    };

const rotateRightLogic = function(clicked){
    return new Promise((resolve) => {
        let transform = clicked.style.transform;

    if (transform === 'rotate(0deg)') {
        clicked.style.transform = 'rotate(90deg)';
    } else if (transform === 'rotate(90deg)') {
        clicked.style.transform = 'rotate(180deg)';
    } else if (transform === 'rotate(180deg)') {
        clicked.style.transform = 'rotate(270deg)';
    } else {
        clicked.style.transform = 'rotate(0deg)';
    }

        setTimeout(() => {
            resolve();
        }, 100);
    });
}

const rotateRight = async (cell,blackTurn) => {
    const clicked = cell.piecediv;
    await rotateRightLogic(clicked);
    printMove(memory,memory,'right',blackTurn);

    memory = null;
    htmlMemory = null;
    memoryReplace = null;
    memoryRicochet = null;
    resetBgc();
    await shoot(isBlackTurn);
    isBlackTurn = !isBlackTurn; // Toggle the turn
    if(isSingleplayer){
        botTurn(isBlackTurn);
        await shoot(isBlackTurn);
        isBlackTurn = !isBlackTurn;
    }
    // board.classList.toggle('rotate');
    // filledcells.forEach(index=>{
    //     if(cells_div[index].firstChild.classList[0] === 'titan'  || cells_div[index].firstChild.classList[0] === 'tank'){
    //         cells_div[index].classList.toggle('rotate');
    //     }
    //     })
    left.removeEventListener('click', rotateLeftHandler);
    right.removeEventListener('click', rotateRightHandler);
};


const rotateLeftHandler = () => rotateLeft(cells_class[memory],isBlackTurn);
const rotateRightHandler = () => rotateRight(cells_class[memory],isBlackTurn);

const swapLogic = function(index,indexReplace){
    const ricochetPieceDiv = cells_class[index].piecediv;
    const otherPieceDiv = cells_class[indexReplace].piecediv;
    cells_class[index].setPiece(otherPieceDiv);
    cells_class[index].toggleOccupied();
    cells_class[indexReplace].setPiece(ricochetPieceDiv);
    cells_class[indexReplace].toggleOccupied();
}

const swapRicochet = async function(index,indexReplace,blackturn){
    swapLogic(index,indexReplace);
    printMove(index,indexReplace,'swap',blackturn);
    memory = null;
    htmlMemory = null;
    if(filledBotcells.includes(memoryReplace)){
        filledBotcells = filledBotcells.filter(el=>el!==memoryReplace);
        filledBotcells.push(memoryRicochet);
    }
    memoryReplace = null;
    memoryRicochet = null;
    resetBgc();
    await shoot(isBlackTurn);
    isBlackTurn=!isBlackTurn; 
    if(isSingleplayer){
        botTurn(isBlackTurn);
        await shoot(isBlackTurn);
        isBlackTurn = !isBlackTurn;
    } 
    // board.classList.toggle('rotate');
    // filledcells.forEach(index=>{
    // if(cells_div[index].firstChild.classList[0] === 'titan'  || cells_div[index].firstChild.classList[0] === 'tank'){
    //     cells_div[index].classList.toggle('rotate');
    // }
    // })
}

const swapRicochetHandler = () => swapRicochet(memoryRicochet,memoryReplace,isBlackTurn);

function resetComplete() {
    pauseTimer();
    timer1 = 300;
    timer2 = 300;
    updateTime();
    filledcells = [];
    filledBotcells=[];
    validCellsArray = [];
    memory = null;
    memoryRicochet = null;
    memoryReplace = null;
    htmlMemory = null;
    isBlackTurn = false;
    ispaused = true;
    player = queryParams.player;
    movesMemory.splice(0, movesMemory.length);
    currentMove = 0;
    listSet.innerHTML='';
    isShooting = false;
    cells_class.forEach(cell=>{
        cell.removePiece();
        cell.removeBullet();
    })
    pause_resume.innerText ="Start";
    if(isSingleplayer && player==='player'){
        boardPrePopulate(boardPreArray,'b');
    }else if(isSingleplayer && player==='bot'){
        boardPrePopulate(boardPreArray,'w');
    }else{
        boardPrePopulate(boardPreArray);
    }
    // board.classList.remove('rotate');
    // filledcells.forEach(index=>{
    // if(cells_div[index].firstChild.classList[0] === 'titan'  || cells_div[index].firstChild.classList[0] === 'tank'){
    //     cells_div[index].classList.remove('rotate');
    // }
    // })
}

const botTurn = function(blackTurn){
    let typeOfMove = 1;
    let botValidCells = [];
    let botIndex = null;
    let botIndex2 = null;
    while(botValidCells.length === 0){
    const randomIndex1 = Math.floor(Math.random() * filledBotcells.length);
    botIndex = filledBotcells[randomIndex1];
    botValidCells = validcells(cells_class[botIndex]);
    }
    botIndex2 = botIndex;
    console.log(botIndex)
    if(cells_class[botIndex].piece.includes('ricochet')){
        typeOfMove = Math.floor(Math.random() * 3)+1;
    }else if(cells_class[botIndex].piece.includes('semi')){
        typeOfMove = Math.floor(Math.random() * 2)+1;
    }
    if(typeOfMove === 1){
        const randomIndex2 = Math.floor(Math.random() * botValidCells.length);
        let botFinalCoordinates = botValidCells[randomIndex2];
        let botFinalIndex = botFinalCoordinates[0]*8 + botFinalCoordinates[1];
        let piece = cells_class[botIndex].piecediv;
        cells_class[botIndex].removePiece();
        cells_class[botFinalIndex].setPiece(piece);
        filledcells = filledcells.filter(el=>el!==botIndex);
        filledBotcells = filledBotcells.filter(el=>el!==botIndex);
        filledcells.push(botFinalIndex);
        filledBotcells.push(botFinalIndex);
        printMove(botIndex,botFinalIndex,'move',blackTurn);
    }else if(typeOfMove === 2){
        let pieceDiv = cells_class[botIndex].piecediv;
        const randomIndex2 = Math.floor(Math.random() * 2);
        if(randomIndex2===0){
            rotateLeftLogic(pieceDiv);
            printMove(botIndex,botIndex,'left',blackTurn);
        }else{
            rotateRightLogic(pieceDiv);
            printMove(botIndex,botIndex,'right',blackTurn);
        }
     }else{
        while (botIndex2 === botIndex || (cells_class[botIndex2].piece && cells_class[botIndex2].piece.includes('titan'))) {
            const randomIndex3 = Math.floor(Math.random() * filledcells.length);
            botIndex2 = filledcells[randomIndex3];
        }
        let piece1 = cells_class[botIndex].piecediv;
        let piece2 = cells_class[botIndex2].piecediv;
        cells_class[botIndex].removePiece();
        cells_class[botIndex2].removePiece();
        cells_class[botIndex].setPiece(piece2);
        cells_class[botIndex2].setPiece(piece1);
        if(!filledBotcells.includes(botIndex2)){
            filledBotcells = filledBotcells.filter(el=>el!==botIndex);
            filledBotcells.push(botIndex2);
        }
        printMove(botIndex,botIndex2,'swap',blackTurn);
     }
    
}

const addCoins = function(turn,x){
    if(turn){
        cash2.innerText = String(Number(cash2.innerText)+x);
    }else{
        cash1.innerText = String(Number(cash1.innerText)+x);
    }
}

const undoFunction = function(){
    if(!isShooting){
    if(currentMove>0){
    if(!ispaused){
        ispaused = !ispaused;
    }
    pause_resume.classList.add('hidden');
    pause_resume.innerHTML = "<img src='play.svg'>";
    pauseTimer();
    movesMemory[currentMove].forEach(cell=>{
        cells_class[cell.index].removePiece();
    })
    movesMemory[currentMove-1].forEach(cell=>{
        newPieceDiv = cell.piecediv;
        newPieceDiv.style.transform = cell.rotation;
        cells_class[cell.index].setPiece(newPieceDiv);
    })
    currentMove = currentMove-1;
}
    }
}

const redoFunction = async function() {
    let cannon = null;
    if (currentMove < movesMemory.length - 1) {

        movesMemory[currentMove].forEach(cell => {
            cells_class[cell.index].removePiece();
        });
        
        movesMemory[currentMove + 1].forEach(cell => {
            const newPieceDiv = cell.piecediv;
            newPieceDiv.style.transform = cell.rotation;
            cells_class[cell.index].setPiece(newPieceDiv);
            if ((currentMove % 2 !== 0 && cells_class[cell.index].piece === 'cannon_b') ||
                (currentMove % 2 === 0 && cells_class[cell.index].piece === 'cannon_w')) {
                cannon = cell.index;
            }
        });
        
        if(currentMove === movesMemory.length - 2)
            pause_resume.classList.remove('hidden');

        if (isreplay) {
            await shoot(currentMove % 2 !== 0, null, cannon);
            console.log(currentMove)
        }else{
            currentMove = currentMove+1;
        }
    }
};


const replay = async function() {
    isreplay = true;
    ispaused = true;

    movesMemory[currentMove].forEach(cell => {
        cells_class[cell.index].removePiece();
    });

    movesMemory[0].forEach(cell => {
        newPieceDiv = cell.piecediv;
        newPieceDiv.style.transform = cell.rotation;
        cells_class[cell.index].setPiece(newPieceDiv);
    });

    currentMove = 0;

    const replayStep = async () => {
        if (currentMove < movesMemory.length - 1) {
            await redoFunction();
            setTimeout(replayStep, 1000); 
        } else {
            isreplay = false; 
            isShooting = false;
        }
    };


    setTimeout(replayStep, 1000);
};

const printMove = function(memory1,memory2,way,blackTurn){
    const list = document.createElement('li');
    if(way === 'move'){
        list.innerText = `${cells_class[memory2].piece.slice(0,-2).toUpperCase()} Moves From (${cells_class[memory1].row},${cells_class[memory1].column}) to (${cells_class[memory2].row},${cells_class[memory2].column})` ;
    }else if(way === 'right'){
        list.innerText = `${cells_class[memory2].piece.slice(0,-2).toUpperCase()} Rotates To The Right`;
    }else if(way === 'left'){
        list.innerText = `${cells_class[memory2].piece.slice(0,-2).toUpperCase()} Rotates To The Left`;
    }else{
        list.innerText = `${cells_class[memory2].piece.slice(0,-2).toUpperCase()} Swaps With ${cells_class[memory1].piece.slice(0,-2).toUpperCase()}`;
    }
    if(blackTurn){
        list.style.color = '#EEEEEE';
    }else{
        list.style.color = '#A9A9A9';
    }
    listSet.appendChild(list);
}
 













