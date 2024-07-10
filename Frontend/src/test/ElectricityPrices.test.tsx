import { render, screen } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
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
import ElectricityPrices from "../components/electricity_prices/ElectricityPrices";
import { fetcher } from "../utils/fetcher";
import { mock_prices } from "./mock_prices";

const server = setupServer(
  http.get(`/api/data/${0}-${30}`, () => {
    return HttpResponse.json(mock_prices);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<ElectricityPrices />", () => {
  let user: UserEvent;
  function Wrapper() {
    useSWR(`/api/data/range/${0}-${30}`, fetcher);
    user = userEvent.setup();

    return <ElectricityPrices />;
  }

  beforeEach(() => {
    render(<Wrapper />);
  });

  test("Setting new start and finish ranges", async () => {
    const start = screen.getByTestId("range-start");
    const finish = screen.getByTestId("range-finish");
    const set = screen.getByTestId("range-set");

    await user.type(start, "50");
    await user.type(finish, "100");
    await user.click(set);

    expect(screen.getByText("2017-01-02 01:00:00")).toBeDefined();
    expect(screen.getByDisplayValue("50")).toBeDefined();
    expect(screen.getByDisplayValue("100")).toBeDefined();
  });

  test("Pagination changes the data displayed", async () => {
    const right_arrow = screen.getByTestId("right-arrow");

    await user.click(right_arrow);

    expect(screen.getByText("2017-01-01 14:30:00")).toBeDefined();

    const left_arrow = screen.getByTestId("left-arrow");

    await user.click(left_arrow);

    expect(screen.getByText("2017-01-01 00:00:00")).toBeDefined();
  });

  test("Data the next 15 data is fetched", async () => {
    const right_arrow = screen.getByTestId("right-arrow");

    await user.click(right_arrow);
    await user.click(right_arrow);

    expect(screen.getByPlaceholderText("45")).toBeDefined();
    expect(screen.getByText("2017-01-01 21:00:00")).toBeDefined();
  });

  test("Selecting fields fields to be removed and reset", async () => {
    const time = screen.getByTestId("checkbox-Time");
    const indo = screen.getByTestId("checkbox-INDO");
    const remove = screen.getByText("Remove fields");

    await user.click(time);
    await user.click(indo);
    await user.click(remove);

    expect(screen.queryByTestId("checkbox-Time")).toBeNull();
    expect(screen.queryByTestId("checkbox-INDO")).toBeNull();

    const reset = screen.getByText("Reset");

    await user.click(reset);

    expect(screen.queryByTestId("checkbox-Time")).toBeDefined();
    expect(screen.queryByTestId("checkbox-INDO")).toBeDefined();
  });
});
