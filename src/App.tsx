import './App.css'
import QgisQuery from './QgisQuery'
import AreaSeparator from './AreaSeparator'
import CommandPalette from './CommandPalette'

const tools = [
  {
    name: "QGis Query Builder",
    id: "qgis-query-builder",
    description: "lorem ipsum",
  },
  {
    name: "Area Separator",
    id: "area-separator",
    description: "lorem dolor sit amet ipsum ",
  },
  {
    name: "QGis Query Builder2",
    id: "qgis-query-builder2",
    description: "ipsum lorem validatum",
  },

];

function App() {
  return (
    <div className="App">
      <CommandPalette items={tools} onActivate={toolId => {
        console.log('TODO: navigating to', toolId);
      }} />
      <hr className="mt-24" />
      <AreaSeparator />
      <hr className="my-8 border-1 border-slate-200" />
      <QgisQuery />
    </div>
  )
}

export default App
