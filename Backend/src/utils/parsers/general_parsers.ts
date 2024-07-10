import { is_string } from "../type_guards/general_guards";

export function string_parser(param: unknown) {
  if (!param || !is_string(param)) {
    return new Error("param not string");
  }
  return param;
}
