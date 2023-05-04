import { chosungData } from "./chosungData.js";

const countdownDisplay = document.getElementById("countdown-display");
const quizArea = document.getElementById("quiz-area");
const nextBtn = document.getElementById("next-btn");
const hintBtn = document.getElementById("hint-btn");
const resultDisplay = document.getElementById("result-display");
const answerInput = document.getElementById("answer-input");
const answerBtn = document.getElementById("answer-btn");

let remainingChosungData = [...chosungData];

function getRandomChosung() {
  if (remainingChosungData.length === 0) {
    remainingChosungData = [...chosungData];
  }

  const index = Math.floor(Math.random() * remainingChosungData.length);
  const chosenChosung = remainingChosungData[index];
  remainingChosungData.splice(index, 1);

  return chosenChosung;
}

let currentHintIndex = 0;

function showNextHint() {
  const currentChosung = quizArea.textContent;
  const hintData = chosungData.find((data) => data.chosung === currentChosung);
  const hintKeys = Object.keys(hintData).filter((key) =>
    key.startsWith("hint")
  );

  if (currentHintIndex >= hintKeys.length) {
    resultDisplay.style.display = "none";
    currentHintIndex = 0;
    return;
  }

  const hintText = hintData[hintKeys[currentHintIndex]];
  resultDisplay.textContent = `힌트 ${currentHintIndex + 1}: ${hintText}`;
  resultDisplay.style.display = "block";

  currentHintIndex += 1;
}


function countdown(seconds) {
  return new Promise((resolve) => {
    countdownDisplay.style.display = "flex";
    let remainingTime = seconds;
    countdownDisplay.textContent = `${remainingTime}`;

    const interval = setInterval(() => {
      remainingTime -= 1;
      countdownDisplay.textContent = `${remainingTime}`;

      if (remainingTime <= 0) {
        clearInterval(interval);
        countdownDisplay.textContent = "";
        countdownDisplay.style.display = "none";
        resolve();
      }
    }, 1000);
  });
}

async function checkAnswer() {
  const currentChosung = quizArea.textContent;
  const correctAnswer = chosungData.find(
    (data) => data.chosung === currentChosung
  ).word;
  const userAnswer = answerInput.value.trim();

  if (userAnswer === correctAnswer) {
    resultDisplay.textContent = `정답입니다! 🎁 당신의 상품 번호는....`;
    resultDisplay.style.display = "block";
    resultDisplay.style.backgroundColor = "black";
    resultDisplay.style.color = "white";

    quizArea.textContent = await giftLottery();
  } else {
    resultDisplay.textContent = `땡!`;
    resultDisplay.style.display = "block";
    resultDisplay.style.backgroundColor = "black";
    resultDisplay.style.color = "white";
  }
  answerInput.value = "";
}

const usedGiftNumbers = [];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}


function animateGiftNumber(duration) {
  return new Promise((resolve) => {
    const startTime = performance.now();

    const updateNumber = () => {
      const currentTime = performance.now();
      const progress = (currentTime - startTime) / duration;
      const easedProgress = easeOutCubic(progress);

      const randomNumber = Math.floor(Math.random() * 20) + 1;
      quizArea.textContent = `${randomNumber}`;

      if (progress < 1) {
        const delay = 100 * (1 + easedProgress * 9);
        setTimeout(updateNumber, delay);
      } else {
        resolve();
      }
    };

    updateNumber();
  });
}



async function giftLottery() {
  let giftNumber;
  do {
    giftNumber = Math.floor(Math.random() * 20) + 1;
  } while (usedGiftNumbers.includes(giftNumber));
  usedGiftNumbers.push(giftNumber);

  await animateGiftNumber(5000);

  return `🎉 ${giftNumber} 🎉 `;
}


async function startGame() {
  resultDisplay.style.display = "none";
  await countdown(3);
  const chosungData = getRandomChosung();
  quizArea.textContent = chosungData.chosung;
  if (chosungData.chosung.length > 10) {
    quizArea.style.fontSize = "12rem";
  } else {
    quizArea.style.fontSize = "20rem";
  }

  currentHintIndex = 0;
}


const startBtn = document.getElementById("start-btn");
const welcomeContainer = document.getElementById("welcome-container");
startBtn.addEventListener("click", () => {
  welcomeContainer.style.display = "none";
  startGame();
});
hintBtn.addEventListener("click", showNextHint);
nextBtn.addEventListener("click", startGame);
answerBtn.addEventListener("click", checkAnswer);
