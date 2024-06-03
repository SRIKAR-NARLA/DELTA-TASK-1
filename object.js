class Cell {
    constructor(element, row, column) {
        this.element = element;
        this.row = row;
        this.column = column;
        this.occupied = false;
        this.team = null;
        this.bgc = null;
        this.piece = null;
        this.piecediv = null;

       
        this.element.dataset.row = row  ;
        this.element.dataset.column = column;
        this.element.className = 'cell'; 
    }

    
    setRow(newRow) {
        this.row = newRow;
        this.element.dataset.row = newRow;  
    }

    setColumn(newColumn) {
        this.column = newColumn;
        this.element.dataset.row = newColumn;  
    }

    setBgc(newBgc) {
        this.bgc = newBgc;
        this.element.style.backgroundColor = newBgc; 
    }

    setBorder(){
        this.element.style.border = '1px solid #333';
    }

    removeBorder(){
        this.element.style.border = null;
    }

    setTeam(newTeam) {
        this.team = newTeam;  
    }

    removeTeam() {
        this.team = null;  
    }

    setPiece(newPiece) {
        this.piece = newPiece.id;  
        this.toggleOccupied();
        this.piecediv = newPiece;
        this.team = this.piece.includes('_w')?'w':'b';
        newPiece.style.opacity = 0;
        setTimeout(() => {
            this.element.appendChild(newPiece); 
        }, 150);
        setTimeout(() => {
            newPiece.style.transition = 'opacity 0.3s ease-in-out';
            newPiece.style.opacity = 1;
        }, 300);
    }
    
    removePiece() {
        this.occupied = false;
        if (this.piecediv) {
            const pieceToRemove = this.piecediv;

        if (pieceToRemove && this.element.contains(pieceToRemove)) {
            pieceToRemove.style.transition = 'opacity 0.3s ease-in-out';
            pieceToRemove.style.opacity = 0;
            setTimeout(() => {
                if (this.element.contains(pieceToRemove)) {
                    this.element.removeChild(pieceToRemove);
                }
            }, 150);
        }
            this.piece = null;
            this.piecediv = null;
            this.team = null;
        }
    }

    setBullet(turn) {
        if(turn){
            this.element.appendChild(bullet_b);
        }else{
            this.element.appendChild(bullet_w);
        }
    }

    removeBullet(){
        const bullet = this.element.querySelector('.bullet');
    if (bullet) {
        this.element.removeChild(bullet);
    }
    }

    toggleOccupied() {
        this.occupied = !this.occupied;   
    }
}





