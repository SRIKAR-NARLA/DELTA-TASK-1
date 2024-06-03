let timer1 = 300; // 5 minutes in seconds
let timer2 = 300; // 5 minutes in seconds
let interval;

const time1Element = document.getElementById('time1');
const time2Element = document.getElementById('time2');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function updateTime() {
    time1Element.textContent = formatTime(timer1);
    time2Element.textContent = formatTime(timer2);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!interval) {
        interval = setInterval(() => {
            if(!ispaused){
            if (!isBlackTurn) {
                timer1--;
                if (timer1 <= 0) {
                    clearInterval(interval);
                    diatext.innerText = 'Time is up, Black wins';
                    dialog.showModal();
                }
            } else {
                timer2--;
                if (timer2 <= 0) {
                    clearInterval(interval);
                    diatext.innerText = 'Time is up, White wins';
                    dialog.showModal();
                }
            }
            updateTime();
        }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}