import Dexie from 'dexie';

const db = new Dexie('HistoryIndex');
db.version(1).stores({
  history: 'timestamp'
});

export default function saveHistory(word: string) {

}