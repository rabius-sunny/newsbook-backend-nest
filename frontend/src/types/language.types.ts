// Language model type
export type Language = {
  id: number;
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  isDefault: boolean;
  isActive: boolean;
  meta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

// API Response types
export type TLanguageList = {
  success: boolean;
  message: string;
  data: Language[];
};

export type TLanguageSingle = {
  success: boolean;
  message: string;
  data: Language;
};

export type TLanguageResponse = {
  success: boolean;
  message: string;
  data: any;
};

// Form input types
export type LanguageCreateInput = {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  isDefault?: boolean;
  isActive?: boolean;
  meta?: Record<string, unknown>;
};

export type LanguageUpdateInput = Partial<Omit<LanguageCreateInput, 'code'>>;
