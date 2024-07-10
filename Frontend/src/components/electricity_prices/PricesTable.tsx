import { useState } from "react";
import {
  Electricity_Price,
  electricity_price_keys,
} from "../../../../Backend/src/utils/types/electricity_prices_type.ts";

export default function PricesTable({
  current_table_data,
  isError,
  isLoading,
  display,
}: {
  current_table_data: Electricity_Price[];
  isLoading: boolean;
  isError: boolean;
  display: boolean;
}) {
  const [check, setCheck] = useState<boolean[]>(
    new Array(electricity_price_keys.length).fill(false),
  );
  const [selected, setSelected] = useState<string[]>([]);

  function handle_change(position: number) {
    const updated: boolean[] = check.map((item, index) =>
      index === position ? !item : item,
    );
    setCheck(updated);

    const selected_fields: string[] = [];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i]) {
        selected_fields.push(electricity_price_keys[i]);
      }
    }
    setSelected(selected_fields);
  }

  if (isLoading) {
    return <div>isLoading</div>;
  }
  if (isError) return <div>isError...</div>;

  return (
    <>
      <table className="border-collapse relative ">
        <thead className="text-left">
          <tr className="font-bold bg-zinc-400 text-nowrap">
            {electricity_price_keys.map((item, index) => {
              if (display && selected.includes(item)) {
                return;
              }
              const title = (
                item.charAt(0).toUpperCase() + item.slice(1)
              ).replaceAll("_", " ");
              return (
                <th className="p-2 border border-zinc-600" key={title}>
                  <input
                    className="mr-1"
                    type="checkbox"
                    aria-checked={`${check[index]}`}
                    data-testid={`checkbox-${title}`}
                    aria-label={
                      "checkbox for selecting fields to display or download."
                    }
                    checked={check[index]}
                    onChange={() => handle_change(index)}
                  />
                  {title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-zinc-200">
          {current_table_data.map((price: Electricity_Price) => {
            return (
              <tr
                data-testid="tr"
                className="even:bg-zinc-100 hover:bg-zinc-300 "
                key={price.time}
              >
                {Object.entries(price).map(([key, value]) => {
                  if (display && selected.includes(key)) {
                    return;
                  }
                  return (
                    <td
                      data-testid="td"
                      className="p-3 text-nowrap break-words hover:font-bold border border-zinc-500"
                      key={key}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
