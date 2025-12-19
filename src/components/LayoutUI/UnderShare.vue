<script lang='ts' setup>
  import Share from '$components/Icons/iOS_Share.vue';

  const props = defineProps(['shareTitle', 'shareUrl']);

  const appShareData = {
    title: props.shareTitle,
    text: props.shareTitle,
    url: props.shareUrl,
  }

  function trySharing() {
    try {
      if (navigator.share) {
        navigator.share(appShareData);
      } else {
        alert('このブラウザでは使用できないメニューです');
      }
    } catch (err) {
      alert('不明なエラー；', err)
    }
  }
</script>

<template>
  <div class='root'>
    <button
      aria-label='共有'
      @click='trySharing'>
      <Share />
    </button>
  </div>
</template>

<style lang='scss' scoped>
  .root {
    height: 33px;
    display: flex;
    align-items: center;
    button {
      background: transparent;
      border: none;
      color: var(--foreground);
    }
  }
</style>