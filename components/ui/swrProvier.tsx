// app/swr-provider.tsx
'use client';
import { SWR_CONFIG } from '../../lib/swr-config'

import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>;
}