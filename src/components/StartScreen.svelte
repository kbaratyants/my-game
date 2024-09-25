<script lang="ts">
  import { fly } from "svelte/transition";
  import oktech from "../assets/oktech.svg";
  import mygame from "../assets/mygame.svg";

  export let onStartGame: () => void; // Тип функции для начала игры

  function startGame() {
    if (onStartGame) {
      onStartGame();
    }
  }
</script>

<div class="container">
  <div class="content">
    <div class="logo">
      <img src={oktech} alt="logo" />
    </div>
    <div class="name">
      <img src={mygame} alt="text" />
      <button on:click={startGame}></button>
    </div>
  </div>
</div>

<style>
  img {
    display: block;
    height: 100%;
    width: 100%;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 45px 0 45px;
    max-height: 100%;
  }

  .container {
    height: 100vh;
    background: url("../assets/startBg.jpg") center / cover no-repeat;
  }
  button {
    font-size: 24px;
    padding: 10px 20px;
    cursor: pointer;
    position: absolute;

    right: 32px;
    bottom: 32px;
    border-radius: 100%;
    background: black;
    border: none;
  }
  .logo {
    height: 15%;
    align-self: baseline;
  }
  .name {
    height: 80%;
  }
</style>
