const isCustomEventSupported =
  typeof window !== 'undefined' && !!window.CustomEvent;

export const createCustomEvent = <T>(
  type: string,
  options?: CustomEventInit<T>
): CustomEvent<T> => {
  if (isCustomEventSupported) return new CustomEvent(type, options);
  const event = new CustomEvent(
    type,
    {
      bubbles: false,
      cancelable: options?.cancelable || false,
      detail: options?.detail || undefined
    }
  );
  return event;
};
