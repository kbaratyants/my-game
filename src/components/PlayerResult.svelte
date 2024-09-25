<script lang="ts">
  export let player: { id: number, name: string, avatar: string, score: number } | undefined | null;
  export let pointsAdded: number;
  export let onNext: () => void;
</script>

<style>
  .result-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }

  .player-info {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .points {
    font-size: 48px;
    margin-top: 20px;
  }

  .next {
    margin-top: 20px;
    font-size: 24px;
    padding: 10px 20px;
    cursor: pointer;
  }
</style>

<div class="result-container">
  <div class="player-info">
    <img src={player?.avatar} alt={player?.name} width="150" height="150" />
    <h2>{player?.name}</h2>
    <div class="points">
      {pointsAdded > 0 ? `+${pointsAdded}` : `${pointsAdded}`} очков
    </div>
  </div>
  <button class="next" on:click={onNext}>Следующий вопрос</button>
</div>
