<script lang="ts">
  export let searchWord: string = "";
  export let allList: any[] = [];

  let searchResult: any[] = allList;
  let timer: ReturnType<typeof setTimeout>;

  $: {
    clearTimeout(timer);

    timer = setTimeout(() => {
      const keywords = searchWord
        .toLowerCase()
        .split(/[ 　]+/)
        .filter(keyword => keyword.length > 0);

      if (keywords.length === 0) {
        searchResult = allList;
      } else {
        searchResult = allList.filter(item => {
          const title = item?.data?.title?.toLowerCase() ?? "";
          return keywords.every(keyword => title.includes(keyword));
        });
      }
    }, 300);
  }

  import { 結果なし } from './msg.mts';
</script>

<div class='root'>
  <ul>
    {#each searchResult as result}
      <hr />
      <li>
        <a href={`/content/${result.slug}`} class='項目リンク'>
          <h2>{result.data.title}</h2>
        </a>
      </li>
    {:else}
      <li>
        <p class='status'>{結果なし}</p>
      </li>
    {/each}
    <hr/>
  </ul>
</div>

<style lang='scss'>
  .root {
    width: 100%;
    ul {
      list-style-type: none;
      margin-left: -22px;
      width: 100%;
      hr {
        margin: 7px 0 7px 11px;
      }
      li {
        margin: 0;
        width: 100%;
        a {
          margin: 0;
          h2 {
            margin: 0;
            font-family: var(--font-fira-code), var(--font-zen-kaku-gothic-new), monospace;
            font-size: 20px;
          }
        }
        .status {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
</style>