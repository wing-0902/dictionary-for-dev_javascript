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

    // 規約
    let hasError = false;
    if (!agreeOnPolicy) {
      hasError = true;
      alert('規約に同意していただく必要があります')
    }

    // Turnstile
    const token = formData.get('cf-turnstile-response');
    if (!token) {
      hasError = true;
      alert('Turnstileトークンがありません．ボットでないことの検証を完了してください．')
    }

    // ユーザー名
    if (username === '') {
      hasError = true;
      alert('記名してください');
    }

    // メール
    if (email === '' || !isValidEmail(email)) {
      hasError = true;
      alert('メールアドレスが無効です．')
    }

    // タイトル
    if (reportTitle === '') {
      hasError = true;
      alert('報告のタイトルを入力してください．')
    }

    // 本文
    if (reportMsg === '') {
      hasError = true;
      alert('報告の本文を入力してください．')
    }

    if (hasError) {
      return;
    }

    try {
      // fetch APIを使ってサーバーにPOSTリクエストを送信
      const response = await fetch('/api/report', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        hydrated = false;
        sessionStorage.setItem('report_status', 'alreadySent');

        window.location.href = '/form/report/success/';
      } else {
        alert(`送信失敗：${result.error}`);
      }
    } catch (e) {
      alert('通信エラーが発生しました．');
      console.error('Error:', e);
    }
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
        <input class:error={nameTouched && (username === '')} on:focus={() => nameTouched = true} name='name' placeholder='お名前' type='text' id='name' bind:value={username} class='formTextSlot' />
      </div>
      <br />
      <div class='spacer'>
        <Required />
        <label for='email'>メールアドレス</label><br/>
        <input class:error={emailTouched && (email === '' || !isValidEmail(email))} on:focus={() => emailTouched = true} name='email' placeholder='your@dictionary4.dev' type='email' id='email' bind:value={email} class='formTextSlot' />
      </div>
      <p>{errorMsgAboutEmail}</p>
    </fieldset>
    <fieldset class='本題'>
      <legend>レポート</legend>
      <div class='spacer'>
        <Required />
        <label for='report_title'>タイトル</label><br/>
        <input class:error={titleTouched && (reportTitle === '')} on:focus={() => titleTouched = true} name='report_title' placeholder='タイトル' type='text' bind:value={reportTitle} class='formTextSlot' />
      </div>
      <div>
        <Required />
        <label for='report_message'>本文</label><br/>
        <textarea class:error={messageTouched && (reportMsg === '')} on:focus={() => messageTouched = true} name='report_message' placeholder='ここに本文を入力...' bind:value={reportMsg} class='formTextSlot'></textarea>
      </div>
    </fieldset>
    <Turnstile theme='dark' siteKey='0x4AAAAAACDaRh_Fzk8DXhP1' />
    <label>
      <input on:focus={() => policyTouched = true} type='checkbox' bind:checked={agreeOnPolicy} />
      フォームの規約に同意する
    </label>
    <div class='submitBtnBox'>
      <button type='submit' disabled={!isValid} on:click={() => trySubmit()}>
        送信
      </button>
    </div>
  </form>
</div>

<style lang="scss">
  .root {
    font-family: var(--font-zen-kaku-gothic-new);
    box-sizing: border-box;
    form {
      .submitBtnBox {
        display: flex;
        justify-content: center;
        button[type='submit'] {
          margin-top: 10px;
          font-size: 17px;
          height: 40px;
          width: 100px;
          border-radius: 10px;
          background: var(--codeBack);
          color: var(--themeColor);
          border: 1px solid var(--themeColor);
          &:disabled {
            color: gray;
            border-color: gray;
          }
        }
      }

      // formブロックのスタイル
      margin: auto 10px;
      box-sizing: border-box;

      .aboutYou {
        max-width: 100%;
        .spacer {
          align-items: last baseline;
          overflow-x: wrap;
          input {
            width: 100%;
            box-sizing: border-box;
            min-width: 280px;
            margin: 0;
            height: 40px;
            &[type='email'] {
              font-family: var(--font-fira-code);
            }
          }
        }
      }
      .本題 {
        max-width: 100%;
        textarea {
          width: 100%;
          box-sizing: border-box;
          font-size: 19px;
          height: 100px;
          resize: none;
          background: var(--codeBack);
        }
      }
    }
  }
</style>