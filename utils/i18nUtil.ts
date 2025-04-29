"use server";
import { useLocale } from "next-intl";
import {getLangDir} from 'rtl-detect';
import {cookies} from 'next/headers';
import {Locale, defaultLocale} from '../i18n/config';
import { getLocale } from "next-intl/server";
export async function isRTL(){
    return getLangDir(await getLocale())=='rtl';
}

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}