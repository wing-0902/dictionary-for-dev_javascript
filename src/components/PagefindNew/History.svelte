<script lang="ts">
  let isOpen = $state(false);

  import { liveQuery } from 'dexie';
  import { db } from './db.ts';

  let historyList = $state<string[]>([]);

  // 履歴を最新順に取得
  const query = liveQuery(() => db.history.orderBy('timestamp').reverse().toArray());

  $effect(() => {
    const subscription = query.subscribe({
      next: (val) => {
        // DBが更新されるとここが自動で走り、stateが更新される
        historyList = val.map((item) => item.word);
      },
      error: (err) => console.error(err)
    });

    // コンポーネント破棄時に購読解除
    return () => subscription.unsubscribe();
  });
</script>

<div class="root">
  <button
    class="history"
    title="履歴を表示"
    onclick={() => (isOpen = !isOpen)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path
        d="M480-120q-126 0-223-76.5T131-392q-4-15 6-27.5t27-14.5q16-2 29 6t18 24q24 90 99 147t170 57q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z"
      />
    </svg>
  </button>

  <div
    class="slot"
    class:isClosed={!isOpen}
  >
    <h3>検索履歴</h3>
    <ul>
      {#each historyList as word}
        <li>{word}</li>
      {:else}
        <p>履歴がありません．</p>
        <p>まずは検索してみましょう．</p>
      {/each}
    </ul>
  </div>

  {#if isOpen}
    <div
      class="background"
      title="履歴を閉じる"
      onclick={() => (isOpen = false)}
    ></div>
  {/if}
</div>

<style lang="scss">
  .root {
    height: 100%;
    button.history {
      background: transparent;
      width: 100%;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: var(--foreground);
    }
    .slot {
      position: fixed;
      z-index: 999;
      top: calc(var(--headerHeight) + 40px);
      left: calc(var(--searchWidth) - 50px);
      backdrop-filter: blur(6px) brightness(70%);
      border: 1px solid var(--codeBack);
      border-radius: 20px;
      width: var(--searchWidth);
      max-height: 600px;
      max-width: calc(100vw - 30px);
      height: calc(100dvh - 40px);
      transition: all 0.25s ease;
      &.isClosed {
        transform: translate3d(calc(10px - 50%), calc(-50% - 20px), 0) scale(0);
      }
      @media (max-width: 830px) {
        width: calc(100vw - 50px);
        &.isClosed {
          transform: translate3d(calc(50% - 20px), calc(-50% - 20px), 0) scale(0);
        }
      }

      // slotの中身
      h3 {
        text-align: center;
      }
      ul {
        font-size: 18px;
        li {
          list-style-type: circle;
        }
        p {
          text-align: center;
        }
      }
    }
    .background {
      z-index: 500;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
    }
  }
</style>
