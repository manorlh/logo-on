import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function TermsPage() {
  const cookieStore = cookies();
  const savedLang = cookieStore.get('NEXT_LOCALE')?.value;
  const lang = (savedLang === 'en' || savedLang === 'he' || savedLang === 'ar') ? savedLang : 'he';
  
  redirect(`/${lang}/terms`);
} 