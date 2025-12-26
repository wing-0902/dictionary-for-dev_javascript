<script lang="ts">
  import { onMount } from "svelte";

  export let allList;

  let searchMode: string;

  // コンポーネント一覧
  import Config from './Config.svelte';
</script>

<div class='root'>
  <Config bind:searchMode={searchMode} />
</div>

<style lang="scss">
  .root {
    height: calc(100dvh - var(--headerHeight));
  }
</style>