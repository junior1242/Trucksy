export async function api(
  path: string,
  opts: any = {},
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
