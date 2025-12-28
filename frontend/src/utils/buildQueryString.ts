// Utility: Convert Params Object to URLSearchParams
export const buildQueryString = (
  params?: Record<string, string | string[] | number | boolean | undefined>,
) => {
  if (!params) return '';

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined) // Remove undefined values
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');
  return queryString ? `?${queryString}` : '';
};
