<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let startY = 0;
  let pullDistance = 0;
  let pulling = false;

  const THRESHOLD = 180; // ここ超えたら発火

  function onTouchStart(e) {
    startY = e.touches[0].clientY;
    pulling = true;
  }

  function onTouchMove(e) {
    if (!pulling) return;

    const currentY = e.touches[0].clientY;
    pullDistance = Math.max(0, currentY - startY);
  }

  function onTouchEnd() {
    if (pullDistance > THRESHOLD) {
      dispatch("pull"); // 親に通知
    }
    
    pulling = false;
    pullDistance = 0;
  }
</script>

<div
  class="container"
  style="transform: translateY({pullDistance}px);"
  on:touchstart={onTouchStart}
  on:touchmove={onTouchMove}
  on:touchend={onTouchEnd}
>
  <div class="indicator">
    {#if pullDistance > THRESHOLD}
      指を離して消去
    {:else}
      下に引っ張って...
    {/if}
  </div>
  <div class='slot'>
    <slot />
  </div>
</div>
  
<style lang='scss'>
  .container {
    margin-top: -20px;
    transition: transform 0.2s ease;
    overscroll-behavior-y: contain;
    .indicator {
      text-align: center;
      font-size: 12px;
      height: 12px;
      color: var(--foreground);
      opacity: 0.7;
    }
    .slot {
      margin-top: 24px;
    }
  }
</style>
  