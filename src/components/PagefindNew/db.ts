import Dexie, { type Table } from 'dexie';

export interface HistoryItem {
  timestamp: number;
  word: string;
}

class MyDatabase extends Dexie {
  history!: Table<HistoryItem>;

  constructor() {
    super('HistoryIndex');
    this.version(1).stores({
      history: 'timestamp, word'
    });
  }
}

export const db = new MyDatabase();
