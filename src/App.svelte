<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import StartScreen from "./components/StartScreen.svelte";
  import CharacterSelect from "./components/CharacterSelect.svelte";
  import QuestionBoard from "./components/QuestionBoard.svelte";
  import QuestionScreen from "./components/QuestionScreen.svelte";
  import PlayerResult from "./components/PlayerResult.svelte";
  import FinalScreen from "./components/FinalScreen.svelte";
  import type { Character } from "./components/types";
  import { characters } from "./mocks/chatracters";
  import questions from "./mocks/questions.json";

  type Question = {
    answer: string;
    author: string;
    points: number;
    question: string;
    selected: boolean;
  };

  let currentScreen:
    | "start"
    | "characterSelect"
    | "questionBoard"
    | "questionScreen"
    | "playerResult"
    | "final" = "start";

  //@ts-ignore
  let currentQuestion: Question = {};
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
  }[] = []; // Игроки будут выбраны позже

  function addSelectedFieldToQuestions(jsonData: any) {
    //@ts-ignore
    return jsonData.categories.map((category) => {
      return {
        ...category,
        //@ts-ignore
        questions: category.questions.map((question) => ({
          ...question,
          selected: false,
        })),
      };
    });
  }

  const categories = addSelectedFieldToQuestions(questions);

  // Функция для начала игры
  function handleStartGame() {
    currentScreen = "characterSelect"; // Сначала выбираем персонажей
  }

  // Подтверждаем выбор игроков
  function handleCharacterSelect(selectedCharacters: Character[]) {
    players = selectedCharacters.map((character) => ({
      id: character.id,
      name: character.name,
      avatar: character.avatar,
      score: 0,
    }));
    currentScreen = "questionBoard"; // Переход на доску вопросов
  }

  function handleQuestionSelection(question: Question, points: number) {
    currentQuestion = question;
    currentPoints = points;
    currentScreen = "questionScreen";
  }

  function handleSkip() {
    currentScreen = "questionBoard";
  }

  function handlePositiveScoreChange(playerId: number, points: number) {
    // @ts-ignore
    selectedPlayer = players.find((player) => player.id === playerId);
    if (selectedPlayer) selectedPlayer.score += points;
    pointsAdded = points;
    currentScreen = "playerResult";
  }

  function handleNegativeScoreChange(playerId: number) {
    //@ts-ignore
    selectedPlayer = players.find((player) => player.id === playerId);
    if (selectedPlayer) selectedPlayer.score -= currentPoints;
    // Остальные игроки могут попытаться ответить
  }

  function nextQuestion() {
    // @ts-ignore
    const allQuestionsSelected = categories.every((category) =>
      // @ts-ignore
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
      bind:players={players}
      onSkip={handleSkip}
      onPositiveScoreChange={handlePositiveScoreChange}
      onNegativeScoreChange={handleNegativeScoreChange}
    />
    <!-- in:fly={{ y: 200 }}
    out:fly={{ y: -200 }} -->
  {:else if currentScreen === "playerResult"}
    <PlayerResult player={selectedPlayer} {pointsAdded} onNext={nextQuestion} />
    <!-- in:fade
    out:fade -->
  {:else if currentScreen === "final"}
    <FinalScreen {players} />
    <!-- in:fade out:fade -->
  {/if}
</div>
