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
  <img src={oktech} class="logo" alt="logo" on:click={() => window.location.reload()} />
  <div class="bg1"></div>
  <div class="bg2"></div>
  <div class="header">Победитель</div>
  <div class="players">
    {#each players as player}
      <div class="player">
        <img src={player.avatar} alt={player.name} width="100" height="100" />
        <div class="name">{player.name}</div>
        <div class="line"></div>
        <div class="player-score">{player.score}</div>
      </div>
    {/each}
  </div>

  <button class="active" on:click={() => window.location.reload()}
    >начать новую игру</button
  >
</div>

<style>
  .final-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 40px;
  }

  .player img {
    width: 200px;
    height: 200px;
    border-radius: 42px;
  }

  .line {
    width: 100%;
    height: 2px;
    background: white;
  }
  .container {
    display: flex;
    gap: 24px;
    margin-bottom: 50px;
  }
  .name {
    font-size: 26px;
    font-style: normal;
    font-weight: 500;
    line-height: 40px;
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

  .players {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
    gap: 24px;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 56px;
    background: black;
    padding: 20px;
    gap: 8px;
  }

  .character {
    cursor: pointer;
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
    width: 240px;
    height: 240px;
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
    font-size: 56px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .bg1 {
    background-image: url("../assets/bg1.jpg");
    z-index: -1;
    animation: fade1 10s infinite;
  }

  /* Второе изображение начнет с прозрачности */
  .bg2 {
    background-image: url("../assets/bg2.jpg");
    z-index: -2;
    animation: fade2 10s infinite;
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
    cursor: pointer;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 56px;
    padding: 0;
    height: 135px;

    border-radius: 120px;
    background: rgba(0, 0, 0, 0.2);
    border: none;

    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;

    font-family: Tektur;
    font-size: 80px;
    padding-bottom: 12px;
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
