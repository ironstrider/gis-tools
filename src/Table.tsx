import React, { ReactNode } from "react";
import { Tab } from "@headlessui/react";
import CopyButton from "./CopyButton";

interface Header {
  key: string,
  label: string,
}

type Row = Record<string, any>

interface TableProps {
  headers: Header[],
  rows: Row[]
}

interface TableDataViewProps {
  label: string,
  table: TableProps,
  labelClass?: string,
  controlsClass?: string,
  viewClass?: string,
}

// TODO: handle escaped cells
export function exportCsv(headers: Header[], rows: Row[], delimiter = ',') {
  const headerRow = headers.map(({ label }) => label).join(delimiter)
  const outputRows = rows.map(row => {
    return headers.map(({ key }) => row[key]).join(delimiter);
  });

  return [
    headerRow,
    ...outputRows
  ].join("\n");
}

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm py-8 border border-slate-200" >
      {/* TODO: extract table styling; add dark mode (see https://tailwindcss.com/docs/table-layout) */}
      <table className="border-collapse table-auto w-full text-sm  text-slate-700">
        <thead>
          <tr>
            {
              headers.map(({ label }) => {
                return <th key={label} className="border-b border-slate-200 font-medium p-4 pl-8 pt-0 pb-3 text-slate-500 text-left">{label}</th>
              })
            }
          </tr>
        </thead>
        <tbody className="bg-white">
          {
            rows.map((row, i) => {
              return <tr key={i}>
                {
                  headers.map(({ key }) => {
                    return <td key={key} className="border-b border-slate-100 p-4 pl-8 text-slate-500">{row[key]}</td>
                  })
                }
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  )
}

function WidgetLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="block text-md uppercase font-bold text-slate-500" {...props}/>
  )
}

export function TableDataView({
  label,
  table,
  labelClass,
  controlsClass,
  viewClass,
}: TableDataViewProps) {
  const { headers, rows } = table;
  const csv = exportCsv(headers, rows);

  return (
    <Tab.Group>
      <div className={"self-end " + (labelClass || "col-span-1")}>
        <WidgetLabel>{label}</WidgetLabel>
      </div>
      <div className={"flex justify-end align-end gap-x-4 " + (controlsClass || "col-span-1")}>
        <Tab.List className="inline-flex space-x-1 rounded-lg bg-slate-50 p-0.5">
          {
            ["Table", "CSV"].map(label => {
              return (
                <Tab as={React.Fragment} key={label}>
                  {({ selected }) => {
                    return (
                      <button className={"focus:outline-none focus:ring-sky-500 focus:ring-2 flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 " + (selected ? "bg-white shadow" : "")}>
                        {label}
                      </button>
                    )
                  }}
                </Tab>
              )
            })
          }
        </Tab.List>

        <div className="border-r border-r-slate-100"></div>

        <CopyButton copyText={csv} />
      </div>
      <div className={viewClass}>

        <Tab.Panels>
          <Tab.Panel className="focus:outline-none focus:ring-sky-500 focus:ring-2 rounded-md">
            <Table headers={headers} rows={rows} /></Tab.Panel>
          <Tab.Panel className="focus:outline-none focus:ring-sky-500 focus:ring-2 rounded-md">
            <pre className="p-4 border border-slate-200 rounded-lg">{csv}</pre>
          </Tab.Panel>
        </Tab.Panels>

      </div>
    </Tab.Group>
  )
}

export function TableDataInput({
  value,
  onChange,
  labelClass,
  viewClass,
}: {
  value: string | undefined,
  onChange: (newValue: string) => void,
  labelClass?: string,
  viewClass?: string,
}) {

  return (
    <>
      <div className={labelClass}>
        <WidgetLabel>Input</WidgetLabel>
      </div>

      <div className={viewClass}>
        <textarea
          id="data-input"
          name="data-input"
          rows={10}
          className="block w-full h-full resize-none rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          placeholder="..."
          value={value}
          onChange={e => { onChange(e.target.value) }}
        />
      </div>
    </>
  )

}