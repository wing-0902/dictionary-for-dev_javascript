<script lang="ts">
  import Required from "$components/Form/Required.svelte";
  import { preventDefault } from "svelte/legacy";

  import { onMount } from 'svelte';

  import { reportToDel } from "$components/Form/formSessionStorage.mjs";
  import { isValidEmail } from "../../data/emailValidation.mts";

  // フォーム内で使用する変数
  let username: string;
  let email: string;
  let reportTitle: string;
  let reportMsg: string;
  let agreeOnPolicy: boolean = false;

  let hydrated = false;

  onMount(() => {
    if ((sessionStorage.getItem('report_status') ?? '') !== '') {
      for (const i of reportToDel) {
        sessionStorage.removeItem(i);
      }
    }
    username = sessionStorage.getItem('username_form') ?? '';
    email = sessionStorage.getItem('email_form') ?? '';
    reportTitle = sessionStorage.getItem('report_title') ?? '';
    reportMsg = sessionStorage.getItem('report_message') ?? '';
    hydrated = true;
  })

  $: if (hydrated) {
    sessionStorage.setItem('username_form', username);
    sessionStorage.setItem('email_form', email);
    sessionStorage.setItem('report_title', reportTitle);
    sessionStorage.setItem('report_message', reportMsg);
  }

  $: errorMsgAboutEmail = 
    email === '' || isValidEmail(email) ? '　'
    : 'メールアドレスの形式にしてください．'

  $: isValid = 
    email === '' || isValidEmail(email)
    &&
    reportTitle
    &&
    reportMsg
    &&
    username
    &&
    email

  async function handleSubmit(event: Event) {

  }
</script>

<div class='root'>
  <form on:submit|preventDefault={handleSubmit}>
    <fieldset class='aboutYou'>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <label for='name'>お名前</label><br/>
        <input name='name' placeholder='お名前' type='text' id='name' bind:value={username} />
      </div>
    </fieldset>
  </form>
</div>