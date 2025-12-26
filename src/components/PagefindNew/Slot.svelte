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

</script>

<div class='root'>
  <div class='inputSlot'>
    <input 
      type='search'
      placeholder='入力して検索'
      aria-label='検索語句を入力'
      bind:value={searchWord}/>
    {#if (searchWord !== '')}
      <button
        class='del'
        aria-label='検索クエリを削除'
        on:click={() => searchWord = ''}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
      </button>
    {/if}
  </div>
</div>

<style lang='scss'>
  .root {
    width: 100%;
    .inputSlot {
      position: relative;
      $side-margin: 7px;
      margin: 0 $side-margin;
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
        height: 40px;
        background: transparent;
        color: var(--foreground);
      }
    }
  }
</style>