<script>
  export let searchWord;
  export let allList;

  $: searchKeywords = searchWord
    .split(/[ 　]+/)
    .filter(keyword => keyword.length > 0)
    .map(keyword => keyword.toLowerCase());

  let searchResult;
  $: if (searchKeywords.length === 0) {
    searchResult = allList;
  } else {
    searchResult = allList.filter(item => {
      const lowerItem = item.data.title.toLowerCase();

      return searchKeywords.every(keyword =>
        lowerItem.includes(keyword)
      );
    })
  }
</script>

<div class='root'>
  <ul>
    {#each searchResult as result}
      <hr />
      <li>
        <a
          href={`/content/${result.slug}`}
          class='項目リンク'>
          <h2>{result.data.title}</h2>
        </a>
      </li>
    {/each}
  </ul>
</div>