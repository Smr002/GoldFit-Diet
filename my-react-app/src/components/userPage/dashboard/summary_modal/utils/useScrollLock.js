import { useEffect } from 'react';

/**
 * Custom hook to prevent body scrolling when modal is open
 */
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to fix the body in place
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Get the scroll position from the body's top property
      const scrollY = document.body.style.top;
      
      // Remove the fixed position styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    
    return () => {
      // Cleanup: restore normal scrolling behavior if component unmounts
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isLocked]);
};

export default useScrollLock;