export type Character = {
  id: number;
  avatar: string;
  name: string;
}

export type Question = {
  answer: string;
  author?: string; // Если author не всегда присутствует
  points: number;
  question: string;
  selected: boolean;
  randomQuestion?: Question; // Для хранения случайного вопроса
};

export type Category = {
  name: string;
  questions: Question[];
};

export type QuestionsData = {
  categories: Category[];
};