<script lang="ts">
  import { renderSVG } from 'uqr';

  import { onMount } from 'svelte';

  // 共有シートの利用可否
  let shareAvailable = false;
  onMount(() => {
    if (Boolean(navigator.share)) {
      shareAvailable = true;
    }
  });

  let captureElement: any;
  import html2canvas from 'html2canvas';
  async function downloadImage() {
    if (!captureElement) return;

    const canvas = await html2canvas(captureElement, {
      backgroundColor: 'black'
    });

    const image = canvas.toDataURL('image/png');

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Blobの作成に失敗しました');
        return;
      }

      const file = new File([blob], `qrcode_${shareTitle}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `QR CODE | ${shareTitle}`
          });
          console.log('共有成功！');
        } catch (error) {
          console.error('共有に失敗しました:', error);
        }
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = `QR_CODE | ${shareTitle}`;
        link.click();
      }
    }, 'image/png');
  }

  export let shareTitle: string;
  export let shareUrl: string;

  import Share from '$components/Icons/iOS_Share.svelte';
  import Copy from '$components/Icons/Copy.svg.svelte';
  import QRCode from '$components/Icons/QRCode.svg.svelte';
  import GoDown from '$components/Icons/GoDown.svg.svelte';

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
    url: shareUrl
  };

  function openShareSheet() {
    open = false;
    try {
      if (navigator.share) {
        navigator.share(pageShareData);
      } else {
        alert('このブラウザは対応していません．');
      }
    } catch (error) {
      alert('不明なエラー');
    }
  }

  const svgCode = renderSVG(shareUrl, {});

  const coloredSvg = svgCode
    .replace(/fill="black"/g, 'fill="#ffffff"')
    .replace(/fill="white"/g, 'fill="#00000000"');

  // キー
  function handleKeydown(event: any) {
    if (event.key === 'Escape') {
      open = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="root">
  <button on:click={handleClick}>
    <Share />
  </button>

  <div
    class="detail"
    class:isOpen={open}
    class:isClose={!open}
  >
    <button
      class="closeArrow"
      on:click={() => {
        open = false;
      }}
    >
      <GoDown />
    </button>
    <div class="detailContent">
      <div class="slot qrSlot">
        <h3>QRコード</h3>
        <div
          bind:this={captureElement}
          class="qrSvgSlot"
        >
          {@html coloredSvg}
        </div>
      </div>
      <div class="slot shareSlot">
        <h3>共有</h3>
        <button on:click={copyUrl}>
          <Copy />
          <span>URLをコピー</span>
        </button>
        <button on:click={downloadImage}>
          <QRCode />
          <span>QRコードを保存</span>
        </button>
        {#if shareAvailable}
          <button on:click={openShareSheet}>
            <Share />
            <span>他のAppで共有</span>
          </button>
        {/if}
      </div>
    </div>
  </div>

  {#if open}
    <div
      class="backgroundSlot"
      tabindex="0"
      aria-label="メニューを閉じる"
      on:click|preventDefault={() => {
        open = false;
      }}
    ></div>
  {/if}
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
      .closeArrow {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      position: fixed;
      top: 150%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: color-mix(in srgb, var(--codeBack) 80%);
      border: 2.5px solid var(--codeBack);
      border-radius: 10px;
      width: 600px;
      max-width: calc(100vw - 32px);
      height: 100dvh;
      z-index: 1200;
      backdrop-filter: brightness(85%) blur(8px);
      transition: all 0.25s ease;
      @media (max-width: 400px) {
        width: 100dvh;
        max-width: 100vw;
        margin: 0;
        &.isOpen {
          top: calc(150% - 330px) !important;
        }
      }
      &.isOpen {
        top: calc(150% - 300px);
      }
      .detailContent {
        display: flex;
        @media (max-width: 400px) {
          flex-direction: column;
          .slot {
            width: 100%;
            h3 {
              display: none;
            }
            &.qrSlot {
              display: flex;
              justify-content: center;
              width: 100% !important;
              .qrSvgSlot {
                width: 80px;
              }
            }
          }
        }
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
    .backgroundSlot {
      position: fixed;
      opacity: 0;
      border: none;
      width: 100vw;
      height: 100dvh;
      top: 0;
      left: 0;
      z-index: 800;
    }
  }
</style>
