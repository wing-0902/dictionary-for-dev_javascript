<script lang="ts">
  import { onMount } from "svelte";
  import PullToDelete from "./PullToDelete.svelte";
  import ResultSlot from "./ResultSlot.svelte";

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
  <div class='result'>
    <div class='resultSlot'>
      <PullToDelete on:pull={() => searchWord = '' }>
        <ResultSlot />
      </PullToDelete>
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    height: calc(100dvh - var(--headerHeight));
    display: absolute;
    .config {
      height: 68px;
      display: relative;
    }
    .result {
      height: calc(100dvh - var(--headerHeight) - 68px);
      overflow-y: scroll;
      .resultSlot {
        margin-bottom: 20px;
        height: 100%;
      }
    }
  }
</style>