<script lang="ts">
  import { onMount } from "svelte";

  export let allList;

  let searchMode: string;
  let searchWord: string;

  // コンポーネント一覧
  import Config from './Config.svelte';
  import InputSlot from './Slot.svelte';
</script>

<div class='root'>
  <div class='config'>
    <InputSlot bind:searchWord={searchWord} />
    <Config bind:searchMode={searchMode} />
  </div>
</div>

<style lang="scss">
  .root {
    height: calc(100dvh - var(--headerHeight));
  }
</style>