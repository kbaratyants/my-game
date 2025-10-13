<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import StartScreen from "./components/StartScreen.svelte";
  import CharacterSelect from "./components/CharacterSelect.svelte";
  import QuestionBoard from "./components/QuestionBoard.svelte";
  import QuestionScreen from "./components/QuestionScreen.svelte";
  import PlayerResult from "./components/PlayerResult.svelte";
  import FinalScreen from "./components/FinalScreen.svelte";
  import { characters } from "./mocks/chatracters";
  import { onDestroy } from "svelte";
  import type { Character } from "./components/types";
  
  // Импортируем стор
  import {
    currentScreen,
    categories,
    players,
    currentQuestion,
    currentPoints,
    currentAnswer,
    showAnswer,
    selectedPlayer,
    pointsAdded,
    isLoading,
    hasError,
    timer,
    getRandomQuestions,
    startGame,
    selectCharacters,
    selectQuestion,
    handleCorrectAnswer,
    handleWrongAnswer,
    skipQuestion,
    nextQuestion,
    endGame,
    addPlayerScore,
    subtractPlayerScore
  } from "./stores/gameStore";

  let abortController = new AbortController();

  const fetchQuestions = async () => {
    console.log("fetchQuestions");
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyRUgQaRd2rx6wCHEU0e-9xXSukyNhu9EmoPcO6fD0Mpkb9ac5DA7_YzOFfDVRna6Vo/exec",
        { signal: abortController.signal }
      );
      const data = await res.json();
      categories.set(getRandomQuestions(data));
    } catch (err) {
      hasError.set(true);
    } finally {
      isLoading.set(false);
    }
  };

  fetchQuestions();

  onDestroy(() => {
    abortController.abort();
  });

  let interval: number;

  // Функция для запуска таймера
  function startTimer() {
    interval = setInterval(() => {
      timer.update(t => {
        if (t > 0) {
          return t - 1;
        } else {
          clearInterval(interval);
          return t;
        }
      });
    }, 1000);
  }

  onDestroy(() => {
    clearInterval(interval); // Очищаем интервал при демонтировании компонента
  });

  function handleCharacterSelect(selectedCharacters: Character[]) {
    selectCharacters(selectedCharacters);
    startTimer();
  }
</script>

<div class="container">
  {#if $currentScreen === "start"}
    <StartScreen onStartGame={startGame} isLoading={$isLoading} hasError={$hasError} />
  {:else if $currentScreen === "characterSelect"}
    <CharacterSelect {characters} onConfirm={handleCharacterSelect} />
  {:else if $currentScreen === "questionBoard"}
    <QuestionBoard
      timer={$timer}
      players={$players}
      onPositiveScoreChange={(playerId) => {
        addPlayerScore(playerId, 100);
      }}
      onNegativeScoreChange={(playerId) => {
        subtractPlayerScore(playerId, 100);
      }}
      onGameEnd={endGame}
      categories={$categories || { categories: [] }}
      onQuestionSelected={selectQuestion}
    />
  {:else if $currentScreen === "questionScreen"}
    <QuestionScreen
      question={$currentQuestion}
      points={$currentPoints}
      players={$players}
      onSkip={skipQuestion}
      onPositiveScoreChange={(playerId, points) => handleCorrectAnswer(playerId, points)}
      onNegativeScoreChange={(playerId) => handleWrongAnswer(playerId, $currentPoints)}
    />
  {:else if $currentScreen === "playerResult"}
    <PlayerResult
      player={$selectedPlayer}
      pointsAdded={$pointsAdded}
      answer={$currentAnswer}
      onNext={nextQuestion}
    />
  {:else if $currentScreen === "final"}
    <FinalScreen players={$players} />
  {/if}
</div>