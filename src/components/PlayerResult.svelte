<script lang="ts">
  import oktech from "../assets/oktech-logo.svg";
  export let player:
    | { id: number; name: string; avatar: string; score: number }
    | undefined
    | null;
  export let pointsAdded: number;
  export let answer: string; // Добавляем параметр ответа
  export let onNext: () => void;
</script>

<div class="result-container">
  <img src={oktech} class="logo" alt="logo" />
  <div class="bg1"></div>
  <div class="bg2"></div>

  {#if pointsAdded > 0}
    <!-- Положительный ответ: отображаем игрока, баллы и ответ -->
    <div class="player-info">
      <img
        class="avatar"
        src={player?.avatar}
        alt={player?.name}
        width="150"
        height="150"
      />
      <div class="points">+{pointsAdded}</div>
      <div class="answer-text">Ответ: {answer}</div>
      <!-- Добавляем текст ответа -->
    </div>
  {:else}
    <!-- Отрицательный ответ: только ответ -->
    <div class="answer-only">
      <div class="answer-text">Ответ: {answer}</div>
      <!-- Отображаем только ответ -->
    </div>
  {/if}

  <button on:click={onNext}>
    <div class="arrow">></div>
  </button>
</div>

<style>
  .avatar {
    position: absolute;
    width: 70vh;
    height: 70vh;
    border-radius: 150px;
    left: 20vh;
    margin-top: 5vh;
  }
  .arrow {
    transition: all 0.3s;
    height: 95%;
    font-size: 10vw;
    color: white;
  }
  .result-container {
    position: relative;
    height: 100vh;
  }

  .player-info {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .points {
    position: absolute;
    bottom: 15vh;
    display: flex;
    width: 80vh;
    padding: 0px 48px 2px 49px;
    justify-content: center;
    align-items: center;
    border-radius: 200px;
    background-color: #fff;
    color: black;
    font-size: 20vh;
    font-weight: 500;
  }

  .answer-text {
    margin-top: 10px;
    font-size: 72px;
    color: black;
    z-index: 1;
    background: white;
    padding: 16px;
    border-radius: 16px;
    max-width: 90%;
  }

  .answer-only {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  button {
    font-size: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    transition: all 0.3s;
    right: 7vw;
    bottom: 3vw;
    padding-left: 5vw;
    border-radius: 100%;
    background: black;
    border: none;
    width: 15vw;
    height: 15vw;
  }

  button:hover {
    background-color: #fff;
  }

  button:hover .arrow {
    color: #000000;
  }

  button:active {
    background-color: #ff7700;
  }

  button:active .arrow {
    color: #ffffff;
  }

  .bg1 {
    background-image: url("../assets/bg1.jpg");
    z-index: -1;
    animation: fade1 25s infinite;
  }

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

  .logo {
    position: absolute;
    right: 32px;
    top: 32px;
  }

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
