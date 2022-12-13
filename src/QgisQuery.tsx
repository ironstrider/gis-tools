import React, { ReactNode, useId, useRef, useState } from "react"
import CopyButton from "./CopyButton";

function makeNumericQuery(ids: string[]) {
  return `in(${ids.map(id => `${id}`).join(", ")})`
}

function makeStringQuery(ids: string[]) {
  return `in(${ids.map(id => `'${id}'`).join(", ")})`
}

function processIdsText(idsText: string) {
  return idsText.trim().split(/[,\s]+/g);
}

// TODO: should this be extracted to its own file? how to generalise and avoid repetition?
//       or should classes be added to label inline and tailwind themes used for generalisation?
function WidgetLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="block text-md uppercase font-bold text-slate-500" {...props}/>
  )
}

function OutputField({
  value,
  placeholder,
  label,
}: {
  label: string,
  value: string,
  placeholder: string | undefined,
}) {
  const inputId = useId();
  return (<>
    <WidgetLabel>{label}</WidgetLabel>

    <div className="grid grid-cols-[auto_1fr] gap-2 mt-2">
      <CopyButton copyText={value} />
      <input
        type="text"
        name={inputId}
        id={inputId}
        readOnly={true}
        value={value}
        placeholder={placeholder}
        className="block w-full rounded-md shadow-sm border-gray-300  focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
      />
    </div>
  </>)
}

export default function QgisQuery() {
  const [idsInput, setIdsInput] = useState<string | null>(null);

  const onIdsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdsInput(e.target.value);
  }

  const numericQuery = idsInput && makeNumericQuery(processIdsText(idsInput));
  const stringQuery = idsInput && makeStringQuery(processIdsText(idsInput));

  let inputPlaceholder = "1\n2\n3\n4\n…"
  // "⋮"
  const numericPlaceholder = makeNumericQuery(processIdsText(inputPlaceholder))
  const stringPlaceholder = makeStringQuery(processIdsText(inputPlaceholder))
  inputPlaceholder = inputPlaceholder.replace("…", "⋮")

  return (
    <div className="mt-6 grid gap-6 grid-cols-1 md:grid-rows-[auto_1fr] md:grid-cols-[1fr_auto_3fr]">
      <div className="col-span-1 md:row-span-2 md:pb-2">
        <WidgetLabel htmlFor="ids">Object IDs</WidgetLabel>
        <div className="mt-2">
          <textarea
            id="ids"
            name="ids"
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            placeholder="1&#10;2&#10;3&#10;4&#10;⋮"
            onChange={onIdsChange}
          />
        </div>
      </div>

      {/* border */}
      <div className="md:row-span-2 md:border-l md:border-l-gray-100 md:mt-0 mt-2 border-t border-t-gray-100" />

      <div className="col-span-1">
        <OutputField label="Numeric" value={numericQuery ?? ''} placeholder={numericPlaceholder} />
      </div>

      <div className="col-span-1">
        <OutputField label="String" value={stringQuery ?? ''} placeholder={stringPlaceholder} />
      </div>
    </div>
  )
}