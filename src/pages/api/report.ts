export const prerender = false;

import { v4 as uuidv4 } from 'uuid';
import type { APIRoute } from 'astro';
import type { KVNamespace } from '@cloudflare/workers-types';
import { isValidEmail } from '../../data/emailValidation.mts';

interface RuntimeEnv {
  REPORT_ANSWERS: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
}

interface SurveyData {
  host: string;
  username: string;
  email: string;
  report_title: string;
  report_message: string;
  timestamp: number;
}

export const POST: APIRoute = async ({ request, locals}) => {
  const id = uuidv4();

  const ip = 
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim();
  
  const typedEnv = locals.runtime.env as RuntimeEnv;

  try {
    // リクエストボディからformDataを取得
    const formData = await request.formData();
    console.log(formData);

    // フォームの検証
    const rawName = formData.get('name');
    const rawEmail = formData.get('email');
    const rawTitle = formData.get('report_title');
    const rawMessage = formData.get('report_message');
    
    const errors: Record<string, string> = {};

    if (!rawName || !rawEmail || !rawTitle || !rawMessage) {
      errors.content = 'フォームの内容が不足しています．';
    }

    // Turnstile関連
    const turnstileToken = formData.get('cf-turnstile-response');
    if (!turnstileToken) {
      errors.turnstile = 'Turnstileトークンがありません．';
    }

    // Turnstile検証
    if (Object.keys(errors).length === 0) {
      const TURNSTILE_SECRET_KEY = typedEnv.TURNSTILE_SECRET_KEY;
      const turnstileVerificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

      const turnstileResponse = await fetch(turnstileVerificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken as string)}&remoteIp=${ip}&idempotency_key=${id}`,
      });
      const verificationResult: {
        success: boolean;
        'error-codes'?: string[]
      } = await turnstileResponse.json();

      if (!verificationResult.success) {
        console.error('Turnstile検証失敗：', verificationResult['error-codes']);
        errors.turnstileVerify = '不正な操作の可能性があります．ページをリロードして再度お試しください．';
      }
    }
    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({
          message: '入力内容にエラーがあります',
          errors: errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json'},
        }
      );
    } else {
      const data: SurveyData = {
        host: request.headers.get('host') ?? 'unknown',
        username: rawName?.toString() || '',
        email: rawEmail?.toString() || '',
        report_title: rawTitle?.toString() || '',
        report_message: rawMessage?.toString() || '',
        timestamp: Date.now(),
      };

      // KVに保存
      await typedEnv.REPORT_ANSWERS.put(
        id,
        JSON.stringify(data)
      );
    }

    return new Response(
      JSON.stringify({ message: 'フォームの送信が完了しました'}),
      { status: 200, headers: { 'Content-Type': 'application/json'}}
    );
  } catch (error) {
    console.error('API処理エラー：', error);
    return new Response(
      JSON.stringify({ message: '不明なエラー'}),
      { status: 500, headers: { 'Content-Type': 'application/json'}}
    );
  }
};