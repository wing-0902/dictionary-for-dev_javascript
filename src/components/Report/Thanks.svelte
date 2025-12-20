<script lang="ts">
  import { onMount } from 'svelte';
  import { reportToDel } from '../Form/formSessionStorage.mts';

  import Required from '$components/Form/Required.svelte';

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

<div class='root'>
  <section>
    <fieldset class='aboutYou'>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <Required />
        <label for='name'>お名前</label><br/>
        <input readonly name='name' type='text' value={username} class='formTextSlot' />
      </div>
      <br />
      <div class='spacer'>
        <Required />
        <label for='email'>メールアドレス</label><br/>
        <input readonly name='email' type='email' value={email} class='formTextSlot' />
      </div>
    </fieldset>
    <fieldset class='本題'>
      <legend>レポート</legend>
      <div class='spacer'>
        <Required />
        <label for='report_title'>タイトル</label><br/>
        <input readonly name='report_title' type='text' value={reportTitle} class='formTextSlot' />
      </div>
      <div>
        <Required />
        <label for='report_message'>本文</label><br/>
        <textarea readonly name='report_message' placeholder='ここに本文を入力...' value={reportMsg} class='formTextSlot'></textarea>
      </div>
    </fieldset>
  </section>
</div>

<style lang="scss">
  .root {
    font-family: var(--font-zen-kaku-gothic-new);
    box-sizing: border-box;
    section {
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