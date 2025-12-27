<script lang='ts'>
  export let searchWord: string;
  export let searchMode: string;
  export let allList;

  import TitlePagefind from './pagefind/Title.svelte';
  import ExamplePagefind from './pagefind/Ex.svelte';
  import TextPagefind from './pagefind/Text.svelte';
</script>

<section class='root'>
  {#if (searchMode === '見出し')}
    <TitlePagefind allList={allList} searchWord={searchWord} />
  {:else if searchWord === ''}
    <div class='message'>
      {#if (searchMode === '用例')}
        <p>このモードでは，コードブロック内の用例を検索します．</p>
      {:else if (searchMode === '全文')}
        <p>このモードでは，コンテンツの全文を検索できます．</p>
      {:else}
        <p>検索モードを選択してください．</p>
      {/if}
    </div>
  {:else}
    {#if searchMode === '用例'}
      <ExamplePagefind />
    {:else if searchMode === '全文'}
      <TextPagefind />
    {:else}
      <div class='message'>
        <p>検索モードを選択してください．</p>
      </div>
    {/if}
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