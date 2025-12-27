<script lang='ts'>
  export let query: string = '';
  let searchResults: any[] = [];
  let pagefind: any;
  let debounceTimer: number | null = null;
  let loading = false;
  import { onMount, onDestroy } from 'svelte';
  import { 結果なし, 検索中, 表示中 } from './msg.mts';

  const PAGEFIND_OPTIONS = {
    bundlePath: 'https://js.dictionary4.dev/code_only_search/',
    baseUrl: "/content/",
    pageSize: 8,
  }

  /**
   * 検索クエリに基づいてPagefind検索を実行する
   * @param val 検索クエリ
   */
  async function fetchSearchResults(val: string) {
    if (!pagefind) return;
    const trimmedVal = val.trim();

    if (!trimmedVal) {
      searchResults = [];
      return;
    }

    loading = true;
    try {
      const search = await pagefind.search(trimmedVal);
      
      // 結果をデシリアライズして表示用に整形
      if (search.results.length > 0) {
        const data = await Promise.all(
          search.results.map((r: any) => r.data())
        );
        searchResults = data;
      } else {
        searchResults = [];
      }
    } catch (e) {
      console.error("Pagefind search failed:", e);
      searchResults = [];
    } finally {
      loading = false;
    }
  }

  function handleInput(event: Event) {
    const newQuery = (event.target as HTMLInputElement).value;
    query = newQuery; // Svelte変数に即時反映

    // 検索処理にデバウンスを適用
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    // 300ms入力が停止したら検索を実行
    debounceTimer = window.setTimeout(() => {
      fetchSearchResults(newQuery);
    }, 300);
  }

  onMount(async () => {
    // 2. Pagefindコアライブラリを動的にインポート
    try {
      // @ts-ignore
      pagefind = await import(
        /* @vite-ignore */
        `${PAGEFIND_OPTIONS.bundlePath}pagefind.js` 
      );
      // オプションを設定 (baseUrlなど)
      await pagefind.options(PAGEFIND_OPTIONS);
      
      // 3. 初期クエリがあれば、検索を実行
      if (query !== '') {
        await fetchSearchResults(query);
      }
    } catch (e) {
      console.error("Pagefind library or initialization failed.", e);
    }
  });

  onDestroy(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });
</script>

<div class='search-output'>
  {#if loading}
    <p class='ステータス'>{検索中}</p>
  {:else if query && searchResults.length > 0}
  <p class='ステータス'>{searchResults.length}{表示中}</p>
  <ul class="結果一覧">
    {#each searchResults as result}
      <hr />
      <li class="項目">
        <a
          class='項目リンク'
          href=result.url
        >
          <h2>{result.meta.title || result.url}</h2>
          <p class="詳細">{@html result.excerpt}</p>
        </a>
      </li>
      {#if result.sub_results && result.sub_results.length > 0}
        <ul class="サブ結果">
          {#each result.sub_results as subResult, index}
            {#if index > 0} 
              <li class="中身">
                <a href=subResult.url>
                  <h3 class="タイトル">{subResult.title}</h3>
                </a>
              </li>
            {/if}
          {/each}
        </ul>
      {/if}
    {/each}
    <hr class='endHr'/>
  </ul>
  {:else if query && !loading}
    <p class="ステータス">{結果なし}</p>
  {:else}
    <p class='ステータス'>入力して検索</p>
    <p class='helpMessage'>このモードでは，コードブロック内の用例だけを検索できます．</p>
  {/if}
</div>

<style lang='scss'>
  @import './style.scss';
</style>