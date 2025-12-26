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
          <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/>
        </svg>
      </button>
    {/if}
  </div>
  <div class='historySlot'>
    <button class='history'>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M480-120q-126 0-223-76.5T131-392q-4-15 6-27.5t27-14.5q16-2 29 6t18 24q24 90 99 147t170 57q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z"/>
      </svg>
    </button>
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
    }
  }
</style>