const isProd = process.env.NODE_ENV === 'production';

export function getBasePath(): string {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/sampath')) {
      return '/sampath';
    }
    if (window.location.pathname.startsWith('/SampathVishwa')) {
      return '/SampathVishwa';
    }
    return '';
  }
  return isProd ? '/sampath' : '';
}

export const BASE_PATH = isProd ? '/sampath' : '';

export function withBasePath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getBasePath();
  return `${base}${cleanPath}`;
}
