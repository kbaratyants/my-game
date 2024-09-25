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

  let currentScreen:
    | "start"
    | "characterSelect"
    | "questionBoard"
    | "questionScreen"
    | "playerResult"
    | "final" = "start";
  let currentQuestion = "";
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

  let categories = [
    {
      name: "Браузер",
      questions: [
        { points: 100, selected: false },
        { points: 200, selected: false },
        { points: 300, selected: false },
        { points: 400, selected: false },
        { points: 500, selected: false },
      ],
    },
    {
      name: "Javascript",
      questions: [
        { points: 100, selected: false },
        { points: 200, selected: false },
        { points: 300, selected: false },
        { points: 400, selected: false },
        { points: 500, selected: false },
      ],
    },
  ];

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

  function handleQuestionSelection(question: string, points: number) {
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
    const allQuestionsSelected = categories.every((category) =>
      category.questions.every((q) => q.selected)
    );

    console.log({ allQuestionsSelected });
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
