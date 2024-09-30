<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import StartScreen from "./components/StartScreen.svelte";
  import CharacterSelect from "./components/CharacterSelect.svelte";
  import QuestionBoard from "./components/QuestionBoard.svelte";
  import QuestionScreen from "./components/QuestionScreen.svelte";
  import PlayerResult from "./components/PlayerResult.svelte";
  import FinalScreen from "./components/FinalScreen.svelte";
  import type {
    Category,
    Character,
    Question,
    QuestionsData,
  } from "./components/types";
  import { characters } from "./mocks/chatracters";
  import questions from "./mocks/questions.json"; // Убедитесь, что у вас TypeScript поддерживает это
  import { onDestroy } from "svelte";

  const categories: QuestionsData = getRandomQuestions(
    questions as QuestionsData
  );

  let timer = 600; // 10 минут в секундах
  let interval: number;

  // Функция для запуска таймера
  function startTimer() {
    interval = setInterval(() => {
      if (timer > 0) {
        timer--;
      } else {
        clearInterval(interval);
        // onGameEnd(); // Завершение игры по истечению времени
      }
    }, 1000);
  }

  onDestroy(() => {
    clearInterval(interval); // Очищаем интервал при демонтировании компонента
  });

  let currentScreen:
    | "start"
    | "characterSelect"
    | "questionBoard"
    | "questionScreen"
    | "playerResult"
    | "final" = "start";

  let currentQuestion: Question | null = null; // Указываем, что может быть null
  let currentPoints = 0;
  let selectedPlayer: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  } | null = null;
  let pointsAdded = 0;
  let showAnswer = false; // Добавляем переменную для отображения ответа
  let currentAnswer = ""; // Переменная для хранения текущего ответа

  let players: { id: number; name: string; avatar: string; score: number }[] =
    [];

  function getRandomQuestions(data: QuestionsData): QuestionsData {
    const result: QuestionsData = { categories: [] };

    data.categories.forEach((category: Category) => {
      const pointsMap: { [key: number]: Question[] } = {};

      category.questions.forEach((question: Question) => {
        const points = question.points;
        if (!pointsMap[points]) {
          pointsMap[points] = [];
        }
        pointsMap[points].push(question);
      });

      const selectedQuestions: Question[] = [];
      for (const points in pointsMap) {
        const questionsWithSamePoints = pointsMap[points];
        const randomQuestion =
          questionsWithSamePoints[
            Math.floor(Math.random() * questionsWithSamePoints.length)
          ];
        selectedQuestions.push({ ...randomQuestion, selected: false });
      }

      result.categories.push({ ...category, questions: selectedQuestions });
    });

    return result;
  }

  function handleStartGame() {
    currentScreen = "characterSelect";
  }

  function handleCharacterSelect(selectedCharacters: Character[]) {
    players = selectedCharacters.map((character) => ({
      id: character.id,
      name: character.name,
      avatar: character.avatar,
      score: 0,
    }));
    currentScreen = "questionBoard";
    startTimer();
    console.log('timer started')
  }

  function handleQuestionSelection(question: Question, points: number) {
    currentQuestion = question;
    currentPoints = points;
    currentAnswer = question.answer; // Сохраняем ответ для текущего вопроса
    currentScreen = "questionScreen";
    question.selected = true;
    showAnswer = false; // Скрываем ответ при выборе нового вопроса
    selectedPlayer = null; // Сбрасываем выбранного игрока
    pointsAdded = 0; // Сбрасываем добавленные баллы
  }

  function handleSkip() {
    showAnswer = true; // Показываем ответ при нажатии на "Пропустить"
    selectedPlayer = null; // Сбрасываем выбранного игрока, так как не было правильного ответа
    pointsAdded = 0; // Баллы не добавлены
    currentScreen = "playerResult"; // Переход на экран результата
  }

  function handlePositiveScoreChange(playerId: number, points: number) {
    players = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, score: player.score + points };
      }
      return player;
    });
    selectedPlayer = players.find((player) => player.id === playerId) || null;
    pointsAdded = points;
    showAnswer = true; // Показываем ответ при правильном ответе
    currentScreen = "playerResult"; // Переход на экран результата
  }

  function handlePositiveScoreChange1(playerId: number) {
    players = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, score: player.score + 100 };
      }
      return player;
    });
  }

  function handleNegativeScoreChange(playerId: number) {
    players = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, score: player.score - currentPoints };
      }
      return player;
    });
    selectedPlayer = null; // Сбрасываем игрока для правильного отображения при неверном ответе
    pointsAdded = 0; // Никакие баллы не добавляются при неправильном ответе
    showAnswer = true; // Показываем только ответ
  }

  function handleNegativeScoreChange1(playerId: number) {
    players = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, score: player.score - 100 };
      }
      return player;
    });
  }

  function nextQuestion() {
    const allQuestionsSelected = categories.categories.every((category) =>
      category.questions.every((q) => q.selected)
    );

    if (allQuestionsSelected) {
      currentScreen = "final";
    } else {
      currentScreen = "questionBoard";
    }
  }

  const onGameEnd = () => {
    currentScreen = "final";
  };
</script>

<div class="container">
  {#if currentScreen === "start"}
    <StartScreen onStartGame={handleStartGame} />
  {:else if currentScreen === "characterSelect"}
    <CharacterSelect {characters} onConfirm={handleCharacterSelect} />
  {:else if currentScreen === "questionBoard"}
    <QuestionBoard
      {timer}
      {players}
      onPositiveScoreChange={handlePositiveScoreChange1}
      onNegativeScoreChange={handleNegativeScoreChange1}
      {onGameEnd}
      {categories}
      onQuestionSelected={handleQuestionSelection}
    />
  {:else if currentScreen === "questionScreen"}
    <QuestionScreen
      question={currentQuestion}
      points={currentPoints}
      {players}
      onSkip={handleSkip}
      onPositiveScoreChange={handlePositiveScoreChange}
      onNegativeScoreChange={handleNegativeScoreChange}
    />
  {:else if currentScreen === "playerResult"}
    <PlayerResult
      player={selectedPlayer}
      {pointsAdded}
      answer={currentAnswer}
      onNext={nextQuestion}
    />
  {:else if currentScreen === "final"}
    <FinalScreen {players} />
  {/if}
</div>
