import { createContext, useContext } from 'react';

export const BlogNavigationContext = createContext(null);

export function useBlogNavigation() {
  const value = useContext(BlogNavigationContext);
  if (!value) throw new Error('useBlogNavigation must be used inside BlogRouter.');
  return value;
}
