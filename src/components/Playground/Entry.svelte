<script lang='ts'>
  import CodeMirror from 'svelte-codemirror-editor';
  import { javascript } from '@codemirror/lang-javascript';

  import { onMount } from 'svelte';

  // Editor Config
  const extensions = [javascript()];

  let initialCode: string = 'const a = 10;\nconst b = 20;\nconsole.log("合計：", a + b);';

  let hydrated = false;
  let code = initialCode;

  import localforage from 'localforage';

  onMount(async () => {
    const saved = await localforage.getItem('code_save');
    if (saved) {
      code = saved.toString();
    }
    hydrated = true;
  })

  $: if (hydrated) {
    localforage.setItem('code_save', code)
      .catch(err => console.error('保存失敗：', err));
  }
</script>

<div class='editorSlot'>
  <div class='wrapper'>
    <CodeMirror
      bind:value={code}
      {extensions}
      placeholder='ここにコードを入力...'/>
  </div>
</div>

<style lang="scss">
  .editorSlot {
    height: 50%;
    div.wrapper {
      max-height: 100%;
      overflow-y: scroll;
    }
  }
</style>