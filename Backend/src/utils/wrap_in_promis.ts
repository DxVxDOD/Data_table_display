export async function wrap_in_promise<T>(func: T) {
  const [result] = await Promise.allSettled([func]);
  if (result.status === "rejected") {
    return { data: null, error: new Error(result.reason) };
  }

  return { data: result.value, error: null };
}
