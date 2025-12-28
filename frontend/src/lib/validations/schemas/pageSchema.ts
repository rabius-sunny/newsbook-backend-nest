import { z } from 'zod';

// === Page Content Schema (for individual page content editing) ===
export const pageContentSchema = z.object({
  id: z.string().optional(), // for tracking purposes
  title: z.string().min(1, 'Title is required'),
  pageSlug: z.string().min(1, 'Page slug is required'),
  content: z.string().min(1, 'Content is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean(),
});

// === Page Item Schema (for tree structure and menu management) ===
const pageItemSchema = z.object({
  id: z.string().optional(), // for tracking purposes
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  parentSlug: z.string().optional(), // parent slug for hierarchy
  isActive: z.boolean(),
  showInMenu: z.boolean(), // whether to show in navigation menu
  menuOrder: z.number(), // for drag-and-drop ordering
  depth: z.number(), // hierarchy depth
  path: z.string().optional(), // full path like "/parent/child"
  hasContent: z.boolean(), // whether this page has content or is just a menu item
  icon: z.string().optional(), // optional icon for menu display
  target: z.enum(['_self', '_blank']), // link target
  url: z.string().optional(), // external URL if it's an external link
});

// === Main Page Settings Schema ===
export const pageSchema = z.object({
  pages: z.array(pageItemSchema),
});

// === Tree Node Interface (for UI display) ===
export interface PageTreeNode extends Omit<PageItem, 'children'> {
  children: PageTreeNode[];
  level: number;
}

export type PageContent = z.infer<typeof pageContentSchema>;
export type PageItem = z.infer<typeof pageItemSchema>;
export type PageSettings = z.infer<typeof pageSchema>;
