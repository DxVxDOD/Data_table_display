import { Dispatch, FormEvent, SetStateAction } from "react";
import { useForm } from "../../hooks/useForm";
import { string_parser } from "../../../../Backend/src/utils/parsers/general_parsers";
import toast from "react-hot-toast";

export default function Range({
  start,
  finish,
  setRange,
}: {
  start: number;
  finish: number;
  setRange: Dispatch<
    SetStateAction<{
      start: number;
      finish: number;
    }>
  >;
}) {
  const { reset: start_input_reset, ...start_input } = useForm("text");
  const { reset: finish_input_reset, ...finish_input } = useForm("text");

  function handle_submit(e: FormEvent) {
    e.preventDefault();

    const form_start = string_parser(start_input.value);
    if (form_start instanceof Error) {
      toast.error("Provided value can not be used.");
      return;
    }
    const form_finish = string_parser(finish_input.value);
    if (form_finish instanceof Error) {
      toast.error("Provided value can not be used.");
      return;
    }

    setRange({
      start: parseFloat(form_start),
      finish: parseFloat(form_finish),
    });
  }

  return (
    <div className=" w-full flex gap-3">
      <form className="flex gap-3 " onSubmit={handle_submit}>
        <input
          data-testid="range-start"
          className="border p-1 pl-2 border-zinc-500"
          {...start_input}
          name="Start"
          placeholder={`${start}`}
          aria-label="Defines the starting range of the data displayed. Default: 0"
        />
        <input
          data-testid="range-finish"
          className="border p-1 pl-2 border-zinc-500"
          {...finish_input}
          name="Finish"
          placeholder={`${finish}`}
          aria-label="Defines the end range of the data displayed. Default: 30"
        />
        <button
          data-testid="range-set"
          aria-label="Sets the new range for the data elements to be displayed"
          className="border border-zinc-500 px-3 hover:bg-zinc-50 active:bg-white active:border-black"
        >
          Set
        </button>
      </form>
    </div>
  );
}
