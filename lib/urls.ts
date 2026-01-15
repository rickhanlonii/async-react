export function homeUrl(tab: string, search: string) {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (tab && tab !== "all") params.set("tab", tab);
  return `/?${params.toString()}`;
}
