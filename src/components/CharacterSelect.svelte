<script lang="ts">
  import type { Character } from "./types";
  import oktech from "../assets/oktech-logo.svg";

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
  <img src={oktech} class="logo" alt="logo" on:click={() => window.location.reload()} />
  <div class="bg1"></div>
  <div class="bg2"></div>
  <div class="text">
    <div class="choose">Выбери от 2 до 5 игроков</div>
    <div class="counter">
      <span class="number" class:active={selectedCharacters.length}>{selectedCharacters.length}</span> / 5
    </div>
  </div>
  <div
    class="container">
    {#each characters as character}
      <div
        class="character {selectedCharacters.includes(character)
          ? 'selected'
          : ''}"
        on:click={() => selectCharacter(character)}
      >
        <img src={character.avatar} alt={character.name} />
        <div>{character.name}</div>
      </div>
    {/each}
  </div>

  <button class:active={selectedCharacters.length >= 2} on:click={confirmSelection}>начать игру</button>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 60px;    
    height: 100vh;
  }
  
  .number {
    color: rgba(255, 255, 255, 0.30);
  }
  
  .number.active {
    color: white;
  }


  .logo {
    position: absolute;
    right: 32px;
    top: 32px;
    cursor: pointer;
  }
  .text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 120px 0 40px;
  }

  /* Первое изображение начнет с полной видимости */
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

  .choose,
  .counter {
    color: black;
    font-family: Tektur;
    font-size: 56px;
    font-style: normal;
    font-weight: 500;
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 10px 40px;
  }
  .character {
    cursor: pointer;
    margin: 10px;
    text-align: center;
    padding: 18px;
    padding-bottom: 22px;
    align-items: center;
    border-radius: 42px;
    background: rgba(0, 0, 0, 0.2);
    font-size: 24px;
    transition: background-color 0.3s;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  /* Стили для самого скроллбара */
  .container::-webkit-scrollbar {
    display: none;
  }

  .character img {
    width: 170px;
    height: 170px;
    border-radius: 28px;
  }

  .selected {
    background-color: black;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 40px 0 40px;
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
    background: #F70;
    color: black;
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
