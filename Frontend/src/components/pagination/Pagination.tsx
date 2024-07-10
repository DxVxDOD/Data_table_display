import { DOTS, usePagination } from "../../hooks/usePagination";
import classnames from "classnames";
import "./pagination.css";
import { Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Pagination({
  total_count,
  page_size,
  sibling_count,
  current_page,
  on_page_change,
  class_name,
  setRange,
}: {
  total_count: number;
  page_size: number;
  sibling_count: number;
  current_page: number;
  on_page_change: Dispatch<SetStateAction<number>>;
  class_name: string;
  setRange: Dispatch<SetStateAction<{ start: number; finish: number }>>;
}) {
  const pagination_range = usePagination({
    total_count,
    page_size,
    sibling_count,
    current_page,
  });

  const [currMax, setCurrMax] = useState(1);

  if (!pagination_range) return null;
  if (current_page === 0 || pagination_range?.length < 2) return null;

  function on_next() {
    if (typeof current_page === "number") {
      on_page_change(current_page + 1);
      setRange((range) => {
        return {
          ...range,
          finish: (current_page + 1) * page_size,
        };
      });
    }
  }

  function on_previous() {
    if (typeof current_page === "number") {
      on_page_change(current_page - 1);
    }
  }

  const last_page = pagination_range[pagination_range.length - 1];

  return (
    <ul
      className={classnames("pagination-container p-2 w-[80%]", {
        [class_name]: class_name,
      })}
    >
      <button
        data-testid="left-arrow"
        aria-label="previous page"
        className={classnames("pagination-item", {
          disabled: current_page === 1,
        })}
        onClick={on_previous}
      >
        <span className="arrow left" />
      </button>
      {pagination_range.map((page_number) => {
        if (page_number === DOTS) {
          return (
            <li
              key={uuidv4()}
              data-testid="dots"
              className="pagination-item dots"
            >
              &#8230;
            </li>
          );
        }
        return (
          <li
            key={page_number as number}
            className={classnames("pagination-item", {
              selected: page_number === current_page,
            })}
            onClick={() => {
              if (typeof page_number === "number") {
                setCurrMax(Math.max(currMax, current_page));
                on_page_change(page_number);
                if (page_number > currMax) {
                  setRange((range) => {
                    return {
                      ...range,
                      finish: (page_number + 1) * page_size,
                    };
                  });
                }
              }
            }}
          >
            {page_number}
          </li>
        );
      })}
      <button
        data-testid="right-arrow"
        aria-label="previous page"
        className={classnames("pagination-item", {
          disabled: current_page === last_page,
        })}
        onClick={on_next}
      >
        <span className="arrow right" />
      </button>
    </ul>
  );
}
