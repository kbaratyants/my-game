<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import oktech from "../assets/oktech-logo.svg";
  import plus from "../assets/plus.svg";
  import minus from "../assets/minus.svg";
  import type { Question } from "./types";

  export let question: Question | null;
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

  let timer = 20;
  let interval: number;
  let playerWithNegativeScore:
    | { id: number; name: string; avatar: string; score: number }
    | null
    | undefined = null;

  // Функция для сброса таймера
  function resetTimer() {
    clearInterval(interval);
    timer = 20;
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
  <img src={oktech} alt="logo" class="logo" />
  <div class="bg1"></div>
  <div class="bg2"></div>
  <div class="wrapper">
    <div class="question-text">{question?.question}</div>
    <div class="wrapper-2">
      <div class="timer">{timer}</div>
      <button class="skip" on:click={onSkip}>Пропустить</button>
    </div>
  </div>

  <div class="players">
    {#each players as player}
      <div class="player">
        <img src={player.avatar} alt={player.name} width="100" height="100" />
        <div class="buttons">
          <button
            class="button"
            on:click={() => handleSubtractPoints(player.id)}
            ><img src={minus} alt="" />
          </button>
          <div class="score">{question?.points}</div>
          <button class="button" on:click={() => handleAddPoints(player.id)}
            ><img src={plus} alt="" /></button
          >
        </div>
        <div class="line"></div>
        <div class="name">{player.name}</div>
        <div class="player-score">{player.score}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    gap: 30px;
  }
  .name {
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 48px;
  }
  .player-score {
    font-size: 36px;
    font-style: normal;
    font-weight: 500;
    line-height: 42px;
  }
  .line {
    width: 100%;
    height: 2px;
    background: white;
  }
  .logo {
    position: absolute;
    right: 32px;
    top: 32px;
  }

  /* Первое изображение начнет с полной видимости */
  .bg1 {
    background-image: url("../assets/bg1.jpg");
    z-index: -1;
    animation: fade1 25s infinite;
  }

  /* Второе изображение начнет с прозрачности */
  .bg2 {
    background-image: url("../assets/bg2.jpg");
    z-index: -2;
    animation: fade2 25s infinite;
  }

  .bg1,
  .bg2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 28px 91px 60px 33px;
    flex-shrink: 1;
  }

  .question-text {
    margin-bottom: 20px;
    border-radius: 50px;
    background: var(--Black, #000);
    padding: 32px;

    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 40px;
  }

  .timer {
    font-size: 48px;
    display: flex;
    height: 240px;
    width: 240px;
    padding: 35px 20px;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    background: #000;
    flex: 0 0 240px;
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
    border-radius: 56px;
    background: black;
    padding: 20px;
  }

  .player img {
    width: 200px;
    height: 200px;
    border-radius: 42px;
  }

  .buttons {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 10px;
  }

  .buttons img {
    width: 100%;
    height: 100%;
  }

  .button {
    cursor: pointer;
    /* padding: 5px; */
    width: 48px;
    height: 48px;
    background-color: transparent;
    border: none;
  }

  .score {
    font-size: 56px;
    font-style: normal;
    font-weight: 600;
    line-height: 56px; /* 100% */
  }

  .wrapper-2 {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-evenly;
  }

  .skip {
    padding: 20px;
    background: black;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    font-size: 24px;
  }

  .negative-message {
    margin-top: 20px;
    font-size: 18px;
    color: red;
  }

  /* Анимация плавного перехода */
  @keyframes fade1 {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  /* Анимация плавного перехода */
  @keyframes fade2 {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
</style>
