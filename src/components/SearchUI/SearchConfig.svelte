<script lang='ts'>
  let searchType: string = 'title';
  let searchKeyword: string = '';
</script>

<div class='root'>
  <div class='searchSlotRow'>
    <input type='text' bind:value={searchKeyword} />
  </div>
</div>

<style lang='scss'>
  .root {
    padding: 4px;
    .searchSlotRow {
      display: flex;
      input {
        width: 100%;
        height: 40px;
      }
    }
  }
</style>