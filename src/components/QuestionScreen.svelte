<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  export let question: string;
  export let points: number;
  export let players: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  }[];
  export let onSkip: () => void;
  export let onPositiveScoreChange: (playerId: number, points: number) => void;
  export let onNegativeScoreChange: (playerId: number) => void;

  let timer = 10;
  let interval: number;
  let playerWithNegativeScore: { id: number; name: string; avatar: string; score: number; } | null | undefined = null;

  // Функция для сброса таймера
  function resetTimer() {
    clearInterval(interval);
    timer = 10;
    startTimer();
  }

  // Запуск таймера
  function startTimer() {
    interval = setInterval(() => {
      if (timer > 0) {
        timer--;
      } else {
        clearInterval(interval);
        // onSkip(); // Таймер завершен, пропускаем вопрос
      }
    }, 1000);
  }

  onMount(() => {
    startTimer();
  });

  onDestroy(() => {
    clearInterval(interval); // Очищаем интервал при демонтировании компонента
  });

  function handleAddPoints(playerId: number) {
    clearInterval(interval); // Останавливаем таймер при правильном ответе
    onPositiveScoreChange(playerId, points);
  }

  function handleSubtractPoints(playerId: number) {
    playerWithNegativeScore = players.find((player) => player.id === playerId);
    onNegativeScoreChange(playerId);
    // Таймер не сбрасывается при неправильном ответе
  }
</script>

<div class="question-container">
  <div class="question-text">{question}</div>
  <div class="timer">{timer}</div>

  {#if playerWithNegativeScore}
    <div class="negative-message">
      У игрока {playerWithNegativeScore.name} вычтено {points} баллов.
    </div>
  {/if}

  <div class="players">
    {#each players as player}
      <div class="player">
        <img src={player.avatar} alt={player.name} width="100" height="100" />
        <div>{player.name}</div>
        <div class="buttons">
          <button
            class="button"
            on:click={() => handleSubtractPoints(player.id)}>-</button
          >
          <button class="button" on:click={() => handleAddPoints(player.id)}
            >+</button
          >
        </div>
      </div>
    {/each}
  </div>

  <button class="skip" on:click={onSkip}>Пропустить</button>
</div>

<style>
  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }

  .question-text {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .timer {
    font-size: 48px;
  }

  .players {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 20px;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
  }

  .buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }

  .button {
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
  }

  .skip {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .negative-message {
    margin-top: 20px;
    font-size: 18px;
    color: red;
  }
</style>
