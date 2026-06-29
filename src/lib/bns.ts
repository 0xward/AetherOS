export async function resolveBnsName(address: string): Promise<string | null> {
  if (!address) return null;
  try {
    const res = await fetch(`https://api.hiro.so/v1/addresses/stacks/${address}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.names?.[0] || null;
  } catch { return null; }
}
