export function formatTime(
  dateString: string,
  locale: string = 'en-US',
  showTime: boolean = false, // show time in absolute format
): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // If enabled → show relative time for <24h
  if (!showTime && diffHours < 24) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minute'); // "30 minutes ago"
    }
    return rtf.format(-diffHours, 'hour'); // "5 hours ago"
  }

  // Else → absolute date (optionally with time)
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(showTime && { hour: 'numeric', minute: '2-digit', hour12: true }),
  }).format(date);
}
