<script lang='ts'>
  import ModeConfig from "./ModeConfig.svelte";
  import PagefindConnector from "./PagefindConnector.svelte";

  let searchMode: string = '見出し'
</script>

<div class='root'>
  <PagefindConnector>
    <ModeConfig bind:searchMode={searchMode} />
  </PagefindConnector>
</div>