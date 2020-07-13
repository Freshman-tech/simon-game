const game = {
  sequence: [],
  humanSequence: [],
  level: 0,
};

const startButton = document.querySelector('.start-button');
const info = document.querySelector('.info');
const heading = document.querySelector('.heading');
const tileContainer = document.querySelector('.tile-container');

function resetGame(text) {
  alert(text);
  game.sequence = [];
  game.humanSequence = [];
  game.level = 0;
  startButton.classList.remove('hidden');
  heading.textContent = 'Simon Game';
  info.classList.add('hidden');
  tileContainer.classList.add('unclickable');
}

function stopAllSounds() {
  document.querySelectorAll('audio').forEach(audio => audio.pause());
}

function humanTurn(counter) {
  tileContainer.classList.remove('unclickable');
  info.textContent = `Your turn: ${counter} Tap${counter > 1 ? 's' : ''}`;
}

function triggerClick(tile) {
  const tileToClick = document.querySelector(`[data-tile='${tile}']`);
  const soundToPlay = document.querySelector(`[data-sound='${tile}']`);
  stopAllSounds();
  soundToPlay.play();

  tileToClick.classList.add('activated');
  setTimeout(() => {
    tileToClick.classList.remove('activated');
  }, 300);
}

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow'];
  const randomNumber = Math.floor(Math.random() * tiles.length);

  return tiles[randomNumber];
}

function playRound(nextSequence) {
  nextSequence.forEach((tile, index) => {
    setTimeout(() => {
      triggerClick(tile);
    }, (index + 1) * 600);
  });
}

function nextRound() {
  game.level += 1;

  tileContainer.classList.add('unclickable');
  info.textContent = 'Wait for the computer';
  heading.textContent = `Level ${game.level} of 20`;
  const nextSequence = [...game.sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);

  game.sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(game.level);
  }, game.level * 600 + 1000);
}

function handleHumanTurn(tile) {
  const index = game.humanSequence.push(tile) - 1;
  const soundToPlay = document.querySelector(`[data-sound='${tile}']`);
  stopAllSounds();
  soundToPlay.play();

  const remainingTaps = game.sequence.length - game.humanSequence.length;

  if (game.humanSequence[index] !== game.sequence[index]) {
    return resetGame('Oops! Game over, you pressed the wrong tile.');
  }

  if (game.humanSequence.length === game.sequence.length) {
    if (game.humanSequence.length === 20) {
      stopAllSounds();
      return resetGame('Congrats, You Legend! You completed all the levels');
    }

    game.humanSequence = [];
    info.textContent = 'Success! Keep going!';
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${
    remainingTaps > 1 ? 's' : ''
  }`;
}

function startGame() {
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Wait for the computer';
  tileContainer.classList.remove('unclickable');
  nextRound();
}

startButton.addEventListener('click', startGame);
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;

  if (tile) handleHumanTurn(tile);
});
