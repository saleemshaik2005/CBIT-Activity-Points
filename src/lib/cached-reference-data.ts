import { unstable_cache, revalidateTag } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ActivityCategory, SystemSettings } from '@/types';
import {
  CBIT_24_CATEGORIES,
  CBIT_COLLEGE_NAME,
  CBIT_COLLEGE_CODE,
  DEFAULT_REGULAR_TARGET_POINTS,
  DEFAULT_REGULAR_MAX_POINTS,
  DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
  DEFAULT_LATERAL_ENTRY_MAX_POINTS,
} from '@/lib/mar-constants';

/**
 * Accelerated Edge Reference Data Caching
 * Caches the 24 static CBIT MAR Categories in the Next.js Data Cache.
 * Prevents redundant database roundtrips on high-concurrency requests.
 */
export const getCachedCategories = unstable_cache(
  async (): Promise<ActivityCategory[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('activity_categories')
        .select('*')
        .order('sno', { ascending: true })
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        return CBIT_24_CATEGORIES;
      }

      return data as ActivityCategory[];
    } catch {
      return CBIT_24_CATEGORIES;
    }
  },
  ['cbit-mar-categories'],
  {
    revalidate: 3600, // Revalidate every hour or on-demand
    tags: ['mar-categories'],
  }
);

/**
 * Accelerated System Settings Caching
 */
export const getCachedSettings = unstable_cache(
  async (): Promise<SystemSettings> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('system_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return {
          id: 1,
          college_name: CBIT_COLLEGE_NAME,
          college_code: CBIT_COLLEGE_CODE,
          regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
          regular_max_points: DEFAULT_REGULAR_MAX_POINTS,
          lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
          lateral_entry_max_points: DEFAULT_LATERAL_ENTRY_MAX_POINTS,
          academic_year: '2025-2026',
        };
      }

      return data as SystemSettings;
    } catch {
      return {
        id: 1,
        college_name: CBIT_COLLEGE_NAME,
        college_code: CBIT_COLLEGE_CODE,
        regular_target_points: DEFAULT_REGULAR_TARGET_POINTS,
        regular_max_points: DEFAULT_REGULAR_MAX_POINTS,
        lateral_entry_target_points: DEFAULT_LATERAL_ENTRY_TARGET_POINTS,
        lateral_entry_max_points: DEFAULT_LATERAL_ENTRY_MAX_POINTS,
        academic_year: '2025-2026',
      };
    }
  },
  ['cbit-system-settings'],
  {
    revalidate: 3600,
    tags: ['system-settings'],
  }
);

/**
 * Invalidate cached categories on administrative edits
 */
export async function invalidateCategoriesCache() {
  try {
    revalidateTag('mar-categories', 'max');
  } catch (err) {
    console.warn('[Cache Invalidation] Could not invalidate mar-categories tag:', err);
  }
}

/**
 * Invalidate cached settings on administrative edits
 */
export async function invalidateSettingsCache() {
  try {
    revalidateTag('system-settings', 'max');
  } catch (err) {
    console.warn('[Cache Invalidation] Could not invalidate system-settings tag:', err);
  }
}
