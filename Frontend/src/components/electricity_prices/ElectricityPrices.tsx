import { EventHandler, MouseEventHandler, useMemo, useState } from "react";
import useSWR from "swr";
import { Electricity_Price } from "../../../../Backend/src/utils/types/electricity_prices_type.ts";
import { fetcher } from "../../utils/fetcher.ts";
import Pagination from "../pagination/Pagination";
import "../pagination/pagination.css";
import PricesTable from "./PricesTable.tsx";
import Range from "./Range.tsx";
import { User } from "../../../../Backend/src/utils/types/user.ts";

export default function ElectricityPrices({ user }: { user: User }) {
  const [range, setRange] = useState({ start: 0, finish: 30 });
  const [currentPage, setCurrentPage] = useState(1);
  const [display, setDisplay] = useState(false);
  const pageSize = 15;

  const {
    data = [],
    isLoading,
    error,
  } = useSWR(`/api/data/range/${range.start}-${range.finish}`, fetcher);
  const { data: len } = useSWR("/api/data/len", fetcher);

  function handle_logout() {
    window.localStorage.clear();
    location.reload();
  }

  const current_table_data = useMemo(() => {
    const first_page_index = (currentPage - 1) * pageSize;
    const last_page_index = first_page_index + pageSize;

    return (data as Electricity_Price[]).slice(
      first_page_index,
      last_page_index,
    );
  }, [currentPage, data, pageSize]);

  return (
    <section className=" transition-all flex flex-col text-xs xl:text-sm 2xl:text-base items-center font-sans">
      <section>
        <div className="flex pb-1">
          <Range
            start={range.start}
            finish={range.finish}
            setRange={setRange}
          />
          <button
            onClick={() => setDisplay(!display)}
            aria-label="On press displays the selected fields"
            className="text-nowrap border border-zinc-500 px-3 hover:bg-zinc-50 active:bg-white active:border-black"
          >
            {display ? "Reset" : "Remove fields"}
          </button>
          {user && (
            <button
              onClick={handle_logout}
              data-testid="logout-button"
              aria-label="Logout button"
              className="border ml-2 border-zinc-500 p-1 px-2 hover:bg-zinc-50 active:bg-white active:border-black"
            >
              Logout
            </button>
          )}
        </div>
        <PricesTable
          display={display}
          isError={error && true}
          isLoading={isLoading}
          current_table_data={current_table_data}
        />
      </section>
      <Pagination
        current_page={currentPage}
        total_count={len}
        page_size={pageSize}
        sibling_count={1}
        on_page_change={setCurrentPage}
        class_name={"pagination-bar"}
        setRange={setRange}
      />
      {}
    </section>
  );
}
