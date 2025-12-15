<script lang="ts">
  // インポート
  import Required from './Required.svelte';
  import Star from './Star.svelte';
  import { Turnstile } from 'svelte-turnstile';
  import {isValidEmail} from '../../data/emailValidation.mts';

  // フォーム内で使用する変数
  let username: string = '';
  let email: string = '';
  let comment: string = '';
  let rate: number = 0;

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

    formData.append('host', 'js.dictionary4.dev');

    try {
      // fetch APIを使ってサーバーにPOSTリクエストを送信
      const response = await fetch('/api/form', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
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
    <fieldset>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <label for='name'>お名前</label>
        <input name='name' placeholder='ニックネームもOKです．' type='text' id='name' bind:value={username} />
      </div>
      <br />
      <div class='spacer'>
        <label for='email'>メールアドレス</label>
        <input name='email' placeholder='your@dictionary4.dev' type='text' id='email' bind:value={email} class='email' class:invalidEmail={email !== '' && !isValidEmail(email)} />
      </div>
      <p class='warn'>{errorMsgAboutEmail}</p>
    </fieldset>
    <fieldset>
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
      <textarea placeholder='ここにコメントを入力' id='comment' name='comment' bind:value={comment}></textarea>
    </fieldset>
    <Turnstile siteKey='0x4AAAAAACDaRh_Fzk8DXhP1' />
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
    form {
      fieldset {
        legend {

        }
        .spacer {
          display: flex;
          justify-content: space-between;
          align-items: last baseline;
          label {

          }
          input {
            font-size: 19px;
            width: calc(100% - 160px);
            min-width: 280px;
            margin: 0;
            border: 1px solid transparent;
            border-bottom-color: var(--foreground);
            background: var(--codeBack);
            height: 40px;
            color: var(--foreground);
            border-radius: 10px;
            &:focus {
              outline: none;
              color: var(--themeColor);
              border-bottom-color: var(--themeColor);
            }
            &.email {
              font-family: var(--font-fira-code), monospace;
            }
            &.invalidEmail {
              border-bottom-color: red;
            }
          }
        }
        .warn {
          text-align: right;
          color: red;
        }
      }
    }
  }
</style>