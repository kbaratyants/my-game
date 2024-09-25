<script lang="ts">
  import oktech from "../assets/oktech-logo.svg";

  type Question = {
    answer: string;
    author: string;
    points: number;
    question: string;
    selected: boolean;
  };

  export let categories: {
    name: string;
    questions: Question[];
  }[];
  export let onQuestionSelected: (question: Question, points: number) => void;

  function selectQuestion(categoryIndex: number, questionIndex: number) {
    const question = categories[categoryIndex].questions[questionIndex];
    if (!question.selected) {
      question.selected = true;
      onQuestionSelected(question, question.points);
    }
  }
</script>

<div class="board">
  <img src={oktech} class="logo" alt="logo" />
  <div class="bg1"></div>
  <div class="bg2"></div>
  {#each categories as category, i}
    <div class="category">
      <h3>{category.name}</h3>
      <div class="questions">
        {#each category.questions as question, j}
          <div
            class="question {question.selected ? 'selected' : ''}"
            on:click={() => selectQuestion(i, j)}
          >
            {"+" + question.points}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  h3 {
    margin: 0;
    display: block;
    font-size: 30px;
    font-weight: 600;
  }
  .board {
    height: 60vh;
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
  }

  .questions {
    display: flex;
    width: 80%;
    gap: 10px;
    font-size: 1.5vw;
    font-weight: 600;
  }

  .question {
    border-radius: 50px;
    padding: 20px;
    background: black;
    color: white;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
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
