import { writable, derived } from 'svelte/store';
import type { Character, Question, Category, QuestionsData } from '../components/types';

/**
 * Централизованный стор для управления состоянием игры "Своя игра"
 * 
 * Содержит все состояния игры, функции для их изменения и производные значения.
 * Используется во всех компонентах для синхронизации данных.
 */

// ==================== ОСНОВНЫЕ СОСТОЯНИЯ ИГРЫ ====================

/**
 * Текущий экран приложения
 * Возможные значения: start, characterSelect, questionBoard, questionScreen, playerResult, final
 */
export const currentScreen = writable<'start' | 'characterSelect' | 'questionBoard' | 'questionScreen' | 'playerResult' | 'final'>('start');

/**
 * Загруженные категории вопросов с рандомизированным выбором
 * null - данные еще не загружены
 */
export const categories = writable<QuestionsData | null>(null);

/**
 * Список игроков с их очками
 * Обновляется при каждом изменении счета
 */
export const players = writable<{ id: number; name: string; avatar: string; score: number }[]>([]);

// ==================== ТЕКУЩИЙ ВОПРОС ====================

/**
 * Вопрос, который сейчас отображается на экране
 * null - вопрос не выбран
 */
export const currentQuestion = writable<Question | null>(null);

/**
 * Количество очков за текущий вопрос
 */
export const currentPoints = writable<number>(0);

/**
 * Правильный ответ на текущий вопрос
 */
export const currentAnswer = writable<string>('');

/**
 * Показывать ли ответ на экран
 * true - ответ отображается, false - скрыт
 */
export const showAnswer = writable<boolean>(false);

// ==================== РЕЗУЛЬТАТЫ ИГРЫ ====================

/**
 * Игрок, который правильно ответил на вопрос
 * null - никто не ответил правильно или вопрос пропущен
 */
export const selectedPlayer = writable<{ id: number; name: string; avatar: string; score: number } | null>(null);

/**
 * Количество очков, добавленных за правильный ответ
 * 0 - очки не добавлены (неправильный ответ или пропуск)
 */
export const pointsAdded = writable<number>(0);

// ==================== СОСТОЯНИЕ ЗАГРУЗКИ ====================

/**
 * Идет ли загрузка данных с сервера
 */
export const isLoading = writable<boolean>(true);

/**
 * Произошла ли ошибка при загрузке данных
 */
export const hasError = writable<boolean>(false);

// ==================== ТАЙМЕР ====================

/**
 * Оставшееся время игры в секундах
 * 600 секунд = 10 минут
 */
export const timer = writable<number>(600);

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С ВОПРОСАМИ ====================

/**
 * Создает рандомизированный набор вопросов для игры
 * 
 * Для каждой категории выбирает по одному случайному вопросу каждого уровня сложности (очков)
 * 
 * @param data - исходные данные с сервера
 * @returns рандомизированные данные для игры
 */
export function getRandomQuestions(data: QuestionsData): QuestionsData {
  const result: QuestionsData = { categories: [] };

  data.categories.forEach((category: Category) => {
    const pointsMap: { [key: number]: Question[] } = {};

    category.questions.forEach((question: Question) => {
      const points = question.points;
      if (!pointsMap[points]) {
        pointsMap[points] = [];
      }
      pointsMap[points].push(question);
    });

    const selectedQuestions: Question[] = [];
    for (const points in pointsMap) {
      const questionsWithSamePoints = pointsMap[points];
      const randomQuestion =
        questionsWithSamePoints[
          Math.floor(Math.random() * questionsWithSamePoints.length)
        ];
      selectedQuestions.push({ ...randomQuestion, selected: false });
    }

    result.categories.push({ ...category, questions: selectedQuestions });
  });

  return result;
}

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С ИГРОКАМИ ====================

/**
 * Добавляет очки игроку
 * 
 * @param playerId - ID игрока
 * @param points - количество очков для добавления
 */
export function addPlayerScore(playerId: number, points: number) {
  players.update(playersList => 
    playersList.map(player => 
      player.id === playerId 
        ? { ...player, score: player.score + points }
        : player
    )
  );
}

/**
 * Вычитает очки у игрока
 * 
 * @param playerId - ID игрока
 * @param points - количество очков для вычитания
 */
export function subtractPlayerScore(playerId: number, points: number) {
  players.update(playersList => 
    playersList.map(player => 
      player.id === playerId 
        ? { ...player, score: player.score - points }
        : player
    )
  );
}

// ==================== ФУНКЦИИ ДЛЯ НАВИГАЦИИ ====================

/**
 * Устанавливает текущий экран приложения
 * 
 * @param screen - экран для перехода
 */
export function setCurrentScreen(screen: 'start' | 'characterSelect' | 'questionBoard' | 'questionScreen' | 'playerResult' | 'final') {
  currentScreen.set(screen);
}

/**
 * Начинает игру - переходит к выбору персонажей
 */
export function startGame() {
  setCurrentScreen('characterSelect');
}

/**
 * Выбирает персонажей для игры и инициализирует игроков
 * 
 * @param selectedCharacters - массив выбранных персонажей
 */
export function selectCharacters(selectedCharacters: Character[]) {
  const newPlayers = selectedCharacters.map((character) => ({
    id: character.id,
    name: character.name,
    avatar: character.avatar,
    score: 0,
  }));
  players.set(newPlayers);
  setCurrentScreen('questionBoard');
}

/**
 * Выбирает вопрос для отображения
 * 
 * Устанавливает текущий вопрос, его очки и ответ, сбрасывает состояние результата
 * Помечает вопрос как выбранный в категориях
 * 
 * @param question - выбранный вопрос
 * @param points - очки за вопрос
 */
export function selectQuestion(question: Question, points: number) {
  currentQuestion.set(question);
  currentPoints.set(points);
  currentAnswer.set(question.answer);
  showAnswer.set(false);
  selectedPlayer.set(null);
  pointsAdded.set(0);
  
  // Помечаем вопрос как выбранный
  categories.update(cats => {
    if (!cats) return cats;
    return {
      ...cats,
      categories: cats.categories.map(category => ({
        ...category,
        questions: category.questions.map(q => 
          q === question ? { ...q, selected: true } : q
        )
      }))
    };
  });
  
  setCurrentScreen('questionScreen');
}

/**
 * Обрабатывает правильный ответ игрока
 * 
 * Добавляет очки игроку, устанавливает его как выбранного, показывает ответ
 * и переходит к экрану результата
 * 
 * @param playerId - ID игрока, который правильно ответил
 * @param points - очки за правильный ответ
 */
export function handleCorrectAnswer(playerId: number, points: number) {
  addPlayerScore(playerId, points);
  
  // Получаем обновленного игрока
  players.subscribe(playersList => {
    const player = playersList.find(p => p.id === playerId);
    selectedPlayer.set(player || null);
  })();
  
  pointsAdded.set(points);
  showAnswer.set(true);
  setCurrentScreen('playerResult');
}

/**
 * Обрабатывает неправильный ответ игрока
 * 
 * Вычитает очки у игрока, сбрасывает выбранного игрока, показывает ответ
 * и переходит к экрану результата
 * 
 * @param playerId - ID игрока, который неправильно ответил
 * @param points - очки для вычитания
 */
export function handleWrongAnswer(playerId: number, points: number) {
  subtractPlayerScore(playerId, points);
  selectedPlayer.set(null);
  pointsAdded.set(0);
  showAnswer.set(true);
}

/**
 * Пропускает текущий вопрос
 * 
 * Показывает ответ, сбрасывает выбранного игрока и переходит к экрану результата
 */
export function skipQuestion() {
  showAnswer.set(true);
  selectedPlayer.set(null);
  pointsAdded.set(0);
  setCurrentScreen('playerResult');
}

/**
 * Переходит к следующему вопросу или завершает игру
 * 
 * Проверяет, все ли вопросы выбраны. Если да - переходит к финальному экрану,
 * иначе - возвращается к доске вопросов
 */
export function nextQuestion() {
  categories.update(cats => {
    if (!cats) return cats;
    
    const allQuestionsSelected = cats.categories.every(category =>
      category.questions.every(q => q.selected)
    );
    
    if (allQuestionsSelected) {
      setCurrentScreen('final');
    } else {
      setCurrentScreen('questionBoard');
    }
    
    return cats;
  });
}

/**
 * Завершает игру
 * 
 * Переходит к финальному экрану с результатами
 */
export function endGame() {
  setCurrentScreen('final');
}

// ==================== ПРОИЗВОДНЫЕ ЗНАЧЕНИЯ ====================

/**
 * Проверяет, выбраны ли все вопросы
 * 
 * Возвращает true, если во всех категориях все вопросы помечены как выбранные
 */
export const allQuestionsSelected = derived(categories, $categories => {
  if (!categories) return false;
  return $categories?.categories.every(category =>
    category.questions.every(q => q.selected)
  ) || false;
});

/**
 * Статистика игры
 * 
 * Содержит общее количество игроков, общую сумму очков и лидера
 */
export const gameStats = derived(players, $players => ({
  totalPlayers: $players.length,
  totalScore: $players.reduce((sum, player) => sum + player.score, 0),
  leader: $players.reduce((leader, player) => 
    player.score > leader.score ? player : leader
  , $players[0] || { score: -Infinity })
}));
