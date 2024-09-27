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

  // Используйте тип QuestionsData для вопросов
  const categories: QuestionsData = getRandomQuestions(
    questions as QuestionsData
  );

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

  let players: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  }[] = [];

  function getRandomQuestions(data: QuestionsData): QuestionsData {
    const result: QuestionsData = { categories: [] }; // Новый объект для результата

    data.categories.forEach((category: Category) => {
      const pointsMap: { [key: number]: Question[] } = {};

      // Группируем вопросы по стоимости
      category.questions.forEach((question: Question) => {
        const points = question.points;
        if (!pointsMap[points]) {
          pointsMap[points] = [];
        }
        pointsMap[points].push(question);
      });

      // Выбираем один вопрос из каждой группы стоимости
      const selectedQuestions: Question[] = [];
      for (const points in pointsMap) {
        const questionsWithSamePoints = pointsMap[points];
        const randomQuestion =
          questionsWithSamePoints[
            Math.floor(Math.random() * questionsWithSamePoints.length)
          ];
        // Добавляем случайный вопрос в список выбранных
        selectedQuestions.push({ ...randomQuestion, selected: false }); // Сбросим selected на false
      }

      // Добавляем категорию с выбранными вопросами
      result.categories.push({ ...category, questions: selectedQuestions });
    });

    console.log(result);
    return result;
  }

  console.log(categories);

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
  }

  function handleQuestionSelection(question: Question, points: number) {
    currentQuestion = question;
    currentPoints = points;
    currentScreen = "questionScreen";
    // Обновляем состояние selected для выбранного вопроса
    question.selected = true;
  }

  function handleSkip() {
    currentScreen = "questionBoard";
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
    currentScreen = "playerResult";
  }

  function handleNegativeScoreChange(playerId: number) {
    players = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, score: player.score - currentPoints };
      }
      return player;
    });
    selectedPlayer = players.find((player) => player.id === playerId) || null;
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
</script>

<div class="container">
  {#if currentScreen === "start"}
    <StartScreen onStartGame={handleStartGame} />
  {:else if currentScreen === "characterSelect"}
    <CharacterSelect {characters} onConfirm={handleCharacterSelect} />
  {:else if currentScreen === "questionBoard"}
    <QuestionBoard {categories} onQuestionSelected={handleQuestionSelection} />
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
    <PlayerResult player={selectedPlayer} {pointsAdded} onNext={nextQuestion} />
  {:else if currentScreen === "final"}
    <FinalScreen {players} />
  {/if}
</div>
