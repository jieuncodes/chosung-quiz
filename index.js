const chosungData = [
  {
    chosung: "ㅈㄴㅇ",
    word: "정늠인",
    hint1: "이정대 + 장순늠 = ?",
    hint2: "OOO의 마크는 네잎클로버다.",
  },
  {
    chosung: "ㄱㅂ",
    word: "김밥",
    hint1: "이영이 이모가 가장 잘 만드는 음식",
    hint2: "참치 OO, 계란 OO",
    hint3: "잘~~~ 말아 줘~~~",
  },
  {
    chosung: "ㄷㅈㅉㄱ",
    word: "된장찌개",
    hint1: "한국의 음식",
    hint2: "보글보글",
    hint3: "뚝배기",
  },
  {
    chosung: "ㅌㅅㅇ",
    word: "탕수육",
    hint1: "짜장면",
    hint2: "찍먹 부먹",
  },
  {
    chosung: "ㅇㅎㅅㅁㄱㅌㅇ",
    word: "월화수목금토일",
    hint1: "달력",
    hint2: "빨주노초파남보",
  },
  {
    chosung: "ㄱㄹ ㅆㅇㅇ ㅅㅇㄷ ㅌㅈㄷ",
    word: "고래 싸움에 새우등 터진다",
    hint1: "밥과 깡",
    hint2: "속담",
  },
  {
    chosung: "ㅈㄹㅇㄷ ㅂㅇㅁ ㄲㅌㅎㄷ",
    word: "지렁이도 밟으면 꿈틀한다",
    hint1: "속담",
    hint2: "비오는날 나타나는 이것에 관한 속담",
  },
  {
    chosung: "ㅂㄷㅂㅇㅁ",
    word: "불닭볶음면",
    hint1: "껍데기에 하얀닭이 그려져있음",
    hint2: "너무 매워",
    hint3: "라면",
  },
  {
    chosung: "ㄷㅇㄴㅁㅇㅌ",
    word: "다이너마이트",
    hint1: "너무 매워",
    hint2: "BTS",
  },
];

const countdownDisplay = document.getElementById("countdown-display");
const quizArea = document.getElementById("quiz-area");
const nextBtn = document.getElementById("next-btn");
const hintBtn = document.getElementById("hint-btn");
const giftLotteryDisplay = document.getElementById("gift-lottery-display");
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

function toggleInputVisibility(visible) {
  const displayStyle = visible ? "inline-block" : "none";
  hintBtn.style.display = displayStyle;
  answerBtn.style.display = displayStyle;
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

function checkAnswer() {
  const currentChosung = quizArea.textContent;
  const correctAnswer = chosungData.find(
    (data) => data.chosung === currentChosung
  ).word;
  const userAnswer = answerInput.value.trim();

  if (userAnswer === correctAnswer) {
    resultDisplay.textContent = `정답입니다!`;
    resultDisplay.style.display = "block";
    resultDisplay.style.backgroundColor = "black";
    resultDisplay.style.color = "white";

    quizArea.textContent = giftLottery();
  } else {
    resultDisplay.textContent = `땡!`;
    resultDisplay.style.display = "block";
    resultDisplay.style.backgroundColor = "black";
    resultDisplay.style.color = "white";
  }
  answerInput.value = "";
}

function giftLottery() {
  const giftNumber = Math.floor(Math.random() * 20) + 1;
  return `🎁 : ${giftNumber}`;
}

async function startGame() {
  resultDisplay.style.display = "none";
  await countdown(3);
  const chosungData = getRandomChosung();
  quizArea.textContent = chosungData.chosung;
  if (chosungData.chosung.length > 10) {
    quizArea.style.fontSize = "150px";
  } else {
    quizArea.style.fontSize = "200px";
  }

  currentHintIndex = 0;
}

startGame();

hintBtn.addEventListener("click", showNextHint);
nextBtn.addEventListener("click", startGame);
answerBtn.addEventListener("click", checkAnswer);
