import { useEffect } from 'react';

/**
 * Custom hook to prevent body scrolling when modal is open
 */
const useScrollLock = (isLocked) => {
  useEffect(() => {
    // Get scrollbar width to prevent content shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (isLocked) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to fix the body in place and prevent content shift
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollBarWidth}px`; // Compensate for scrollbar
      document.body.style.overflow = 'hidden'; // Prevent any potential scrolling
    } else {
      // Get the scroll position from the body's top property
      const scrollY = document.body.style.top;
      
      // Remove all the fixed position styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    
    return () => {
      // Cleanup: restore all styles if component unmounts
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [isLocked]);
};

export default useScrollLock;