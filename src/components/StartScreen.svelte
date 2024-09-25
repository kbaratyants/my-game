<script lang="ts">
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
      <button on:click={startGame}>
        <div class="arrow">></div>
      </button>
    </div>
  </div>
</div>

<style>
  img {
    display: block;
    height: 100%;
    width: 100%;
  }

  .arrow {
    transition: all 0.3s;
    height: 95%;
    font-size: 10vw;
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

  .logo {
    width: 20%;
    align-self: baseline;
  }
  .name {
    height: 80%;
    width: 85%;
  }
</style>
