<script lang="ts">
  import oktech from "../assets/oktech-logo.svg";
  import mygame from "../assets/mygame.svg";

  export let onStartGame: () => void; // Тип функции для начала игры
  export let isLoading: boolean = false;
  export let hasError: boolean = false;

  function startGame() {
    if (onStartGame) {
      onStartGame();
    }
  }
</script>

<div class="container">
  <img class="mygame" src={mygame} alt="text" />
  <div class="logo">
    <img src={oktech} alt="logo" />
  </div>
  <button on:click={startGame} disabled={isLoading || hasError}>
    <div class="arrow">></div>
  </button>
  {#if hasError}
    <div class="error-message">Ошибка загрузки вопросов. Попробуйте позже.</div>
  {/if}
  <!-- <div class="content">
    <div class="name">
    </div>
  </div> -->
</div>

<style>
  .error-message {
    position: absolute;
    bottom: 20vh;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    background-color: rgba(255, 0, 0, 0.8);
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.2rem;
    text-align: center;
  }

  .mygame {
    display: block;
    width: 85%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .arrow {
    transition: all 0.3s;
    height: 95%;
    font-size: 10vw;
    color: white;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 45px 0 45px;
    max-height: 100%;
  }

  .container {
    height: 100vh;
    background: url("../assets/startBg.jpg") center / cover no-repeat;
  }
  button {
    font-size: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    transition: all 0.3s;
    right: 3vw;
    bottom: 3vw;
    padding-left: 5vw;
    border-radius: 100%;
    background: black;
    border: none;
    width: 15vw;
    height: 15vw;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

  .logo {
    position: absolute;
    top: 41px;
    left: 45px;
    height: 160px;
  }
  
  img {
    height: 100%;
  }
  .name {
    height: 80%;
    width: 85%;
  }
</style>
