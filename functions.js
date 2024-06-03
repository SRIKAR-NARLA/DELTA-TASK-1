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
        el[0]>=0 && el[0]<=7 && el[1]>=0 && el[1]<=7 && cells_class[el[0]*8 + el[1]].occupied===false
   )
   
    return moves;
}

const colorValidCells = function(moves){
    moves.forEach(move=>{      
        const cell = cells_class[cells_div.findIndex(div=>div.dataset.row===move[0].toString() && div.dataset.column===move[1].toString())];
        cell.setBgc("#e6e6fa");
        cell.setBorder();
    })
}

const resetBgc = function(){
    const colors = ["#ccc", "#ddd"]; 

    cells_class.forEach(cell => {
        const colorIndex = (cell.row + cell.column) % 2; 
        cell.setBgc(`${colors[colorIndex]}`); 
        cell.removeBorder();
        if(!cell.piece && cell.occupied){
            cell.setBgc(`pink`);
        }
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
    bulletaudio.play();
    left.classList.add('hidden');
    right.classList.add('hidden');
    swap.classList.add('hidden');
    let movesarray = [];
    cells_class.forEach((cell, index) => {
        if(!cell.piece && cell.piecediv){
            movesarray.push({ index: index, piecediv: cell.piecediv,rotation:cell.piecediv.style.transform,destroyed:false,invisible:true,health:null,whitecash:whiteCash,blackcash:blackCash,p1health:null,p2health:null });
        }else if (cell.piecediv) {
            if(cell.piece.includes('tank')){
                movesarray.push({ index: index, piecediv: cell.piecediv,rotation:cell.piecediv.style.transform,destroyed:false,invisible:false,health:cell.piecediv.dataset.health,whitecash:whiteCash,blackcash:blackCash,p1health:null,p2health:null });

            }else{
                movesarray.push({ index: index, piecediv: cell.piecediv,rotation:cell.piecediv.style.transform,destroyed:false,invisible:false,health:null,whitecash:whiteCash,blackcash:blackCash,p1health:null,p2health:null });
            }
        }else if(cell.occupied){
            movesarray.push({ index: index, piecediv: null,rotation:null,destroyed:false,invisible:false,health:null,whitecash:whiteCash,blackcash:blackCash,p1health:null,p2health:null});
        }
    });
    isShooting = !isShooting;
    if (blackTurn) {
        timer2 = 300;
        if(index===0){
            const indexOfCannon = cells_class.findIndex(cell => cell.piece === "cannon_b");
            !isreplay && addCoins(blackTurn, 10);
            if (indexOfCannon !== -1) {
                await moveBullet(indexOfCannon, blackTurn, spell);
            } 
        }else{
            await moveBullet(index, blackTurn, spell);
        }
    } else {
        if(index===0){
            const indexOfCannon = cells_class.findIndex(cell => cell.piece === "cannon_w");
            !isreplay && addCoins(blackTurn, 10);
            if (indexOfCannon !== -1) {
                await moveBullet(indexOfCannon, blackTurn, spell);
            } 
        }else{
            await moveBullet(index, blackTurn, spell);
        }
    }
    movesarray.forEach(obj=>{
        obj.whitecash=whiteCash;
        obj.blackcash=blackCash;
        obj.p1health = tank_w.dataset.health;
        obj.p2health = tank_b.dataset.health;
        if(cells_class[obj.index].occupied===false){
            obj.destroyed=true;
        }

    })
    if(!isreplay){
        movesMemory.push(movesarray);
        isShooting = !isShooting;
    }
    currentMove = currentMove + 1;
    if(!isreplay){
        bar1.value=tank_w.dataset.health;
        bar2.value=tank_b.dataset.health;
    }
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

            if (!cells_class[nextIndex].piece) {
                animateBullet(bullet,path,false);
                cells_class[nextIndex].setBullet(blackTurn);
                index = nextIndex;
            } else {
                if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('titan')) {
                    if (cells_class[nextIndex].piece === 'titan_b') {
                        gameoveraudio.play();
                        diatext.innerText = 'Titan is Hit, White wins';
                    } else {
                        gameover2audio.play();
                        diatext.innerText = 'Titan is Hit, Black wins';
                    }
                    clearInterval(intervalId);
                    animateBullet(bullet,path,false);
                    cells_class[nextIndex].setBullet(blackTurn, path);
                    timeoutId = setTimeout(() => {
                        cells_class[nextIndex].removeBullet();
                    }, 150);
                    cells_class[index].removeBullet();
                    ispaused = true;
                    const colors = ["#ccc", "#ddd"]; 
                    cells_class.forEach(cell=>{
                        const colorIndex = (cell.row + cell.column) % 2;
                        cell.setBgc(`${colors[colorIndex]}`);
                    })
                    dialog.showModal();
                    dialog.style.display = "flex";
                    resolve(); 
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
                        piecedesaudio.play();
                        cells_class[index].removeBullet();
                        ispaused = !ispaused;
                        !isreplay && addCoins(blackTurn, 50);
                        resolve(); 
                    }
                } else if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('ricochet')) {
                    const ricochetHit = cells_class[nextIndex].piecediv;
                    shootaudio.play();
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
                            shootaudio.play();
                            index = nextIndex;
                            path = "right";
                            animateBullet(bullet,'down-right',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "left") {
                            shootaudio.play();
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
                            piecedesaudio.play();
                            cells_class[index].removeBullet();
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); 
                        }
                    } else if (semiricochetHit.style.transform === 'rotate(90deg)') {
                        if (path === "up") {
                            shootaudio.play();
                            index = nextIndex;
                            path = "right";
                            animateBullet(bullet,'up-right',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "left") {
                            shootaudio.play();
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
                            piecedesaudio.play();
                            cells_class[index].removeBullet();
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); 
                        }
                    } else if (semiricochetHit.style.transform === 'rotate(180deg)') {
                        if (path === "up") {
                            shootaudio.play();
                            index = nextIndex;
                            path = "left";
                            animateBullet(bullet,'up-left',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "right") {
                            shootaudio.play();
                            index = nextIndex;
                            path = "down";
                            animateBullet(bullet,'up-left',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else {
                            clearInterval(intervalId);
                            ispaused = !ispaused;
                            piecedesaudio.play();
                            animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                            cells_class[index].removeBullet();
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); 
                        }
                    } else if (semiricochetHit.style.transform === 'rotate(270deg)') {
                        if (path === "down") {
                            shootaudio.play();
                            index = nextIndex;
                            path = "left";
                            animateBullet(bullet,'down-left',false);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else if (path === "right") {
                            shootaudio.play();
                            index = nextIndex;
                            path = "up";
                            animateBullet(bullet,'down-left',true);
                            cells_class[nextIndex].setBullet(blackTurn);
                        } else {
                            clearInterval(intervalId);
                            ispaused = !ispaused;
                            piecedesaudio.play();
                            animateBullet(bullet,path,false);
                            cells_class[nextIndex].setBullet(blackTurn, path);
                            timeoutId = setTimeout(() => {
                                cells_class[nextIndex].removeBullet();
                            }, 150);
                            cells_class[index].removeBullet();
                            cells_class[nextIndex].removePiece();
                            filledcells = filledcells.filter(el=>el!==nextIndex);
                            filledBotcells = filledBotcells.filter(el=>el!==nextIndex);
                            resolve(); 
                        }
                    }
                } else if (cells_class[nextIndex].piece && cells_class[nextIndex].piece.includes('cannon')) {
                    const cannonHit = cells_class[nextIndex].piecediv;
                    animateBullet(bullet,path,false);
                    cells_class[nextIndex].setBullet(blackTurn, path);
                    timeoutId = setTimeout(() => {
                        cells_class[nextIndex].removeBullet();
                    }, 150);
                    piecedesaudio.play();
                    cells_class[index].removeBullet();
                    modifyHealth(nextIndex, cannonHit);
                    clearInterval(intervalId);
                    ispaused = !ispaused;
                    resolve(); 
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
    if(div.dataset.health>1)
        div.dataset.health--;
    else{
        div.dataset.health--;
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
        isBlackTurn = !isBlackTurn; 
        if(isSingleplayer){
            botTurn(isBlackTurn);
            await shoot(isBlackTurn);
            isBlackTurn = !isBlackTurn;
        }
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
    isBlackTurn = !isBlackTurn; 
    if(isSingleplayer){
        botTurn(isBlackTurn);
        await shoot(isBlackTurn);
        isBlackTurn = !isBlackTurn;
    }
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
}

const swapRicochetHandler = () => swapRicochet(memoryRicochet,memoryReplace,isBlackTurn);

function resetComplete() {
    whiteCash=0;
    blackCash=0;
    cash1.innerText=0;
    cash2.innerText=0;
    bar1.value=5;
    bar2.value=5;
    tank_b.dataset.health = 5;
    tank_w.dataset.health = 5;
    cannon_b.dataset.health = 3;
    cannon_w.dataset.health = 3;
    pauseTimer();
    timer1 = 300;
    timer2 = 300;
    updateTime();
    filledcells = [];
    filledBotcells = [];
    validCellsArray = [];
    currentIndex = null;
    memory = null;
    memoryRicochet = null;
    memoryReplace = null;   
    htmlMemory = null;
    isBlackTurn = false;
    ispaused = true;
    isreplay = false;
    movesMemory = [];
    isShooting = false;
    currentMove = 0;
    listSet.innerHTML='';
    cells_class.forEach(cell=>{
        cell.removePiece();
        cell.removeBullet();
    })
    pause_resume.innerHTML =`
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <img src='images/play.svg'>`;
    if(isSingleplayer && player==='player'){
        boardPrePopulate(boardPreArray,'b');
    }else if(isSingleplayer && player==='bot'){
        boardPrePopulate(boardPreArray,'w');
    }else{
        boardPrePopulate(boardPreArray);
    }
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
        blackCash+=x;
        cash2.innerText = blackCash;

    }else{
        whiteCash+=x;
        cash1.innerText = String(whiteCash);    }
}

const undoFunction = function(){
    if(!isShooting){
    if(currentMove>0){
    if(!ispaused){
        ispaused = !ispaused;
    }
    pause_resume.classList.add('hidden');
    pause_resume.innerHTML = "<img src='images/play.svg'>";
    pauseTimer();
    movesMemory[currentMove].forEach(cell=>{
        cells_class[cell.index].removePiece();

    })
    resetBgc(); 
    movesMemory[currentMove-1].forEach(cell=>{
        if(cell.invisible){
            cells_class[cell.index].setPiece(cell.piecediv);
            cells_class[cell.index].setBgc('pink');
        }
        if(cell.piecediv){
            const newPieceDiv = cell.piecediv;
            newPieceDiv.style.transform = cell.rotation;
            if(cell.health){
                newPieceDiv.dataset.health=cell.health;
                if(newPieceDiv.id.includes('_w')){
                    bar1.value=newPieceDiv.dataset.health;
                }else{
                    bar2.value=newPieceDiv.dataset.health;
                }
            }
            cells_class[cell.index].setPiece(newPieceDiv);
        }else{
            cells_class[cell.index].occupied=true;
            cells_class[cell.index].setBgc('pink');
        }
        cash1.innerText=cell.whitecash;
        cash2.innerText=cell.blackcash;
    })
    currentMove = currentMove-1;
}
    }
}

const redoFunction = async function() {
    let cannon = null;
    if (currentMove < movesMemory.length - 1) {
        resetBgc();

        movesMemory[currentMove].forEach(cell => {
            cells_class[cell.index].removePiece();
        });
        
        movesMemory[currentMove + 1].forEach(cell => {
            console.log(cell)
            if(isreplay || (cell.destroyed===false && !isreplay)){
                if(cell.invisible){
                    cells_class[cell.index].setPiece(cell.piecediv);
                    cells_class[cell.index].setBgc('pink');
                    cells_class[cell.index].piece=null;
                    }
                    else if(cell.piecediv){
                        const newPieceDiv = cell.piecediv;
                        newPieceDiv.style.transform = cell.rotation;
                        if(cell.health){
                            newPieceDiv.dataset.health=cell.health;
                            if(newPieceDiv.id.includes('_w')){
                                bar1.value=newPieceDiv.dataset.health;
                            }else{
                                bar2.value=newPieceDiv.dataset.health;
                            }
                        }
                        cells_class[cell.index].setPiece(newPieceDiv);
                    }else{
                        cells_class[cell.index].occupied=true;
                        cells_class[cell.index].setBgc('pink');
                    }
                if ((currentMove % 2 !== 0 && cells_class[cell.index].piece === 'cannon_b') ||
                    (currentMove % 2 === 0 && cells_class[cell.index].piece === 'cannon_w')) {
                    cannon = cell.index;
                }
                cash1.innerText=cell.whitecash;
                cash2.innerText=cell.blackcash;
                bar1.value = cell.p1health;
                bar2.value = cell.p2health;
            }
        });
        
        if(currentMove === movesMemory.length - 2)
            pause_resume.classList.remove('hidden');

        if (isreplay) {
            await shoot(currentMove % 2 !== 0, null, cannon);
        }else{
            currentMove = currentMove+1;
        }
    }
};


const replay = async function() {
    whiteCash=0;
    blackCash=0;
    cash1.innerText=0;
    cash2.innerText=0;
    bar1.value=5;
    bar2.value=5;
    tank_b.dataset.health = 5;
    tank_w.dataset.health = 5;
    cannon_b.dataset.health = 3;
    cannon_w.dataset.health = 3;
    isreplay = true;
    ispaused = true;

    movesMemory[currentMove].forEach(cell => {
        cells_class[cell.index].removePiece();
    });

    movesMemory[0].forEach(cell => {
        if(cell.invisible){
            cells_class[cell.index].setPiece(cell.piecediv);
            cells_class[cell.index].setBgc('pink');
            cells_class[cell.index].piece=null;
        }
        else if(cell.piecediv){
            const newPieceDiv = cell.piecediv;
            newPieceDiv.style.transform = cell.rotation;
            if(cell.health){
                newPieceDiv.dataset.health=cell.health;
            }
            cells_class[cell.index].setPiece(newPieceDiv);
        }else{
            cells_class[cell.index].occupied=true;
            cells_class[cell.index].setBgc('pink');
        }
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
    }else if(way === 'swap'){
        list.innerText = `${cells_class[memory2].piece.slice(0,-2).toUpperCase()} Swaps With ${cells_class[memory1].piece.slice(0,-2).toUpperCase()}`;
    }else if(way==='spell'){
        list.innerText = `${memory1} Was Used On ${memory2}`;

    }
    if(blackTurn){
        list.style.color = '#EEEEEE';
    }else{
        list.style.color = '#A9A9A9';
    }
    listSet.appendChild(list);
}

function spellfn(cell,blackTurn){
    if((cell.team=='b' && blackTurn) || (cell.team=='w' && !blackTurn)){
        if(cell.piece==='tank_w'){
            if(whiteCash>=100){
                tank_w.dataset.health=Number(tank_w.dataset.health)+1;
                bar1.value = tank_w.dataset.health;
                whiteCash-=100;
                cash1.innerText = whiteCash;
                printMove('Heal','TANK','spell',blackTurn);
            }else{
                warning.showModal();
            }
        }else if(cell.piece==='tank_b'){
            if(blackCash>=100){
                tank_b.dataset.health=Number(tank_b.dataset.health)+1;
                bar2.value = tank_b.dataset.health;
                blackCash-=100;
                cash2.innerText = blackCash;
                printMove('Heal','TANK','spell',blackTurn);
            }else{
                warning.showModal();
            }
        }else if(cell.piece.includes('titan')){
            if(blackTurn){
                if(blackCash>=500){
                    cell.piece=null
                    blackCash-=500;
                    cash2.innerText = blackCash;
                    printMove('Vanish','TITAN','spell',blackTurn);
                }else{
                    warning.showModal();
                }
            }else{
                if(whiteCash>=500){
                    cell.piece=null
                    whiteCash-=500;
                    cash1.innerText = whiteCash;
                    printMove('Vanish','TITAN','spell',blackTurn);

                }else{
                    warning.showModal();
                }
            }
        }
    }else if((cell.team=='b' && !blackTurn) || (cell.team=='w' && blackTurn)){
        if(cell.piece==='tank_w'){
            if(blackCash>=200){
                tank_w.dataset.health=Number(tank_w.dataset.health)-1;
                bar1.value = tank_w.dataset.health;
                if(tank_w.dataset.health==='0'){
                    cell.removePiece();
                }
                blackCash-=200;
                cash2.innerText = blackCash;
                printMove('Strike','TANK','spell',blackTurn);

            }else{
                warning.showModal();
            }
        }else{
            if(whiteCash>=200){
                tank_b.dataset.health=Number(tank_b.dataset.health)-1;
                bar2.value = tank_b.dataset.health;
                if(tank_b.dataset.health==='0'){
                    cell.removePiece();
                }
                whiteCash-=200;
                cash1.innerText = whiteCash;
                printMove('Strike','TANK','spell',blackTurn);

            }else{
                warning.showModal();
            }
        }
    }else if(cell.occupied===false){
        if(blackTurn){
            if(blackCash>=50){
                cell.occupied=true;
                cell.setBgc('pink');
                blackCash-=50;
                cash2.innerText = blackCash;
                printMove('Block','Empty Cell','spell',blackTurn);

            }else{
                warning.showModal();
            }
        }else{
            if(whiteCash>=50){
                cell.occupied=true;
                cell.setBgc('pink');
                whiteCash-=50;
                cash1.innerText = whiteCash;
                printMove('Block','Empty Cell','spell',blackTurn);

            }else{
                warning.showModal();
            } 
        }
    }
}

const spellfnHandler = () => spellfn(cells_class[currentIndex],isBlackTurn);
 













