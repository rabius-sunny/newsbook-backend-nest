export type SiteLogo = {
  default?: string | null;
  dark?: string | null;
};

export type SiteTheme = {
  color: {
    primary?: string;
    secondary?: string;
    accent?: string;
    text?: string;
    footer_bg?: string;
    header_bg?: string;
    footer_text?: string;
    header_text?: string;
  };
  fontFamily?: string;
  darkMode?: boolean;
};

export type SocialLinks = {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  tiktok?: string;
};

export type SeoSettings = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  [key: string]: any;
};

export type HeaderNavigationItem = {
  title?: string;
  url?: string;
};

export type BreakingNewsItem = {
  id: string;
  title: string;
  url: string;
  publishedAt?: string;
};

export type HeaderSettings = {
  navigation?: HeaderNavigationItem[];
  breakingNews?: BreakingNewsItem[];
};

export type FooterCredit = {
  companyName?: string;
  url?: string;
};

export type FooterSettings = {
  copyright?: string;
  credit?: FooterCredit;
};

export type Language = {
  code: string;
  name: string;
  isDefault?: boolean;
};

export type AnalyticsSettings = {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
};

export type SiteSettings = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  shortDescription?: string;
  favicon?: string | null;
  logo: SiteLogo;
  theme: SiteTheme;
  socialLinks?: SocialLinks;
  seo?: SeoSettings;
  header?: HeaderSettings;
  footer?: FooterSettings;
  maintenanceMode?: boolean;
  locale?: string;
  languages?: Language[];
  analytics?: AnalyticsSettings;
};
