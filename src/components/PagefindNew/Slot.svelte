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

</style>