export async function GetTransactionById(baseApi: string, token: string) {
  const response = await fetch(`${baseApi}/auth/v1/transactions/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((value) => value.json());

  return response.data;
}
