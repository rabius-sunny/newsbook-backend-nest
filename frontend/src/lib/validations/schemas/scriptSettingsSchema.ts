import { z } from 'zod';

// === Script Item Schema ===
const scriptItemSchema = z.object({
  id: z.string().optional(), // for tracking purposes
  name: z.string().optional(), // Made optional for better UX
  content: z.string().optional(), // Made optional for better UX
  enabled: z.boolean(), // Required boolean, no default here
});

// === Main Site Settings Schema ===
export const scriptSettingsSchema = z.object({
  scripts: z.array(scriptItemSchema), // Removed .default([]) to make it required
});

export type ScriptItem = z.infer<typeof scriptItemSchema>;
export type ScriptSettings = z.infer<typeof scriptSettingsSchema>;
