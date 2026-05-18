export async function GetTransactions(baseApi: string, token: string) {
  const response = await fetch(`${baseApi}/auth/v1/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((value) => value.json());

  return response.data;
}
