import { fireEvent, render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import useSWR from "swr";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { electricity_price_keys } from "../../../Backend/src/utils/types/electricity_prices_type";
import PricesTable from "../components/electricity_prices/PricesTable";
import { fetcher } from "../utils/fetcher";
import { mock_prices } from "./mock_prices";
import userEvent, { UserEvent } from "@testing-library/user-event";

const server = setupServer(
  http.get(`/api/data/${0}-${30}`, () => {
    return HttpResponse.json(mock_prices);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<PricesTable />", () => {
  let user: UserEvent;
  function Wrapper() {
    const { data = [] } = useSWR(`/api/data/${0}-${30}`, fetcher);
    user = userEvent.setup();

    return (
      <PricesTable
        display={false}
        current_table_data={data}
        isLoading={false}
        isError={false}
      />
    );
  }

  let checkboxes: HTMLElement[];

  beforeEach(() => {
    render(<Wrapper />).container;
    checkboxes = screen.getAllByRole("checkbox");
  });

  test("tr contains all required th with correctly formatted names", async () => {
    const gas = await screen.findByText("Gas");
    expect(gas).toBeDefined;
    const time = await screen.findByText("Time");
    expect(time).toBeDefined;
    const price = await screen.findByText("Price");
    expect(price).toBeDefined;
    const volume = await screen.findByText("Volume");
    expect(volume).toBeDefined;
    const settlement_period = await screen.findByText("Settlement period");
    expect(settlement_period).toBeDefined;
    const hour = await screen.findByText("Hour");
    expect(hour).toBeDefined;
    const quarter = await screen.findByText("Quarter");
    expect(quarter).toBeDefined;
    const year = await screen.findByText("Year");
    expect(year).toBeDefined;
    const day_of_year = await screen.findByText("Day of year");
    expect(day_of_year).toBeDefined;
    const day_of_month = await screen.findByText("Day of month");
    expect(day_of_month).toBeDefined;
    const week_of_year = await screen.findByText("Week of year");
    expect(week_of_year).toBeDefined;
    const sap = await screen.findByText("SAP");
    expect(sap).toBeDefined;
    const eu_ets = await screen.findByText("EU ETS");
    expect(eu_ets).toBeDefined;
    const indo = await screen.findByText("INDO");
    expect(indo).toBeDefined;
  });

  test("Each th has a checkbox input", () => {
    expect(checkboxes).toHaveLength(electricity_price_keys.length);
    checkboxes.map((checkbox) => {
      expect(checkbox.ariaChecked).toBe("false");
    });
  });

  test("Checkboxes handle change", () => {
    checkboxes.map(async (checkbox) => {
      await user.click(checkbox);
      expect((checkbox as HTMLInputElement).checked).toBe(true);
    });
  });

  test("tds have all values correctly displayed", () => {
    const all_tr = screen.getAllByTestId("tr");
    expect(all_tr).toHaveLength(mock_prices.length);
    for (let i = 0; i < all_tr.length; i++) {
      const td_array = Array.from(all_tr[i].children) as HTMLTableCellElement[];
      expect(td_array.length).toBeDefined();
      expect(td_array.length).toBeGreaterThan(0);
      expect(td_array).toHaveLength(electricity_price_keys.length);
      for (let j = 0; j < td_array.length; j++) {
        expect(td_array[j].textContent).toEqual(
          Object.values(mock_prices[i])[j],
        );
      }
    }
  });
});
