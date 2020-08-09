const { useCallback } = require('react');

export const useMessage = () => {
  return useCallback(text => {
    if (window.M.toast && text) {
      window.M.toast({ html: text });
    }
  }, []);
};
