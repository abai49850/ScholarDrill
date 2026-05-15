// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://scholardrill.com.au';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/auth',
    '/practice',
    '/coach',
    '/naplan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  // 2. Dynamic Blog/Guide Routes
  const { data: posts } = await supabase
    .from('content_posts')
    .select('slug, updated_at')
    .eq('is_published', true);

  const dynamicPosts = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 3. Exam State Routes
  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
  const examRoutes = states.map((state) => ({
    url: `${baseUrl}/exams/${state.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...dynamicPosts, ...examRoutes];
}
