<script lang='ts'>
  import { onMount } from "svelte";

  import ArrowBack from "../Icons/ArrowBack.svg.svelte";

  let query: string = '';
  let mode: string = '';

  export let href: string;
  export let show: boolean;

  const linkHref =
    href === '検索' ? "/" :
    href === 'ライセンス' ? "/license/" :
    "/";
  
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') ?? '';
    const initialMode = urlParams.get('m') ?? '見出し';
    query = initialQuery;
    mode = initialMode;
  })
</script>

{#if show}
  <div class='root'>
    <p>
      <a
        href={linkHref}
      >
        <ArrowBack />
        <span>戻る</span>
      </a>
    </p>
  </div>
{/if}

<style lang="scss">
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    p {
      margin: 0;
      padding: 0;
      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        span:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>