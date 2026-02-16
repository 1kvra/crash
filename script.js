let balance = 0;
let bet = 0;
let multiplier = 1;
let crashPoint = 0;

let running = false;
let cashedOut = false;
let betPlaced = false;

let countdown = 7;

const balanceEl = document.getElementById("balance");
const multiplierEl = document.getElementById("multiplier");
const timerEl = document.getElementById("timer");
const logEl = document.getElementById("log");
const cashOutBtn = document.getElementById("cashOutBtn");

// ---------- CORE FUNCTIONS ----------

function cashIn() {
  const amount = Number(document.getElementById("cashIn").value);
  if (amount > 0) {
    balance += amount;
    updateBalance();
    log("Cashed in.");
  }
}

function placeBet() {
  if (running) return alert("Round already running!");
  const amount = Number(document.getElementById("betAmount").value);
  if (amount > balance) return alert("Insufficient balance.");
  bet = amount;
  betPlaced = true;
  log("Bet placed: " + bet);
}

function cashOut() {
  if (!running || cashedOut) return;
  const win = betPlaced ? bet * (multiplier - 1) : 0;
  balance += win;
  cashedOut = true;
  updateBalance();
  flash("green");
  beep();
  log(`✅ Cashed out at x${multiplier.toFixed(2)}`);
}

// ---------- GAME LOOP ----------

setInterval(() => {
  if (!running) {
    countdown--;
    timerEl.textContent = "Next round in: " + countdown;
    if (countdown <= 0) {
      startRound();
      countdown = 7;
    }
  } else {
    timerEl.textContent = "Round ongoing...";
  }
}, 1000);

function startRound() {
  running = true;
  cashedOut = false;
  multiplier = 1;
  multiplierEl.style.color = "black";
  cashOutBtn.disabled = false;

  crashPoint = 1 + Math.pow(Math.random(), 3) * 5;
  log("--- New Round ---");

  runMultiplier();
}

function runMultiplier() {
  if (!running) return;

  // Smooth acceleration with cap
  const maxSpeedMultiplier = 2.5;
  const baseDelay = 220;   // slow start
  const minDelay = 20;     // max speed
  const acceleration = 140;

  const effectiveMultiplier = Math.min(multiplier, maxSpeedMultiplier);

  let delay = baseDelay - (effectiveMultiplier - 1) * acceleration;

  // Clamp delay
  delay = Math.max(delay, minDelay);

  setTimeout(() => {
    multiplier += 0.01;
    multiplierEl.textContent = "x" + multiplier.toFixed(2);

    if (multiplier >= crashPoint) {
      crash();
    } else {
      runMultiplier();
    }
  }, delay);
}

function crash() {
  running = false;
  cashOutBtn.disabled = true;
  multiplierEl.style.color = "red";
  flash("red");
  beep();

  if (betPlaced && !cashedOut) {
    balance -= bet;
    updateBalance();
    log(`💥 Crashed at x${crashPoint.toFixed(2)} — Lost ${bet}`);
  } else {
    log(`💥 Crashed at x${crashPoint.toFixed(2)}`);
  }

  betPlaced = false;
}

// ---------- UI HELPERS ----------

function updateBalance() {
  balanceEl.textContent = "Balance: " + balance.toFixed(2);
}

function log(msg) {
  logEl.innerHTML += msg + "<br>";
  logEl.scrollTop = logEl.scrollHeight;
}

function beep() {
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  audio.play();
}

function flash(color) {
  document.body.style.background = color;
  setTimeout(() => document.body.style.background = "#121212", 150);
}


