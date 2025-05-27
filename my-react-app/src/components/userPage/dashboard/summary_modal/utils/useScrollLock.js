import { useEffect } from 'react';

/**
 * Custom hook to prevent content scrolling when modal is open
 * without affecting the fixed header
 */
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Add padding to prevent content shift when scrollbar disappears
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Save current position and lock scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Get the scroll position from body's top property
      const scrollY = document.body.style.top;
      
      // Reset body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      document.body.style.width = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.replace('px', ''), 10) * -1);
      }
    }

    return () => {
      // Cleanup function to reset styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      document.body.style.width = '';
    };
  }, [isLocked]);
};

export default useScrollLock;