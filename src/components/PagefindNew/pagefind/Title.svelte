<script lang="ts">
  export let searchWord: string = "";
  export let allList: any[] = []; // allListの中身に合わせて型定義するとより安全です

  let searchResult: any[] = allList;
  let timer: ReturnType<typeof setTimeout>;

  // searchWord または allList が変更されたときに実行
  $: {
    // 入力が続く間はタイマーをリセットし、実行を遅らせる
    clearTimeout(timer);

    timer = setTimeout(() => {
      // 1. キーワードの配列を作成
      const keywords = searchWord
        .toLowerCase()
        .split(/[ 　]+/)
        .filter(keyword => keyword.length > 0);

      // 2. フィルタリング実行
      if (keywords.length === 0) {
        searchResult = allList;
      } else {
        searchResult = allList.filter(item => {
          // data.title が存在しない場合の安全策も兼ねて
          const title = item?.data?.title?.toLowerCase() ?? "";
          return keywords.every(keyword => title.includes(keyword));
        });
      }
    }, 300);
  }
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
      <li>一致する項目が見つかりませんでした。</li>
    {/each}
  </ul>
</div>