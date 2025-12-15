export const prerender = false;

import { v4 as uuidv4 } from 'uuid';
import type { APIRoute } from 'astro';
import type { KVNamespace } from '@cloudflare/workers-types';
import { isValidEmail } from '../../data/emailValidation.mts';

interface RuntimeEnv {
  SURVEY_ANSWERS: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
}

interface SurveyData {
  host: string;
  username?: string;
  email?: string;
  rate: number;
  comment?: string;
  timestamp: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};


export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204, // No Content
    headers: corsHeaders,
  });
};

export const POST: APIRoute = async ({ context }) => {
  const { request, env } = context as { request: Request; env: RuntimeEnv };

  try {
    // リクエストボディからformDataを取得
    const formData = await request.formData();

    // ユーザーの入力
    const name = formData.get('name');
    const rawEmail = formData.get('email');
    const email = (rawEmail?.toString() || '').trim();
    const rawScore = formData.get('rate');
    const rawComment = formData.get('comment');
    const comment = (rawComment?.toString() || '').trim();

    // Turnstileトークン
    const turnstileToken = formData.get('cf-turnstile-response');

    const errors: Record<string, string> = {};

    // エラーがある場合
    if (email && isValidEmail(email)) {
      errors.email = 'メールアドレスが無効な形式です．'
    }
    if (comment && comment.length> 500) {
      errors.comment = 'コメントは500文字以内でお願いします．'
    }
    if (!rawScore) {
      errors.score = "評価は必須項目です．"
    } else {
      const score = Number(rawScore);
      if (isNaN(score)) {
        errors.score = "評価は数値で入力する必要があります"
      } else {
        if (!Number.isInteger(score)) {
          errors.score = '評価は整数である必要があります。';
        }
      }
    }
    if ( !turnstileToken ) {
      errors.captcha = 'Turnstileトークンがありません'
    }
    if (!errors.captcha) {
      const TURNSTILE_SECRET_KEY = env.TURNSTILE_SECRET_KEY;
    }
    if (Object.keys(errors).length > 0) {
    // 400 Bad Request ステータスでエラー情報をクライアントに返す
    return new Response(
      JSON.stringify({
        message: '入力内容にエラーがあります。',
        errors: errors, // エラーオブジェクトをクライアントに返します
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  }
};


export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'この形式のリクエストは許可されていません．' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};