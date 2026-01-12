<script lang="ts">
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
  });

  $: if (hydrated) {
    localforage.setItem('code_save', code).catch((err) => console.error('保存失敗：', err));
  }
</script>

<div class="editorSlot">
  <div class="wrapper">
    <CodeMirror
      bind:value={code}
      {extensions}
      placeholder="ここにコードを入力..."
    />
  </div>
  <button
    class="initialize"
    on:click={() => (code = initialCode)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentColor"
    >
      <path
        d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-70q0-17 11.5-28.5T760-800q17 0 28.5 11.5T800-760v200q0 17-11.5 28.5T760-520H560q-17 0-28.5-11.5T520-560q0-17 11.5-28.5T560-600h128q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q68 0 124.5-34.5T692-367q8-14 22.5-19.5t29.5-.5q16 5 23 21t-1 30q-41 80-117 128t-169 48Z"
      />
    </svg>
    リセット
  </button>
</div>

<div class="resultSlot">
  <button class="return">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentColor"
    >
      <path
        d="m272-440 116 116q11 11 11 28t-11 28q-11 11-28 11t-28-11L148-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L272-520h488v-120q0-17 11.5-28.5T800-680q17 0 28.5 11.5T840-640v120q0 33-23.5 56.5T760-440H272Z"
      />
    </svg>
    実行
  </button>
</div>

<style lang="scss">
  .editorSlot {
    height: 50%;
    position: relative;
    div.wrapper {
      max-height: 100%;
      overflow-y: scroll;
    }
    button.initialize {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      font-family: var(--font-zen-kaku-gothic-new);
      font-size: 15px;
    }
  }

  .resultSlot {
    height: 50%;
    position: relative;
    button.return {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      font-family: var(--font-zen-kaku-gothic-new);
      font-size: 15px;
    }
  }
</style>
