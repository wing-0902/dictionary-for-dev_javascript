<script lang="ts">
  import { onMount } from 'svelte';
  import { reportToDel } from '../Form/formSessionStorage.mts';

  let username: string;
  let email: string;
  let reportTitle: string;
  let reportMsg: string;

  onMount(() => {
    if ((sessionStorage.getItem('report_status') ?? '') !== 'alreadySent') {
      if ((sessionStorage.getItem('report_status') ?? '') === 'checked' ) {
        sessionStorage.removeItem('report_status');
        window.location.href = '/'
      } else {
        window.location.href = '/form/report/'
      }
    } else {
      username = sessionStorage.getItem('username_form') ?? '';
      email = sessionStorage.getItem("email_form") ?? '';
      reportTitle = sessionStorage.getItem("report_title") ?? '';
      reportMsg = sessionStorage.getItem("report_message") ?? '';

      for (const i of reportToDel) {
        sessionStorage.removeItem(i);
      }
      sessionStorage.setItem('report_status', 'checked');
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