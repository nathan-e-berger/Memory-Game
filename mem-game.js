"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 * Create two rows of one container div each
 * place shuffled deck into each container without changing order
 * add event listener to each card
 */
function createCards(colors) {
  const gameBoard1 = document.getElementById("game1");
  const gameBoard2 = document.getElementById("game2");

  for (let l = 0; l < colors.length; l++) {
    const newCard = document.createElement('card');
    newCard.className = colors[l];

    l < 5 ? gameBoard1.appendChild(newCard) : gameBoard2.appendChild(newCard);
  }

  let cards = document.querySelectorAll('card');
  for (let card of cards) {
    card.addEventListener('click', handleCardClick);
  }
}

/** Flip a card face-up.
 * when flipped, set card's background color to class  */
function flipCard(card) {
  card.style.backgroundColor = card.className;
}

/** Flip a card face-down. */
function unFlipCard(...cards) {
  // set card color back to default
  for (let card of cards) {
    card.style.backgroundColor = 'gray';
  }
}

// set firstClick and secondClick after each evaluation of two cards
function clearClicks() {
  firstClick = secondClick = undefined;
}

// For tracking where you are in the 2-click timeline
let firstClick;
let secondClick;

// cooldown used to prevent user from spamming clicks
let coolState = false;
function coolDown() {
  coolState = true;
  setTimeout(()=> coolState = false, 1000);
}

/**
 * flip over the card that is clicked using target info
 * flip the next card and if different, unflip both after 1 second
 * if they are a match then leave them flipped
*/
function handleCardClick(evt) {
  // if cooldown is in effect do nothing
  if (coolState) return;

  // set firstClick and flip card
  if (!firstClick) {
    firstClick = evt.target
    flipCard(firstClick);
  }
  // set secondClick and flip if target does not match firstClick
  else if (evt.target !== firstClick) {
    secondClick = evt.target;
    flipCard(secondClick);
    coolDown();
  }

  // if cards do not match then unflip and return to listen for more events
  // else if they do match just reset to listen for more events
  if (secondClick && firstClick.className !== secondClick.className) {
    setTimeout(unFlipCard, 1000, firstClick, secondClick);
    clearClicks();
    return;
  }
  else if (secondClick && secondClick.className === firstClick.className) clearClicks();
}

// refresh the page after all cards are flipped
function reset() {
  location.reload();
}

document.getElementById('reset').addEventListener('click', reset);
