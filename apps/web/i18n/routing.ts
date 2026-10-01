import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ky', 'ru', 'en'],
  defaultLocale: 'ky',
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
