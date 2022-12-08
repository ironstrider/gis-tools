import React, { useRef, useState } from "react"
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

function OutputField({
  value,
  placeholder,
  label,
}: {
  label: string,
  value: string,
  placeholder: string | undefined,
}) {
  return (<>
    <label htmlFor="numeric-query" className="block text-sm font-medium text-gray-700">
      {label}
    </label>

    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> */}

    <div className="grid grid-cols-[auto_1fr] gap-2 mt-1">
      <CopyButton copyText={value} />
      {/* <button className="focus:border-sky-500 hover:bg-gray-50 stroke-gray-400 hover:shadow-sm rounded-md shadow-sm px-1 mt-1 border border-gray-300 focus:outline-none focus:ring-sky-500 focus:ring-1">
        <svg className="w-8 group-hover:rotate-[-4deg] group-hover:stroke-sky-500" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.9975 10.7499L11.7475 10.7499C10.6429 10.7499 9.74747 11.6453 9.74747 12.7499L9.74747 21.2499C9.74747 22.3544 10.6429 23.2499 11.7475 23.2499L20.2475 23.2499C21.352 23.2499 22.2475 22.3544 22.2475 21.2499L22.2475 12.7499C22.2475 11.6453 21.352 10.7499 20.2475 10.7499L18.9975 10.7499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M17.9975 12.2499L13.9975 12.2499C13.4452 12.2499 12.9975 11.8022 12.9975 11.2499L12.9975 9.74988C12.9975 9.19759 13.4452 8.74988 13.9975 8.74988L17.9975 8.74988C18.5498 8.74988 18.9975 9.19759 18.9975 9.74988L18.9975 11.2499C18.9975 11.8022 18.5498 12.2499 17.9975 12.2499Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M13.7475 16.2499L18.2475 16.2499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.7475 19.2499L18.2475 19.2499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <g className="opacity-0">
            <path d="M15.9975 5.99988L15.9975 3.99988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M19.9975 5.99988L20.9975 4.99988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M11.9975 5.99988L10.9975 4.99988" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </g>
        </svg>
      </button> */}
      <input
        type="text"
        name="numeric-query"
        id="numeric-query"
        readOnly={true}
        value={value}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md shadow-sm border-gray-300  focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
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
    <div className="container mx-auto">
      <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
        QGIS ObjectID Query Builder
      </h1>
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-rows-[auto_1fr] md:grid-cols-[1fr_auto_3fr]">
        <div className="col-span-1 md:row-span-2 md:pb-2">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">
            Object IDs
          </label>
          <div className="mt-1">
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
    </div>
  )
}