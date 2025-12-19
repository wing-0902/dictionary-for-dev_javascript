<script lang='ts'>
  import { renderSVG } from 'uqr';

  let captureElement: any;
  import html2canvas from 'html2canvas';
  async function downloadImage() {
    if (!captureElement) return;

    const canvas = await html2canvas(captureElement, {
      backgroundColor: "black"
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement('a');
    link.href = image;
    link.download = `QR_CODE | ${shareTitle}`;
    link.click();
  }
  
  export let shareTitle: string;
  export let shareUrl: string;

  import Share from '$components/Icons/iOS_Share.svelte';
  import Copy from '$components/Icons/Copy.svg.svelte';
  import QRCode from '$components/Icons/QRCode.svg.svelte';

  let open = false;

  function handleClick() {
	  open = !open;
  }

  function copyUrl() {
    navigator.clipboard.writeText(shareUrl);
    open = false;
  }

  const pageShareData = {
    title: shareTitle,
    url: shareUrl,
  }

  function openShareSheet() {
    open = false;
    try {
      if (navigator.share) {
        navigator.share(pageShareData);
      } else {
        alert('このブラウザは対応していません．')
      }
    } catch (error) {
      alert('不明なエラー')
    }
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
    <div class='detailContent'>
      <div class='slot qrSlot'>
        <h3>QRコード</h3>
        <div bind:this={captureElement}>
          {@html coloredSvg}
        </div>
      </div>
      <div class='slot shareSlot'>
        <h3>共有</h3>
        <button on:click={copyUrl}>
          <Copy />
          <span>URLをコピー</span>
        </button>
        <button on:click={downloadImage}>
          <QRCode />
          <span>QRコードをダウンロード</span>
        </button>
        {#if (Boolean(navigator.share))}
          <button on:click={openShareSheet}>
            <Share />
            <span>他のアプリで共有</span>
          </button>
        {/if}
      </div>
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
      max-width: calc(100vw - 32px);
      height: calc(100dvh - 90px);
      z-index: 1200;
      backdrop-filter: brightness(85%) blur(8px);
      transition: all 0.25s ease;
      &.isOpen {
        top: calc(150% - 300px);
      }
      .detailContent {
        display: flex;
        .slot {
          padding: 10px;
          &.qrSlot {
            width: 140px;
          }
          &.shareSlot {
            display: flex;
            flex-direction: column;
            width: 100%;

            button {
              width: 100%;
              background: transparent;
              font-size: 17px;
              font-family: var(--font-zen-kaku-gothic-new);
              display: flex;
              align-items: center;
              padding: 7px 15px;
              height: 50px;
              span {
                margin-left: 5px;
              }
              &:hover {
                border-radius: 20px;
                background: var(--codeBack);
              }
            }
          }
        }
      }
    }
  }
</style>