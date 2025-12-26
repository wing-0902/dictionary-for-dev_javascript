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
  </div>
</div>

<style lang='scss'>

</style>