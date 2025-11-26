<script lang='ts'>
  import { onMount } from "svelte";
  import { addQuery } from "../SearchUI/addQuery.mts";

  let query: string = '';
  let mode: string = '';

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') ?? '';
    const initialMode = urlParams.get('m') ?? '';
    query = initialQuery;
    mode = initialMode;
  })
</script>

<div>
  <p>
    <a
      href={addQuery("/", {
        'q': query,
        'm': mode,
      })}
    >＜戻る</a>
  </p>
</div>