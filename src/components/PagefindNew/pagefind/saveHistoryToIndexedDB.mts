import Dexie from 'dexie';

const db = new Dexie('HistoryIndex');
db.version(1).stores({
  history: 'timestamp, word'
});

export default async function saveHistory(word: string) {
  // トランザクションを使って一連の処理を安全に行う
  await db.transaction('readwrite', db.table('history'), async () => {
    
    // 1. もし既に同じ言葉があれば削除する
    // .where('word').equals(word) で検索して一括削除
    await db.table('history').where('word').equals(word).delete();

    // 2. 新しいタイムスタンプで追加
    await db.table('history').add({
      timestamp: Date.now(),
      word: word
    });
    
  });
}

export async function getHistory(): Promise<string[]> {
  const records = await db.table('history')
    .orderBy('timestamp') // 古い順に並べる（末尾が最新）
    .toArray();
  
  return records.map(r => r.word);
}
