// DOM contract tests do not simulate a service worker or an offline browser.
export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}] as const,
    updateServiceWorker: async () => {},
  };
}
