'use server';
import { PageSettings } from '@/lib/validations/schemas/pageSchema';
import { ScriptSettings } from '@/lib/validations/schemas/scriptSettingsSchema';
import { DYNAMIC_PAGES, HEADER_SCRIPTS, SITE_CONFIG } from '@/types/cache-keys';
import { SiteSettings } from '@/types/siteSettings.type';
import {
  cacheLife,
  cacheTag,
  revalidatePath,
  revalidateTag,
  updateTag,
} from 'next/cache';
import { cookies } from 'next/headers';

const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API;

export const fetchOnServer = async <T = any>(
  path: string,
  rev?: number,
  token?: 'token' | 'adminToken',
): Promise<{ data: T | null; error: string | null }> => {
  const options: RequestInit = {};

  if (token) {
    const cookieStore = await cookies();
    const bearerToken = cookieStore.get(token)?.value;
    options.headers = {
      Authorization: `Bearer ${bearerToken}`,
    };
  }

  try {
    const response = await fetch(baseURL + path, {
      headers: options.headers,
      method: 'GET',
      ...(rev
        ? { cache: 'force-cache', next: { revalidate: rev, tags: [path] } }
        : { cache: 'no-store' }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return { data: null, error: `HTTP ${response.status}` };
    }
  } catch {
    return { data: null, error: 'Network error' };
  }
};

export const revalidateTags = async (tags: string) => {
  revalidateTag(tags, 'max');
  revalidatePath('/', 'page');
  revalidatePath('/', 'layout');
  console.log('revalidated =>', tags);
};

export const getSiteConfig = async (): Promise<SiteSettings | null> => {
  'use cache';
  cacheTag(SITE_CONFIG); // Tag for on-demand invalidation
  cacheLife('hours'); // Cache function result for 1 hour

  // No need for fetch-level caching - "use cache" handles it at the function level
  const data = await fetchOnServer(SITE_CONFIG);
  if (data.error) {
    return null;
  }
  return data?.data?.value as SiteSettings;
};

export const getHeaderScripts = async (): Promise<ScriptSettings | null> => {
  'use cache';
  cacheTag('header-scripts'); // Tag for on-demand invalidation
  cacheLife('hours'); // Cache function result for 1 hour

  const data = await fetchOnServer(HEADER_SCRIPTS);
  if (data.error) {
    return null;
  }
  return data?.data?.value as ScriptSettings;
};

export const getDynamicPages = async (): Promise<PageSettings | null> => {
  'use cache';
  cacheTag('dynamic-pages'); // Tag for on-demand invalidation
  cacheLife('hours'); // Cache function result for 1 hour

  const data = await fetchOnServer(DYNAMIC_PAGES);
  if (data.error) {
    return null;
  }
  return data?.data?.value as PageSettings;
};

// Invalidate cache tags on-demand
// Use updateTag in Server Actions for read-your-own-writes (immediate fresh data)
// Use revalidateTag in Route Handlers or for stale-while-revalidate behavior

export const invalidateSiteConfig = async () => {
  'use server';
  updateTag(SITE_CONFIG); // Immediate invalidation - next request waits for fresh data
};

export const invalidateHeaderScripts = async () => {
  'use server';
  updateTag('header-scripts');
};

export const invalidateDynamicPages = async () => {
  'use server';
  updateTag('dynamic-pages');
};

// Alternative: Stale-while-revalidate (serves cached data while fetching fresh in background)
export const revalidateSiteConfigInBackground = async () => {
  'use server';
  revalidateTag(SITE_CONFIG, 'max');
};

export const revalidateHeaderScriptsInBackground = async () => {
  'use server';
  revalidateTag('header-scripts', 'max');
};

export const revalidateDynamicPagesInBackground = async () => {
  'use server';
  revalidateTag('dynamic-pages', 'max');
};
