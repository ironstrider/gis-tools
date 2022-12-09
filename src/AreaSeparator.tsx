import { Tab } from "@headlessui/react";
import React, { useState } from "react";
import CopyButton from "./CopyButton";

const sampleInput = `
RE      PERCENT TotalArea_ha
1.11.2a/1.7.7a/1.11.8   65/30/5 0.002374634
1.7.7a/1.11.2a  60/40   0.007693042
1.11.8  100     0.102844507
1.3.6a/1.3.7    50/50   0.117788037
1.11.2a 100     0.134855322
1.7.5b/1.7.5    70/30   0.151183447
1.7.5b/1.7.5    70/30   0.171210474
1.11.2a/1.3.6a  95/5    0.207005737
`;

function parseRawInput(dataText: string) {
  const rawRows = dataText.trim().split("\n");
  const header = rawRows.shift();
  const rows = rawRows.map((rowText, i) => {
    const cells = rowText.split(/[\s]+/g);

    const id = i + 1;
    const regions = cells[0].split('/');
    const proportions = cells[0].split('/').map(x => parseFloat(x));
    const totalAreaHa = parseFloat(cells[0]);

    return { id, regions, proportions, totalAreaHa }
  });

  return { header, rows };
}

function compare(a, b) {
  return a < b ? -1 : (a > b) ? 1 : 0
}

function expandRegions(rows) {
  // 1. expand (flatMap) rows by pairs of (region,proportion) separated by "/"
  const result = rows.flatMap(row => {
    return row.regions.map((region, i) => {
      const proportion = row.proportions[i];

      const { totalAreaHa, id } = row;

      // 2. add column areaHa for region's proportionate area
      return {
        id,
        region,
        proportion,
        totalAreaHa,
        // floating-point error :/
        areaHa: Math.round(proportion / 100 * totalAreaHa * 10e14) / 10e14
      }
    });
  });

  // 3. sort by region (lexicographical asc)
  result.sort((a, b) => compare(a.region, b.region));

  return result;
}

function sumRegionAreas(rows) {
  // 4. group by region => sum(areaHa)
  const groups = rows.reduce((areas, row) => {
    const { id, region, areaHa, proportion, totalAreaHa } = row;
    const part = { id, proportion, totalAreaHa, areaHa };

    if (!areas.has(region)) {
      areas.set(region, {
        totalAreaHa: areaHa,
        parts: [part]
      });
    } else {
      const area = areas.get(region);
      area.totalAreaHa += areaHa;
      area.parts.push(part);
    }

    return areas;
  }, new Map());

  return [...groups].map(([region, { totalAreaHa }]) => {
    return {
      region,
      totalAreaHa,
    }
  })
}

// TODO: handle escaped cells
function exportCsv(headers, rows, delimiter = ',') {
  const headerRow = headers.map(({ label }) => label).join(delimiter)
  const outputRows = rows.map(row => {
    return headers.map(({ key }) => row[key]).join(delimiter);
  });

  return [
    headerRow,
    ...outputRows
  ].join("\n");
}

function Table({ headers, rows }) {
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm py-8 border border-slate-200" >
      {/* TODO: extract table styling; add dark mode (see https://tailwindcss.com/docs/table-layout) */}
      <table className="border-collapse table-auto w-full text-sm  text-slate-700">
        <thead>
          <tr>
            {
              headers.map(({ label }) => {
                return <th className="border-b border-slate-200 font-medium p-4 pl-8 pt-0 pb-3 text-slate-500 text-left">{label}</th>
              })
            }
          </tr>
        </thead>
        <tbody className="bg-white">
          {
            rows.map(row => {
              return <tr>
                {
                  headers.map(({ key }) => {
                    return <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{row[key]}</td>
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

export default function AreaSeparator() {
  const [data, setData] = useState(sampleInput);


  const input = parseRawInput(data);

  const intermediateRows = expandRegions(input.rows);
  const resultRows = sumRegionAreas(intermediateRows);

  const resultHeaders = [
    { key: "region", label: "Region" },
    { key: "totalAreaHa", label: "Total Area (Ha)" },
  ];

  const intermediateHeaders = [
    { key: "region", label: "Region" },
    { key: "id", label: "Row Number" },
    { key: "totalAreaHa", label: "Total Area (Ha)" },
    { key: "proportion", label: "Proportion" },
    { key: "areaHa", label: "Region Area (Ha)" },
  ]

  const resultCsv = exportCsv(resultHeaders, resultRows);
  const intermediateCsv = exportCsv(intermediateHeaders, intermediateRows);

  return (<div>
    <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
      Region Area Calculator
    </h1>
    <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-[2fr_auto_2fr]">
      <div className="self-end -mb-2">
        <label htmlFor="data-input" className="block text-xl font-medium text-slate-700">
          Input
        </label>
      </div>

      <div className="row-span-2 border-r border-r-slate-100 opacity-0"></div>

      <Tab.Group>
        <div className="grid grid-cols-2">
          <div className="self-end mb-0">
            <label className="block text-xl font-medium text-slate-700">
              Output
            </label>
          </div>
          <div className="flex justify-end gap-x-4 mb-0.5">
            <Tab.List className="inline-flex space-x-1 rounded-lg bg-slate-50 p-0.5 -mb-1.5">
              {
                ["Table", "CSV"].map(label => {
                  return (
                    <Tab as={React.Fragment}>
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

            <CopyButton copyText={resultCsv} />
          </div>
        </div>
        <div>
          <textarea
            id="data-input"
            name="data-input"
            rows={10}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            placeholder="..."
            value={data.trim()}
            onChange={e => { setData(e.target.value) }}
          />
        </div>
        <div>

          <Tab.Panels>
            <Tab.Panel>
              <Table headers={resultHeaders} rows={resultRows} /></Tab.Panel>
            <Tab.Panel>
              <pre className="p-4 border border-slate-200 rounded-lg">{resultCsv}</pre>
            </Tab.Panel>
          </Tab.Panels>

        </div>
      </Tab.Group>

      <div className="col-span-1 md:row-span-2 md:pb-2">

      </div>
      <div />
      <div className="col-span-1 md:row-span-2 md:pb-2">
      </div>
      <div />
      <div className="col-span-3 my-8 border border-slate-200"></div>
      <Tab.Group>
        <div className="grid grid-cols-2 col-span-3">
          <div className="self-end -mb-2">
            <label className="block text-xl font-medium text-slate-700">
              Intermediate
            </label>
          </div>
          <div className="flex justify-end gap-x-4 -mb-1.5">
            <Tab.List className="inline-flex space-x-1 rounded-lg bg-slate-50 p-0.5 -mb-1.5">
              {
                ["Table", "CSV"].map(label => {
                  return (
                    <Tab as={React.Fragment}>
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

            <CopyButton copyText={intermediateCsv} />
          </div>
        </div>
        <div className="col-span-3">

          <Tab.Panels>
            <Tab.Panel>
              <Table headers={intermediateHeaders} rows={intermediateRows} /></Tab.Panel>
            <Tab.Panel>
              <pre className="p-4 border border-slate-200 rounded-lg">{intermediateCsv}</pre>
            </Tab.Panel>
          </Tab.Panels>

        </div>
      </Tab.Group>
    </div>
  </div>)
}