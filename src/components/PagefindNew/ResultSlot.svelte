<script lang="ts">
  export let searchWord: string;
  export let searchMode: string;
  export let allList;

  import TitlePagefind from './pagefind/Title.svelte';
  import ExamplePagefind from './pagefind/Ex.svelte';
  import TextPagefind from './pagefind/Text.svelte';
</script>

<section class="root">
  {#if searchMode === '見出し'}
    <TitlePagefind
      {allList}
      {searchWord}
    />
  {:else if searchWord === ''}
    <div class="message">
      {#if searchMode === '用例'}
        <p>このモードでは，コードブロック内の用例を検索します．</p>
      {:else if searchMode === '全文'}
        <p>このモードでは，コンテンツの全文を検索できます．</p>
      {:else}
        <p>検索モードを選択してください．</p>
      {/if}
    </div>
  {:else if searchMode === '用例'}
    <ExamplePagefind query={searchWord} />
  {:else if searchMode === '全文'}
    <TextPagefind query={searchWord} />
  {:else}
    <TitlePagefind
      {allList}
      {searchWord}
    />
  {/if}
</section>

<style lang="scss">
  .root {
    height: calc(100dvh - var(--headerHeight) - 68px);
    width: 100%;
    .message {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      p {
        width: 100%;
        text-align: center;
      }
    }
  }
</style>
