<script lang='ts'>
  export let searchMode: string;
  function changeMode(toMode: string) {
    searchMode = toMode;
  }
</script>

<div class='root'>
  <button
    on:click={() => changeMode('見出し')}
  >
    見出し
  </button>
  <button
    on:click={() => changeMode('全文')}
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
      &:first-child {
        border-radius: 14px 0 0 14px;
      }
      &:last-child {
        border-radius: 0 14px 14px 0;
      }
    }
  }
</style>