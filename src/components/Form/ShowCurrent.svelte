<script lang="ts">
  import { onMount } from 'svelte';
  import { sessionToDel } from './formSessionStorage.mts';

  let username: string;
  let email: string;
  let rate: number;
  let comment: string;

  onMount(() => {
    if ((sessionStorage.getItem('form_status') ?? '') !== 'alreadySent') {
      window.location.href = '/form/'
    } else {
      username = sessionStorage.getItem('username_form') ?? '';
      email = sessionStorage.getItem("email_form") ?? '';
      rate = Number(sessionStorage.getItem("rate_form"));
      comment = sessionStorage.getItem("comment_form") ?? '';
      for (const i of sessionToDel) {
        sessionStorage.removeItem(i);
      }
    }
  })
</script>

<ul>
  <li>
    <strong>お名前</strong>：{username}
  </li>
  <li>
    <strong>メール</strong>：{email}
  </li>
  <li>
    <strong>評価</strong>：{rate}
  </li>
  <li>
    <strong>コメント</strong>：
    {comment}
  </li>
</ul>

<style lang="scss">
  ul {
    font-family: var(--font-zen-maru-gothic);
    strong {
      font-family: var(--font-zen-kaku-gothic-new);
    }
  }
</style>