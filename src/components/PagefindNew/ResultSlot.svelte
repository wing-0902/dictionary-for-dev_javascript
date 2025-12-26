<script lang='ts'>
  export let searchWord: string;
  export let searchMode: string;
</script>

<section class='root'>
  {#if searchWord === ''}
    <div class='message'>
      {#if (searchMode === '見出し')}
      {:else if (searchMode === '用例')}
        <p>このモードでは，コードブロック内の用例を検索します．</p>
      {:else if (searchMode === '全文')}
        <p>このモードでは，コンテンツの全文を検索できます．</p>
      {:else}
        <p>検索モードを選択してください．</p>
      {/if}
    </div>
  {:else}
  {/if}
</section>

<style lang="scss">
  .root {
    height: calc(100dvh - var(--headerHeight) - 68px);
    .message {
      height: 100%;
      display: flex;
      align-items: center;
      p {
        text-align: center;
      }
    }
  }
</style>