<script lang='ts'>
  import { renderSVG } from 'uqr';

  export let shareTitle: string;
  export let shareUrl: string;

  import Share from '$components/Icons/iOS_Share.svelte';
  import Copy from '$components/Icons/Copy.svg.svelte';

  let open = false;

  function handleClick() {
	  open = !open;
  }

  const svgCode = renderSVG(shareUrl, {})
  
  const coloredSvg = svgCode
    .replace(/fill="black"/g, 'fill="#ffffff"')
    .replace(/fill="white"/g, 'fill="#00000000"')
</script>

<div class='root'>
  <button on:click={handleClick}>
    <Share />
  </button>

  <div class='detail' class:isOpen={open}>
    <div class='slot qrSlot'>
      <h3>QRコードで送信</h3>
      {@html coloredSvg}
    </div>
    <div class='slot shareSlot'>
      <h3>他の方法</h3>
      <button>
        <Copy />
        URLをコピー
      </button>
      <button>
        <Share />
        他のアプリで共有
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    height: 100%;
    display: flex;
    align-items: center;
    button {
      background: transparent;
      border: none;
      color: var(--foreground);
    }
    .detail {
      position: fixed;
      top: 150%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: color-mix(in srgb, var(--codeBack) 80%);
      border: 2.5px solid var(--codeBack);
      border-radius: 10px;
      width: 600px;
      max-width: calc(100vw - 10px);
      height: 450px;
      max-height: calc(100dvh - 10px);
      z-index: 1200;
      backdrop-filter: brightness(85%) blur(8px);
      transition: all 0.25s ease-in-out;
      &.isOpen {
        top: 50%;
      }
      display: flex;
      .slot {
        width: 50%;
        padding: 10px;
        &.qrSlot {

        }
        &.shareSlot {
          display: flex;
          flex-direction: column;
          justify-content: center;
          button {
            width: 100%;
            background: transparent;
            font-size: 16px;
            font-family: var(--font-zen-kaku-gothic-new);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }
      }
    }
  }
</style>