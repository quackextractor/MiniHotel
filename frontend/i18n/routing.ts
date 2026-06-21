import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import localesData from './locales.json';

const availableLocaleCodes = localesData.map(l => l.code);

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: availableLocaleCodes,

    // Used when no locale matches
    defaultLocale: 'en'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
