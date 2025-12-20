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

