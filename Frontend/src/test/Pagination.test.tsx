import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import { string_parser } from "../../../Backend/src/utils/parsers/general_parsers";
import Pagination from "../components/pagination/Pagination";

describe("<Pagination />", () => {
  // let left_arrow: HTMLButtonElement;
  let right_arrow: HTMLButtonElement;
  let container: HTMLElement;
  let dots: HTMLElement;
  let last_page_number: number;
  let user: UserEvent;

  beforeEach(() => {
    function Wrapper() {
      const [currentPage, setCurrentPage] = useState(1);
      const [range, setRange] = useState({ start: 0, finish: 30 });
      user = userEvent.setup();

      return (
        <Pagination
          current_page={currentPage}
          total_count={4000}
          page_size={15}
          sibling_count={1}
          on_page_change={setCurrentPage}
          class_name="pagination-bar"
          setRange={setRange}
        />
      );
    }

    container = render(<Wrapper />).container;

    // left_arrow = screen.getByTestId("left-arrow");
    right_arrow = screen.getByTestId("right-arrow");
    dots = screen.getByTestId("dots");
    const nextSibling = string_parser(dots.nextSibling?.textContent);

    if (nextSibling instanceof Error) {
      throw new Error(nextSibling.message);
    }

    last_page_number = parseFloat(nextSibling);
  });

  test("All elements are at the right place when currentPage === 1", () => {
    const selected = container.querySelector(".selected") as HTMLElement;

    expect(selected.textContent).toEqual("1");
    expect(last_page_number).toEqual(Math.ceil(4000 / 15));
  });
  test("Clicking once", async () => {
    await user.click(right_arrow);

    const selected = container.querySelector(".selected") as HTMLElement;

    expect(selected.textContent).toEqual("2");
  });
  test("Clicking tree times", async () => {
    await user.click(right_arrow);
    await user.click(right_arrow);
    await user.click(right_arrow);

    const selected = container.querySelector(".selected") as HTMLElement;

    expect(selected.textContent).toEqual("4");

    const all_dots = screen.getAllByTestId("dots");
    expect(all_dots).toHaveLength(2);
    expect(all_dots[0].nextSibling?.textContent).toEqual("3");
    expect(all_dots[1].nextSibling?.textContent).toEqual(`${last_page_number}`);
  });
});
