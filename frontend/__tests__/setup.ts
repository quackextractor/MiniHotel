import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock next-intl
vi.mock('next-intl', () => {
  return {
    useTranslations: (namespace?: string) => {
      return (key: string, values?: Record<string, any>) => {
        const prefix = namespace ? `${namespace}.` : '';
        if (values) {
          let str = `${prefix}${key}`;
          Object.keys(values).forEach(k => {
            str = str.replace(new RegExp(`{${k}}`, 'g'), String(values[k]));
          });
          return str;
        }
        return `${prefix}${key}`;
      };
    },
    useLocale: () => 'en',
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => '/en/dashboard',
    useParams: () => ({ locale: 'en' }),
  };
});

// Mock @/i18n/routing
vi.mock('@/i18n/routing', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
    usePathname: () => '/en/dashboard',
    Link: ({ children, href, ...props }: any) => children,
    redirect: vi.fn(),
    getPathname: vi.fn(),
  };
});

// Mock ResizeObserver for JSDOM
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
