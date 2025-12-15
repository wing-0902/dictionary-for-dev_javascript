<script lang="ts">
  import { onMount } from 'svelte';
  import { sessionToDel } from './formSessionStorage.mts';

  let username: string;
  let email: string;
  let rate: number;
  let comment: string;

  onMount(() => {
    if ((sessionStorage.getItem('form_status') ?? '') !== 'alreadySent') {
      if ((sessionStorage.getItem('form_status') ?? '') === 'checked' ) {
        sessionStorage.removeItem('form_status');
        window.location.href = '/'
      } else {
        window.location.href = '/form/'
      }
    } else {
      username = sessionStorage.getItem('username_form') ?? '';
      email = sessionStorage.getItem("email_form") ?? '';
      rate = Number(sessionStorage.getItem("rate_form"));
      comment = sessionStorage.getItem("comment_form") ?? '';
      for (const i of sessionToDel) {
        sessionStorage.removeItem(i);
      }
      sessionStorage.setItem('form_status', 'checked');
    }
  })
</script>

<ul>
  <li>
    <strong>お名前</strong><span>：{username}</span>
  </li>
  <li>
    <strong>メール</strong><span>：{email}</span>
  </li>
  <li>
    <strong>評価</strong><span>：{rate}</span>
  </li>
  <li>
    <strong>コメント</strong>：<br/>
    {comment}
  </li>
</ul>

<style lang="scss">
  ul {
    font-family: var(--font-zen-maru-gothic);
    li {
      overflow-x: wrap;
      strong {
        font-family: var(--font-zen-kaku-gothic-new);
      }
    }
  }
</style>