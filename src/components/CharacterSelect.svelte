<script lang="ts">
  import type { Character } from "./types";

  export let characters: { id: number; name: string; avatar: string }[];
  export let onConfirm: (
    selectedCharacters: { id: number; name: string; avatar: string }[]
  ) => void;

  let selectedCharacters: Character[] = [];

  function selectCharacter(character: Character) {
    if (selectedCharacters.includes(character)) {
      selectedCharacters = selectedCharacters.filter(
        (c) => c.id !== character.id
      );
    } else if (selectedCharacters.length < 5) {
      selectedCharacters = [...selectedCharacters, character];
    }
  }

  function confirmSelection() {
    if (selectedCharacters.length >= 2) {
      onConfirm(selectedCharacters);
    } else {
      alert("Выберите минимум двух игроков!");
    }
  }
</script>

<div class="wrap">
  <div class="bg1"></div>
  <div class="bg2"></div>
  <div class="text">
    <div class="choose">Выбери от 2 до 5 игроков</div>
    <div class="counter">
      {selectedCharacters.length} / 5
    </div>
  </div>
  <div class="container">
    {#each characters as character}
      <div
        class="character {selectedCharacters.includes(character)
          ? 'selected'
          : ''}"
        on:click={() => selectCharacter(character)}
      >
        <img src={character.avatar} alt={character.name} />
        <p>{character.name}</p>
      </div>
    {/each}
  </div>

  <button on:click={confirmSelection}>начать игру</button>
</div>

<style>
  .text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 60px 0 40px;
  }
  
  /* Первое изображение начнет с полной видимости */
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

  .choose, .counter {
    color: black;
    font-family: Tektur;
    font-size: 80px;
    font-style: normal;
    font-weight: 600;
    line-height: 96px; /* 120% */
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

  .container {
    display: flex;
    overflow: scroll;
    overflow-y: hidden; /* Отключить вертикальный скроллбар */
  }
  .character {
    cursor: pointer;
    margin: 10px;
    text-align: center;
    padding: 18px;
    align-items: center;
    border-radius: 72px;
    background: rgba(0, 0, 0, 0.2);
    font-size: 32px;
  }

  /* Стили для самого скроллбара */
  .container::-webkit-scrollbar {
    height: 40px; /* Ширина скроллбара */
  }

  /* Стили для ползунка (thumb) */
  .container::-webkit-scrollbar-thumb {
    background-color: white; /* Цвет ползунка */
    background-clip: padding-box; /* Корректировка границ */
  }

  /* Стили для фона скроллбара */
  .container::-webkit-scrollbar-track {
    background-color: black; /* Цвет фона */
  }

  .character img {
    width: 280px;
    height: 280px;
    border-radius: 56px;
  }

  .selected {
    border: 2px solid green;
  }

  button {
    display: flex;

    width: 80%;
    margin-top: 20px;
    padding: 36px 88px 42px 64px;
    font-size: 16px;

    border-radius: 120px;
    background: rgba(0, 0, 0, 0.2);

    color: rgba(255, 255, 255, 0.3);

    text-align: center;
    font-family: Tektur;
    font-size: 104px;
    font-style: normal;
    font-weight: 500;
  }

  /* Анимация плавного перехода */
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
