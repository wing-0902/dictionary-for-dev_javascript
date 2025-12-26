<script lang='ts'>
  import { onMount } from "svelte";
  export let searchWord: string;

  let hydrated = false;

  onMount(() => {
    searchWord = sessionStorage.getItem('searchWord') ?? '';
    hydrated = true;
  })

  $: if (hydrated) {
    sessionStorage.setItem('searchWord', searchWord);
  }

  // 履歴
  import History from "./History.svelte";
</script>

<div class='root'>
  <div class='inputSlot'>
    <input 
      type='search'
      placeholder='入力して検索'
      aria-label='検索語句を入力'
      autocorrect="off" 
      autocapitalize="none"
      spellcheck="false"
      bind:value={searchWord}/>
    {#if (searchWord !== '')}
      <button
        class='del'
        aria-label='検索クエリを削除'
        on:click={() => searchWord = ''}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/>
        </svg>
      </button>
    {/if}
  </div>
  <div class='historySlot'>
    <History />
  </div>
</div>

<style lang='scss'>
  .root {
    $historyWidth: 36px;
    $side-margin: 7px;
    width: 100%;
    display: flex;
    .inputSlot {
      position: relative;
      width: calc(100% - ($historyWidth + $side-margin));
      margin-left: $side-margin;
      input {
        background: var(--codeBack);
        color: var(--foreground);
        margin-top: 2px;
        margin-bottom: 2px;
        width: 100%;
        font-family: var(--font-fira-code), var(--font-m-plus-1-code), monospace;
        height: 40px;
        font-size: 16px;
        display: flex;
        align-items: center;
        border-radius: 10px;
        border: none;
        &:focus {
          outline: none;
          border-color: var(--themeColor);
          color: var(--themeColor);
        }
      }
      button.del {
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        height: 100%;
        display: flex;
        align-items: center;
        background: transparent;
        color: var(--foreground);
      }
    }
    .historySlot {
      width: $historyWidth;
      margin-right: $side-margin;
    }
  }
</style>