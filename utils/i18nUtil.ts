import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import {getLangDir} from 'rtl-detect';
export function isRTL(){
    return getLangDir( useLocale())=='rtl';
}