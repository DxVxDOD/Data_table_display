export function is_string(param: unknown): param is string {
  return typeof param === "string" || param instanceof String;
}
