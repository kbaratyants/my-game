<script lang="ts">
  import oktech from "../assets/oktech-logo.svg";
  export let players: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  }[];

  // Находим игрока с максимальными баллами
  let winner = players.reduce((prev, current) =>
    prev.score > current.score ? prev : current
  );
</script>

<div class="final-container">
  <img src={oktech} class="logo" alt="logo" />
  <div class="bg1"></div>
  <div class="bg2"></div>
  <div class="header">Победитель</div>
  <div class="container">
    {#each players as player}
      <div class="character {player.id === winner.id ? 'selected' : ''}">
        <img src={player.avatar} alt={player.name} />
        <p>{player.name}</p>
        <span class="score">{player.score} баллов</span>
      </div>
    {/each}
  </div>

  <button class="active">начать новую игру</button>
</div>

<style>
  .final-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .container {
    display: flex;
    margin-bottom: 50px;
  }

  .character {
    cursor: pointer;
    margin: 10px;
    text-align: center;
    padding: 18px 18px 46px;
    padding: 18px;
    align-items: center;
    border-radius: 72px;
    background: rgba(0, 0, 0, 0.2);
    font-size: 32px;
    transition: background-color 0.3s;
  }

  .character img {
    width: 280px;
    height: 280px;
    border-radius: 56px;
  }

  .selected {
    background-color: black;
  }

  img {
    width: 100px;
    height: 100px;
  }

  .score {
    margin-left: 20px;
  }

  .header {
    font-size: 48px;
    margin-bottom: 20px;
  }

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

  .logo {
    position: absolute;
    right: 32px;
    top: 32px;
  }

  button {
    display: flex;
    justify-content: center;
    margin: 0 5% 0 5%;

    /* width: 80%; */
    padding: 36px 88px 42px 64px;
    font-size: 16px;

    border-radius: 120px;
    background: rgba(0, 0, 0, 0.2);
    border: none;

    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;

    text-align: center;
    font-family: Tektur;
    font-size: 70px;
    font-style: normal;
    font-weight: 500;
    transition: all 0.5s;
  }
  button.active {
    cursor: pointer;
    background: black;
    color: white;
  }

  button.active:hover {
    background: white;
    color: black;
  }

  button.active:hover {
    background: white;
    color: black;
  }

  button.active:active {
    background: #f70;
    color: black;
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
