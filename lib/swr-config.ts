import { fetcher } from "./fetcher";

export const SWR_CONFIG = {
  revalidateOnFocus: true,
  shouldRetryOnError: false,
  fetcher:fetcher
};