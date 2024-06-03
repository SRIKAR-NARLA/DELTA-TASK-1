const whitebtn = document.querySelector('#white');
const blackbtn = document.querySelector('#black');
const friendbtn = document.querySelector('#friend');
const toggleButton = document.querySelector('.toggle-button');
const navbarLinks = document.querySelector('.navbar-links');
const spellbtn = document.querySelector('.spell');

const board = document.querySelector('.main-container');
const body = document.querySelector('body');
let filledcells = [];
let filledBotcells = [];
let validCellsArray = [];
let currentIndex = null;
let memory = null;
let memoryRicochet = null;
let memoryReplace = null;   
let htmlMemory = null;
let isBlackTurn = false;
let ispaused = true;
let isreplay = false;
let movesMemory = [];
let isShooting = false;
let currentMove = 0;
const left = document.querySelector('.left');
const right = document.querySelector('.right');
const swap = document.querySelector('.swap');
const pause_resume = document.querySelector('.pause_resume');
const reset = document.querySelector('.reset');
const undo = document.querySelector('#undo');
const redo = document.querySelector('#redo');
const replaybtn = document.querySelector('#replay');
const listSet = document.querySelector('.history');
const dialog= document.querySelector('.popup');
let intervalId = null;
let timeoutId = null;
let whiteCash=0;
let blackCash=0;
let cash1 = document.querySelector('#cash1');
let cash2 = document.querySelector('#cash2');
const warning = document.querySelector('.warning');
const close = document.querySelector('#close');
    
toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});



