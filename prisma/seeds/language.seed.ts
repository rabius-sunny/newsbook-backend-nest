import { PrismaClient, Language } from '@prisma/client';

const languageData = [
  {
    code: 'bn',
    name: 'বাংলা',
    direction: 'ltr',
    isDefault: true,
    isActive: true,
    meta: {
      flag: '🇧🇩',
      locale: 'bn-BD',
      nativeName: 'বাংলা',
    },
  },
  {
    code: 'en',
    name: 'English',
    direction: 'ltr',
    isDefault: false,
    isActive: true,
    meta: {
      flag: '🇺🇸',
      locale: 'en-US',
      nativeName: 'English',
    },
  },
];

export async function seedLanguages(prisma: PrismaClient): Promise<Language[]> {
  const languages: Language[] = [];

  for (const data of languageData) {
    const language = await prisma.language.upsert({
      where: { code: data.code },
      update: data,
      create: data,
    });
    languages.push(language);
  }

  return languages;
}
