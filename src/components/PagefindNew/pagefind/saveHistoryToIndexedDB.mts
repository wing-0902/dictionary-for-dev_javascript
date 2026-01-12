import Dexie from 'dexie';

const db = new Dexie('HistoryIndex');
db.version(1).stores({
  history: 'timestamp'
});

export default async function saveHistory(word: string) {
  await db.table('history').add({
    timestamp: Date.now(),
    word: word
  });
}