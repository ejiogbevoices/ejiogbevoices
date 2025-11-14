export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getLanguageLabel(lang: string): string {
  const labels: Record<string, string> = {
    original: 'Original',
    en: 'English',
    pt: 'Português',
    fr: 'Français'
  };
  return labels[lang] || lang;
}
