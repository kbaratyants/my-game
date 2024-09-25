<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  export let categories: { name: string; questions: { points: number; selected: boolean }[] }[];
  export let onQuestionSelected: (question: string, points: number) => void;

  function selectQuestion(categoryIndex: number, questionIndex: number) {
    const question = categories[categoryIndex].questions[questionIndex];
    if (!question.selected) {
      question.selected = true;
      console.log(question);
      onQuestionSelected(`Вопрос из категории ${categories[categoryIndex]}`, question.points);
    }
  }
</script>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }

  .question {
    padding: 20px;
    background: black;
    color: white;
    text-align: center;
    cursor: pointer;
  }

  .question.selected {
    background: grey;
    cursor: not-allowed;
  }
</style>

<div class="board">
  {#each categories as category, i}
    <div class="category">
      <h3>{category.name}</h3>
      {#each category.questions as question, j}
        <div class="question {question.selected ? 'selected' : ''}" on:click={() => selectQuestion(i, j)}>
          {question.selected ? '---' : '+' + question.points}
        </div>
      {/each}
    </div>
  {/each}
</div>
