import { ChangeEvent, useState } from "react";
import { TableDataInput, TableDataView } from "./Table";

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

interface InputRow {
  id: number,
  regions: string[],
  proportions: number[],
  totalAreaHa: number,
}

interface InputTable {
  header: string[]
  rows: InputRow[]
}

interface IntermediateRow {
  id: number,
  region: string,
  proportion: number,
  totalAreaHa: number,
  areaHa: number,
}

interface ResultRow {
  region: string,
  totalAreaHa: number,
}

function compare<T>(a: T, b: T) {
  return a < b ? -1 : (a > b) ? 1 : 0
}

function parseRawInput(dataText: string, delimiter = /[\s]+/g): InputTable {
  const rawRows = dataText.trim().split("\n");
  const header = rawRows.shift()!.split(delimiter);
  const rows = rawRows.map((rowText, i) => {
    const cells = rowText.split(delimiter);

    const id = i + 1;
    const regions = cells[0].split('/');
    const proportions = cells[0].split('/').map(x => parseFloat(x));
    const totalAreaHa = parseFloat(cells[0]);

    return { id, regions, proportions, totalAreaHa }
  });

  return { header, rows };
}

function expandRegions(rows: InputRow[]): IntermediateRow[] {
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

function sumRegionAreas(rows: IntermediateRow[]): ResultRow[] {
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

export default function AreaSeparator() {
  const [data, setData] = useState(sampleInput);

  const input = parseRawInput(data);

  const intermediateTable = {
    headers: [
      { key: "region", label: "Region" },
      { key: "id", label: "Row Number" },
      { key: "totalAreaHa", label: "Total Area (Ha)" },
      { key: "proportion", label: "Proportion" },
      { key: "areaHa", label: "Region Area (Ha)" },
    ],
    rows: expandRegions(input.rows)
  };

  const resultTable = {
    headers: [
      { key: "region", label: "Region" },
      { key: "totalAreaHa", label: "Total Area (Ha)" },
    ],
    rows: sumRegionAreas(intermediateTable.rows)
  };

  return (<div>
    <h1 className="inline-block text-xl text-stone-500 tracking-tight">
      Region Area Calculator
    </h1>

    <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-[2fr_auto_2fr]">

      <div className="col-span-3 grid grid-cols-4 gap-x-12 gap-y-4">

        <TableDataInput
          value={data.trim()}
          onChange={setData}
          labelClass="col-span-2 col-start-1 row-start-1 self-end"
          viewClass="col-span-2 col-start-1 row-start-2"
        />

        <TableDataView
          label="Output"
          table={resultTable}
          labelClass="col-span-1 col-start-3 row-start-1 self-end"
          controlsClass="col-span-1 col-start-4 row-start-1"
          viewClass="col-span-2 col-start-3 row-start-2"
        />
      </div>

      <div className="col-span-3 my-8 border border-slate-200"></div>

      <TableDataView
        label="Intermediate"
        table={intermediateTable}
        labelClass="col-span-2 self-end"
        viewClass="col-span-3"
      />
    </div>
  </div>)
}