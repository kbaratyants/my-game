<script lang="ts">
  import oktech from "../assets/oktech-logo.svg";
  import type { QuestionsData, Question } from "./types"; // Убедитесь, что Question импортируется из types

  export let categories: QuestionsData; // Указываем, что categories - это QuestionsData
  export let onQuestionSelected: (question: Question, points: number) => void;
  export let onGameEnd: () => void;
  export let players: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  }[];
  export let onPositiveScoreChange: (playerId: number) => void;
  export let onNegativeScoreChange: (playerId: number) => void;
  export let timer: number;

  function handleAddPoints(playerId: number) {
    onPositiveScoreChange(playerId);
  }

  function handleSubtractPoints(playerId: number) {
    onNegativeScoreChange(playerId);
  }

  function selectQuestion(categoryIndex: number, questionIndex: number) {
    const question =
      categories.categories[categoryIndex].questions[questionIndex]; // Обновляем доступ к вопросам
    if (!question.selected) {
      question.selected = true;
      onQuestionSelected(question, question.points);
    }
  }
</script>

<div class="board">
  <button class="end" on:click={onGameEnd}>Закончить игру</button>
  <div class="timer">{Math.floor(timer / 60)}:{(timer % 60 < 10 ? '0' : '') + (timer % 60)}</div>
  <div class="players">
    {#each players as player}
      <div class="player">
        <!-- <img src={player.avatar} alt={player.name} width="100" height="100" /> -->
        <div class="buttons">
          <button
            class="button"
            on:click={() => handleSubtractPoints(player.id)}
          >
            -
          </button>
          <button class="button" on:click={() => handleAddPoints(player.id)}>
            +
          </button>
        </div>
        <div class="line"></div>
        <div class="name">{player.name}</div>
        <div class="player-score">{player.score}</div>
      </div>
    {/each}
  </div>
  <img src={oktech} class="logo" alt="logo" />
  <div class="bg1"></div>
  <div class="bg2"></div>
  {#each categories.categories as category, i}
    <!-- Исправлено: добавлен доступ к categories -->
    <div class="category">
      <h3 class="category-name">{category.name}</h3>
      <div class="questions">
        {#each category.questions as question, j}
          <button
            class="question {question.selected ? 'selected' : ''}"
            on:click={() => selectQuestion(i, j)}
          >
            {"+" + question.points}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .timer {
    position: absolute;
    right: 5%;
    bottom: 24px;
    font-size: 48px;
    color: white;
  }
  
  .players {
    display: flex;
    gap: 30px;
    position: absolute;
    left: 30%;
    top: 20px;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    gap: 4px;
  }
  
  .player-score {
    font-size: 20px;
  }

  .button {
    background-color: transparent;
    border: 2px solid black;
    border-radius: 100%;
    color: black;
    font-size: 20px;
    padding: 4px;
    width: 40px;
    height: 40px;
    transition: all 0.3s;
  }
  .button:hover {
    background-color: black;
    color: white;
  }
  .end {
    position: absolute;
    left: 5%;
    top: 32px;
    border: 3px solid black;
    background: transparent;
    padding: 15px 20px;
    border-radius: 40px;
    font-size: 24px;
    color: black;
    transition: all 0.3s;
  }

  .end:hover {
    background-color: black;
    color: white;
  }
  h3 {
    margin: 0;
    display: block;
    font-size: 30px;
    font-weight: 600;
  }
  
  .name {
    font-size: 24px;
  }

  .category-name {
    font-size: 48px;
    flex: 1 0 360px;
  }
  .board {
    height: 72vh;
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
  }

  .category {
    display: flex;
    width: 90%;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
  }

  .questions {
    display: flex;
    justify-content: space-between;
    width: 80%;
    font-size: 1.5vw;
    font-weight: 600;
  }

  .question {
    border-radius: 64px;
    padding: 32px 40px;
    background: black;
    color: white;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 32px;
    border: none;
  }

  .question:hover {
    background-color: #fff;
    color: black;
  }

  .question:active {
    background-color: #ff7700;
    color: white;
  }

  .question.selected {
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
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
