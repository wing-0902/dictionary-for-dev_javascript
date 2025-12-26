<script lang="ts">
  import { onMount } from 'svelte';

  export let searchMode: string;

  // クエリパラメータからsessionStorageに変更
  function changeMode(toMode: string) {
    sessionStorage.setItem('searchMode', toMode);
    searchMode = toMode;
  }

  onMount(async() => {
    searchMode = sessionStorage.getItem('searchMode') ?? '見出し';
  })
</script>

<div class='root'>
  <button
    on:click={() => changeMode('見出し')}
    disabled={searchMode === '見出し'}
  >
    見出し
  </button>
  <button
    on:click={() => changeMode('用例')}
    disabled={searchMode === '用例'}
  >
    用例
  </button>
  <button
    on:click={() => changeMode('全文')}
    disabled={searchMode === '全文'}
  >
    全文
  </button>
</div>

<style lang='scss'>
  .root {
    --side-margin: 7px;
    margin: 0 var(--side-margin);
    width: calc(100% - 2 * var(--side-margin));
    display: flex;
    button {
      flex: 1;
      font-family: var(--font-zen-kaku-gothic-new);
      font-size: 14px;
      margin: 0;
      height: 28px;
      border: solid var(--themeColor);
      border-width: 1px 0.5px;
      background: var(--codeBack);
      color: var(--themeColor);
      &:first-child {
        border-radius: 7px 0 0 7px;
        border-left-width: 1px !important;
      }
      &:last-child {
        border-radius: 0 7px 7px 0;
        border-right-width: 1px !important;
      }
      &:disabled {
        color: var(--codeBack);
        font-weight: 700;
        background-color: var(--themeColor);
      }
    }
  }
</style>