<script lang="ts">
  import oktech from "../assets/oktech-logo.svg";
  import plus from "../assets/plus.svg";
  import minus from "../assets/minus.svg";
  import type { Question } from "./types";

  export let question: Question | null;
  export let points: number;
  export let players: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  }[];
  export let onSkip: () => void;
  export let onPositiveScoreChange: (playerId: number, points: number) => void;
  export let onNegativeScoreChange: (playerId: number) => void;

  // Состояние загрузки изображения
  let imageLoading = false;
  let imageError = false;

  // Сброс состояния при смене вопроса
  $: if (question?.image) {
    imageLoading = true;
    imageError = false;
    // Предзагрузка изображения
    preloadImage(question.image);
  }

  // Функция предзагрузки изображения
  function preloadImage(imageUrl: string) {
    const img = new Image();
    img.onload = () => {
      imageLoading = false;
      imageError = false;
    };
    img.onerror = () => {
      imageLoading = false;
      imageError = true;
    };
    img.src = getThumbnailUrl(imageUrl);
  }

  let playerWithNegativeScore:
    | { id: number; name: string; avatar: string; score: number }
    | null
    | undefined = null;

  let maxNumber = players.length; // Максимальное значение для генерации случайного числа
  let randomValue = 0; // Случайное число, которое мы будем генерировать

  // Функция для преобразования ссылки Cloud Mail.ru в рабочую ссылку на миниатюру
  function getThumbnailUrl(originalUrl: string): string {
    if (!originalUrl) return '';
    
    // Проверяем, является ли это ссылкой Cloud Mail.ru
    if (originalUrl.startsWith('https://cloud.mail.ru/public/')) {
      // Извлекаем ID из URL: https://cloud.mail.ru/public/iyPk/kDmff75nQ
      const match = originalUrl.match(/https:\/\/cloud\.mail\.ru\/public\/([^\/]+)\/([^\/\?]+)/);
      if (match) {
        const [, folderId, fileId] = match;
        // Создаем ссылку на миниатюру: https://thumb.cloud.mail.ru/weblink/thumb/xw1/iyPk/kDmff75nQ
        return `https://thumb.cloud.mail.ru/weblink/thumb/xw1/${folderId}/${fileId}`;
      }
    }
    
    // Если это не Cloud Mail.ru, возвращаем как есть
    return originalUrl;
  }


  // Функция для генерации случайного числа от 1 до maxNumber
  function generateRandomNumber() {
    randomValue = Math.floor(Math.random() * maxNumber) + 1;
  }

  function handleAddPoints(playerId: number) {
    onPositiveScoreChange(playerId, points);
  }

  function handleSubtractPoints(playerId: number) {
    playerWithNegativeScore = players.find((player) => player.id === playerId);
    onNegativeScoreChange(playerId);
  }
</script>

<div class="question-container">
  <button class="logo" on:click={() => window.location.reload()} aria-label="Перезагрузить игру">
    <img src={oktech} alt="logo" />
  </button>
  <div class="bg1"></div>
  <div class="bg2"></div>
  <div class="wrapper">
    <div class="question-content">
      <div class="question-text">{question?.question}</div>
      {#if question?.image}
        <div class="question-image">
          {#if imageLoading}
            <div class="image-loader">
              <div class="spinner"></div>
              <p>Загрузка изображения...</p>
            </div>
          {:else if imageError}
            <div class="image-error">
              <p>Ошибка загрузки изображения</p>
            </div>
          {:else}
            <img 
              src={getThumbnailUrl(question.image)} 
              alt="Изображение к вопросу"
            />
          {/if}
        </div>
      {/if}
    </div>
    <div class="wrapper-2">
      <button class="skip" on:click={onSkip}>пропустить</button>
    </div>
  </div>

  <div class="players">
    {#each players as player}
      <div class="player">
        <img src={player.avatar} alt={player.name} width="100" height="100" />
        <div class="buttons">
          <button
            class="button"
            on:click={() => handleSubtractPoints(player.id)}
          >
            <img src={minus} alt="" />
          </button>
          <div class="score">{question?.points}</div>
          <button class="button" on:click={() => handleAddPoints(player.id)}>
            <img src={plus} alt="" />
          </button>
        </div>
        <div class="line"></div>
        <div class="nameandscore">
          <div class="name">{player.name}</div>
          <div class="player-score">{player.score}</div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Добавляем поле для ввода максимального значения и кнопку для генерации случайного числа -->
  <div class="random-number-container">
    <input
      bind:value={maxNumber}
      min="1"
      class="input"
    />
    <button on:click={generateRandomNumber}
      >Сгенерировать случайное число</button
    >
    {#if randomValue}
      <div class="random-result">Случайное число: {randomValue}</div>
    {/if}
  </div>
</div>

<style>
  .nameandscore {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .wrapper {
    display: flex;
    gap: 30px;
  }

  .random-number-container {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
    margin-top: 50px;
  }

  .random-number-container input {
    padding: 10px;
    font-size: 80px;
    border-radius: 100%;
    text-align: center;
    border: none;
    width: 120px;
    height: 120px;
    font-weight: 500;
  }
  
  input:focus {
    outline: none;
  }

  .random-number-container button {
    padding: 10px 20px;
    font-size: 24px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 32px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .random-number-container button:hover {
    background-color: white;
    color: black;
  }

  .random-result {
    margin-top: 10px;
    font-size: 32px;
    color: black;
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

  .logo {
    position: absolute;
    right: 32px;
    top: 32px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  .logo img {
    width: 100%;
    height: 100%;
  }

  .bg1 {
    background-image: url("../assets/bg1.jpg");
    z-index: -1;
    animation: fade1 10s infinite;
  }

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

  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 28px 91px 60px 33px;
    flex-shrink: 1;
  }

  .question-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .question-text {
    border-radius: 50px;
    background: var(--Black, #000);
    padding: 32px;
    color: white;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 40px;
    text-align: center;
  }

  .question-image {
    max-width: 100%;
    max-height: 400px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;
    margin: 10px 0;
  }

  .question-image img {
    width: 100%;
    height: 100%;
    max-height: 380px;
    object-fit: contain;
    display: block;
    border-radius: 10px;
  }

  .image-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: white;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #ff7700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .image-error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #ff6b6b;
    text-align: center;
  }

  .players {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 40px;
    gap: 24px;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    border-radius: 56px;
    background: black;
    padding: 20px;
  }

  .player img {
    width: 200px;
    height: 200px;
    border-radius: 42px;
  }

  .buttons {
    display: flex;
    width: 100%;
    gap: 12px;
    margin-top: 10px;
  }

  .buttons img {
    width: 100%;
    height: 100%;
  }

  .button {
    cursor: pointer;
    width: 48px;
    height: 48px;
    background-color: transparent;
    border: none;
  }

  .score {
    font-size: 42px;
    font-style: normal;
    font-weight: 600;
    line-height: 56px;
  }

  .wrapper-2 {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-evenly;
  }

  .skip {
    padding: 20px;
    background: black;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: white;
    font-weight: 600;
    transition: all 0.3s;
  }

  .skip:hover {
    background: white;
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
