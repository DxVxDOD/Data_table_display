import { useMemo } from "react";
import { range } from "../utils/range";

export const DOTS = "...";

export function usePagination({
  total_count,
  page_size,
  sibling_count = 1,
  current_page,
}: {
  total_count: number;
  page_size: number;
  sibling_count: number;
  current_page: number;
}) {
  const paginationRange = useMemo(() => {
    const total_page_count = Math.ceil(total_count / page_size);
    const total_page_numbers = sibling_count + 5;

    if (total_page_numbers >= total_page_count)
      return range(1, total_page_count);

    const left_sibling_index = Math.max(current_page - sibling_count, 1);
    const right_sibling_index = Math.min(
      current_page + sibling_count,
      total_page_count,
    );

    const should_show_left_dots = left_sibling_index > 2;
    const should_show_right_dots = right_sibling_index < total_page_count - 2;

    const first_page_index = 1;
    const last_page_index = total_page_count;

    if (!should_show_left_dots && should_show_right_dots) {
      const left_item_count = 3 * (2 * sibling_count);
      const left_range = range(1, left_item_count);
      return [...left_range, DOTS, total_page_count];
    }

    if (should_show_left_dots && !should_show_right_dots) {
      const right_item_count = 3 + 2 * sibling_count;
      const right_range = range(
        total_page_count - right_item_count + 1,
        total_page_count,
      );
      return [first_page_index, DOTS, ...right_range];
    }

    if (should_show_left_dots && should_show_right_dots) {
      const mid_range = range(left_sibling_index, right_sibling_index);
      return [first_page_index, DOTS, ...mid_range, DOTS, last_page_index];
    }
  }, [total_count, page_size, sibling_count, current_page]);
  return paginationRange;
}
