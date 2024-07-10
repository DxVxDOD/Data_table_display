import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import Range from "../components/electricity_prices/Range";

describe("<Range />", () => {
  function Wrapper() {
    const [range, setRange] = useState<{ start: number; finish: number }>({
      start: 0,
      finish: 30,
    });

    return (
      <Range start={range.start} finish={range.finish} setRange={setRange} />
    );
  }

  let finish_input: HTMLElement;
  let start_input: HTMLElement;
  let button: HTMLButtonElement;

  beforeEach(() => {
    render(<Wrapper />);
    finish_input = screen.getByPlaceholderText("30");
    start_input = screen.getByPlaceholderText("0");
    button = screen.getByText("Set");
  });

  test("Displays all the required elements:", () => {
    expect(start_input).toBeDefined();
    expect(finish_input).toBeDefined();
    expect(button).toBeDefined();
  });
});
