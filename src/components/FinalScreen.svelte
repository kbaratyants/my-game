<script lang="ts">
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
  <div class="header">Итоги игры</div>
  {#each players as player}
    <div class="player {player.id === winner.id ? 'winner' : ''}">
      <img src={player.avatar} alt={player.name} />
      <span>{player.name}</span>
      <span class="score">{player.score} баллов</span>
    </div>
  {/each}
</div>

<style>
  .final-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }

  .player {
    display: flex;
    align-items: center;
    margin: 10px;
    font-size: 24px;
  }

  .winner {
    font-weight: bold;
    color: gold;
  }

  img {
    margin-right: 20px;
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
</style>
