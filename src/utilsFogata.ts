import { Contract } from "koilib";

export function log(msg: string, _data: unknown): void {
  const time = Date.now();
  const data = typeof _data === "object" ? _data : { data: _data };
  console.log(JSON.stringify({ time, msg, ...data }));
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
}

export function defineGetAllAccounts(
  fogata: Contract["functions"]
): Contract["functions"]["x"] {
  return async <T = Record<string, unknown>>() => {
    const accounts: string[] = [];
    const limit = 500;
    let fromAccount = "";
    while (true) {
      const { result } = (await fogata.get_accounts({
        start: fromAccount,
        limit,
        direction: "ascending",
      })) as {
        result: {
          accounts: string[];
        };
      };
      if (!result || !result.accounts || result.accounts.length === 0) break;
      accounts.push(...result.accounts);
      if (result.accounts.length < limit) break;
      fromAccount = result.accounts[result.accounts.length - 1];
    }
    return { operation: {}, result: { accounts } as T };
  };
}
