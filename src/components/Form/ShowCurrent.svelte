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

  import Star from './Star.svelte';
  import Required from './Required.svelte';
</script>

<div class='root'>
  <section class='form'>
    <fieldset class='aboutYou'>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <label for='name'>お名前</label><br/>
        <input readonly name='name' placeholder='ニックネームもOKです．' type='text' id='name' value={username} class='usrnm formTextSlot' />
      </div>
      <br />
      <div class='spacer'><br/>
        <label for='email'>メールアドレス</label>
        <input readonly name='email' placeholder='your@dictionary4.dev' type='text' id='email' value={email} class='email formTextSlot' />
      </div>
    </fieldset>
    <fieldset class='comment'>
      <legend>評価とコメント</legend>
      <p><Required />この記事を5段階で評価すると？</p>
      <label>
        <input readonly type='radio' name='rate' value={1} />
        <Star currentRate={rate} rateStar={1} />
      </label>
      <label>
        <input readonly type='radio' name='rate' value={2} />
        <Star currentRate={rate} rateStar={2} />
      </label>
      <label>
        <input readonly type='radio' name='rate' value={3} />
        <Star currentRate={rate} rateStar={3} />
      </label>
      <label>
        <input readonly type='radio' name='rate' value={4} />
        <Star currentRate={rate} rateStar={4} />
      </label>
      <label>
        <input readonly type='radio' name='rate' value={5} />
        <Star currentRate={rate} rateStar={5} />
      </label>
      <br /><br />
      <label for='comment'>ご意見・メッセージ</label><br />
      <textarea readonly placeholder='ここにコメントを入力' id='comment' name='comment' bind:value={comment} class='formTextSlot'></textarea>
    </fieldset>
  </section>
</div>

<style lang="scss">
  .root {
    font-family: var(--font-zen-kaku-gothic-new);
    box-sizing: border-box;
    .form {
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