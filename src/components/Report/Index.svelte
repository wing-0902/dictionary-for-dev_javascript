<script lang="ts">
  import Required from "$components/Form/Required.svelte";
  import { preventDefault } from "svelte/legacy";

  import { onMount } from 'svelte';

  import { reportToDel } from "$components/Form/formSessionStorage.mjs";
  import { isValidEmail } from "../../data/emailValidation.mts";

  import { Turnstile } from "svelte-turnstile";

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
    isValidEmail(email)
    &&
    reportTitle !== ''
    &&
    reportMsg !== ''
    &&
    username !== ''
    &&
    agreeOnPolicy


  async function handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
  }

  let nameTouched: boolean = false;
  let emailTouched: boolean = false;
  let titleTouched: boolean = false;
  let messageTouched: boolean = false;
  let policyTouched: boolean = false;
</script>

<div class='root'>
  <form on:submit|preventDefault={handleSubmit}>
    <fieldset class='aboutYou'>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <Required />
        <label for='name'>お名前</label><br/>
        <input on:focus={() => nameTouched = true} name='name' placeholder='お名前' type='text' id='name' bind:value={username} />
      </div>
      <br />
      <div class='spacer'>
        <Required />
        <label for='email'>メールアドレス</label><br/>
        <input on:focus={() => emailTouched = true} name='email' placeholder='your@dictionary4.dev' type='email' id='email' bind:value={email} />
      </div>
      <p>{errorMsgAboutEmail}</p>
    </fieldset>
    <fieldset class='本題'>
      <legend>レポート</legend>
      <div class='spacer'>
        <Required />
        <label for='report_title'>タイトル</label>
        <input on:focus={() => titleTouched = true} name='report_title' placeholder='タイトル' type='text' bind:value={reportTitle} />
      </div>
      <div>
        <Required />
        <label for='report_message'>本文</label>
        <textarea on:focus={() => messageTouched = true} name='report_message' placeholder='ここに本文を入力...' bind:value={reportMsg}></textarea>
      </div>
    </fieldset>
    <Turnstile theme='dark' siteKey='0x4AAAAAACDaRh_Fzk8DXhP1' />
    <label>
      <input on:focus={() => policyTouched = true} type='checkbox' bind:checked={agreeOnPolicy} />
      フォームの規約に同意する
    </label>
    <div class='submitBtnBox'>
      <button type='submit' disabled={!isValid}>
        送信
      </button>
    </div>
  </form>
</div>