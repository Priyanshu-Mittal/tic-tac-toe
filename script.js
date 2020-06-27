var board;
const wincombo=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];
const human='O';
const ai='X';
const cells=document.querySelectorAll('.cell');
playGame();
function playGame(){
	board=Array.from(Array(9).keys());
	document.querySelector(".endgame").style.display="none";
	for(let i=0;i<cells.length;i++){
		cells[i].style.pointerEvents = "auto";
		cells[i].style.removeProperty('background-color');
		cells[i].innerText="";
		cells[i].addEventListener('click',turnClick,false);
	}
}
function turnClick(cell){
	if(typeof board[cell.target.id]=='number'){
		turn(cell.target.id,human)
			if(!checkWin(board,human) && !checkTie(board))	
				turn(bestSpot(),ai);
	}
}
function turn(cellId,player){
	board[cellId]=player;
	document.getElementById(cellId).style.backgroundColor='black';
	document.getElementById(cellId).innerText=player;
	let gameWon=checkWin(board,player);
	if(gameWon){
		gameOver(gameWon);
	}
}
function checkWin(tboard,player){
	let gameWon=null;
	for(var ind=0;ind<wincombo.length;ind++){
		let i=wincombo[ind][0],j=wincombo[ind][1],k=wincombo[ind][2];
		if( (tboard[i]==player) && (tboard[i]==tboard[j]) && (tboard[j]==tboard[k]) ){
			gameWon={index:ind,winner:player};
			break;
		}
	}
	return gameWon;
}
function gameOver(gameWon){
	for(let i of wincombo[gameWon.index]){
		document.getElementById(i).style.backgroundColor="red";
	}
	for(let p=0;p<cells.length;p++){
		cells[p].style.pointerEvents = "none";
	}
	declareWinner(gameWon.winner == human ? "Congrats! You won." : "Oops! You lost.");
}
function bestSpot(){
	return minimax(board,ai).index;
}
function declareWinner(text){
	document.querySelector(".endgame").style.display="block";
	document.querySelector(".endgame .text").innerText=text;
}
function emptyCells(){
	return board.filter(s => typeof s == 'number');
}
function checkTie(tboard){
	if(emptyCells().length==0){
		for(let p=0;p<cells.length;p++){
			cells[p].style.backgroundColor="red";
			cells[p].style.pointerEvents = "none";
		}
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}

function minimax(tboard, player) {
	var availSpots = emptyCells();

	if (checkWin(tboard, human)) {
		return {score: -10};
	} 
	else if (checkWin(tboard, ai)) {
		return {score: 10};
	} 
	else if (availSpots.length == 0) {
		return {score: 0};
	}
	var moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = tboard[availSpots[i]];
		tboard[availSpots[i]] = player;
		if (player == ai) {
			move.score = minimax(tboard, human).score;
		} 
		else {
			move.score = minimax(tboard, ai).score;
		}
		tboard[availSpots[i]] = move.index;
		moves.push(move);
	}
	var bestMove;
	if(player == ai) {
		var bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} 
	else {
		var bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}