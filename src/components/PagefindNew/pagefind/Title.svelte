<script lang="ts">
  import { 結果なし } from './msg.mts';
  import saveHistory from './saveHistoryToIndexedDB.mts';

  // Svelte 5 の Props 受取
  let { searchWord = '', allList = [] } = $props();

  // 検索結果の状態管理
  let searchResult = $state(allList);

  // 検索処理 (derived の代わり、または effect)
  $effect(() => {
    const keywords = searchWord
      .toLowerCase()
      .split(/[ 　]+/)
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      searchResult = allList;
    } else {
      searchResult = allList.filter((item) => {
        const title = item?.data?.title?.toLowerCase() ?? '';
        return keywords.every((keyword) => title.includes(keyword));
      });
    }
  });

  // 保存処理のラッパー
  async function handleSave(word: string) {
    if (!word || word.trim() === "") return;
    
    // ブラウザ環境であることを確認
    if (typeof window !== "undefined") {
      await saveHistory(word);
    }
  }
</script>

<div class="root">
  <ul>
    {#if searchResult.length > 0}
      <p class="status">{searchResult.length}件表示中</p>
      {#each searchResult as result}
        <hr />
        <li>
          <a
            href={`/content/${result.slug}`}
            data-astro-prefetch="hover"
            class="項目リンク"
            onclick={() => handleSave(searchWord)} 
          >
            <h2>{result.data.title}</h2>
          </a>
        </li>
      {/each}
    {:else}
      <li>
        <p class="status">{結果なし}</p>
      </li>
    {/if}
    <hr />
  </ul>
</div>

<style lang="scss">
  .root {
    width: 100%;
    overflow-x: hidden;
    ul {
      list-style-type: none;
      margin-left: -22px;
      width: 100%;
      hr {
        margin: 7px 0 7px 11px;
        width: 100%;
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
      }
    }
    p.status {
      text-align: center;
    }
  }
</style>
