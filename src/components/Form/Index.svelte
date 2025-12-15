<script lang="ts">
  // インポート
  import Required from './Required.svelte';
  import Star from './Star.svelte';
  import { Turnstile } from 'svelte-turnstile';
  import { isValidEmail } from '../../data/emailValidation.mts';
  import { onMount } from 'svelte'

  // フォーム内で使用する変数
  let username: string;
  let email: string;
  let comment: string;
  let rate: number;

  let hydrated = false;

  onMount(() => {
    username = sessionStorage.getItem('username_form') ?? '';
    email = sessionStorage.getItem('email_form') ?? '';
    comment = sessionStorage.getItem('comment_form') ?? '';
    rate = Number(sessionStorage.getItem('rate_form')) ?? 0;
    hydrated = true;
  });

  $: if (hydrated) {
    sessionStorage.setItem('username_form', username);
    sessionStorage.setItem('email_form', email);
    sessionStorage.setItem('comment_form', comment);
    sessionStorage.setItem('rate_form', rate.toString());
  }

  $: errorMsgAboutEmail = 
    email === '' || isValidEmail(email) ? '　'
    : 'メールアドレスの形式にしてください．'

  $: isValid = 
    rate >= 1
    &&
    rate <= 5
    &&
    email === '' || isValidEmail(email)

  async function handleSubmit(event: Event) {
    event?.preventDefault();

    // フォームの要素を取得し、FormDataオブジェクトを生成
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // エラーを監視
    let hasError = false;

    // 評価
    const rateValue = formData.get('rate');
    if (!rateValue || parseInt(rateValue as string, 10) < 1 || parseInt(rateValue as string, 10) > 5) {
      alert('評価は必須項目です．1から5の星を選択してください．');
      hasError = true;
    }

    const token = formData.get('cf-turnstile-response');
    if (!token) {
      alert ('Turnstileトークンがありません．ロボットでないことの検証を完了してください．')
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      // fetch APIを使ってサーバーにPOSTリクエストを送信
      const response = await fetch('/api/form', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        hydrated = false;

        const sessionToDel = ['username_form', 'email_form', 'comment_form', 'rate_form'];
        for (let i of sessionToDel) {
          sessionStorage.removeItem(i);
        }

        alert(result.message);
      } else {
        alert(`送信失敗：${result.error}`);
      }
    } catch (e) {
      alert('通信エラーが発生しました．');
      console.error('Error:', e);
    }
  }
</script>

<div class='root'>
  <form on:submit={handleSubmit}>
    <fieldset class='aboutYou'>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <label for='name'>お名前</label><br/>
        <input name='name' placeholder='ニックネームもOKです．' type='text' id='name' bind:value={username} class='usrnm formTextSlot' />
      </div>
      <br />
      <div class='spacer'><br/>
        <label for='email'>メールアドレス</label>
        <input name='email' placeholder='your@dictionary4.dev' type='text' id='email' bind:value={email} class='email formTextSlot' class:error={email !== '' && !isValidEmail(email)} />
      </div>
      <p class='warn'>{errorMsgAboutEmail}</p>
    </fieldset>
    <fieldset class='comment'>
      <legend>評価とコメント</legend>
      <p><Required />この記事を5段階で評価すると？</p>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={1} />
        <Star currentRate={rate} rateStar={1} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={2} />
        <Star currentRate={rate} rateStar={2} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={3} />
        <Star currentRate={rate} rateStar={3} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={4} />
        <Star currentRate={rate} rateStar={4} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={5} />
        <Star currentRate={rate} rateStar={5} />
      </label>
      <br /><br />
      <label for='comment'>編集部へのメッセージ，ご意見など，ご自由にお書きください．</label><br />
      <textarea placeholder='ここにコメントを入力' id='comment' name='comment' bind:value={comment} class='formTextSlot'></textarea>
    </fieldset>
    <Turnstile theme='dark' siteKey='0x4AAAAAACDaRh_Fzk8DXhP1' />
    <div class='submitBtnBox'>
      <button type='submit' disabled={!isValid}>
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
            &.email {
              font-family: var(--font-fira-code), monospace;
            }
          }
        }
        .warn {
          color: red;
        }
      }
      .comment {
        max-width: 100%;
        label {
          input {
            opacity: 0;
            appearance: none;
            margin: auto 0;
            padding: 0;
          }
        }
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