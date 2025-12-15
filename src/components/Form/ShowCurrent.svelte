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
    お名前：{username}
  </li>
  <li>
    メール：{email}
  </li>
  <li>
    評価：{rate}
  </li>
  <li>
    <strong>コメント</strong>：
    {comment}
  </li>
</ul>