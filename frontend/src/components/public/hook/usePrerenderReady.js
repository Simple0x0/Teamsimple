import { useEffect } from 'react';

/**
 * Fires "render-event" when all loading flags are false
 * @param {boolean[]} loadingStates - array of booleans (e.g. [blogsLoading, projectsLoading])
 */
export function usePrerenderReady(loadingStates = []) {
  useEffect(() => {
    const allLoaded = loadingStates.every((loading) => !loading);
    if (allLoaded) {
      document.dispatchEvent(new Event('render-event'));
    }
  }, [loadingStates]);
}
