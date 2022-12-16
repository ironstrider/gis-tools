import { useLocation, Route, Router, Switch } from "wouter";

import './App.css'
import CommandPalette from './CommandPalette'

import QgisQuery from './QgisQuery'
import AreaSeparator from './AreaSeparator'
import { useEffect } from "react";


const tools = [
  {
    name: "QGIS ObjectID Query Builder",
    id: "qgis-objectid-query-builder",
    description: "lorem ipsum",
    component: QgisQuery
  },
  {
    name: "Regional Ecosystem Area Calculator",
    id: "re-area-calculator",
    description: "lorem dolor sit amet ipsum ",
    component: AreaSeparator
  },
  {
    name: "Alphabet",
    id: "abcdefghijk-i-forgot-the-rest",
    description: "ipsum lorem validatum",
    component: (props: any) => <div>this is just a dummy entry!</div>
  },
  {
    name: "Hieroglyphics",
    id: "eye-well-knot-d-face",
    description: "ipsum lorem validatum",
    component: (props: any) => <div>another dummy entry!</div>
  },
];

function Title({
  text
}: {
  text: string
}) {
  useEffect(() => {
    console.log('setting title')
    document.title = text;
  }, [text]);

  return null;
}

function App() {
  const [location, navigate] = useLocation();
  // wouter doesn't play nicely with a trailing slash on the base path
  const basePath = "/gis-tools";
  const appName = "GIS Tools";

  useEffect(() => {
    console.log('location is', location)
  }, [location])

  return (
    <div className="App">
      <Router base={basePath}>

        <CommandPalette items={tools} onActivate={(toolId: string) => {
          // navigate seems to require the base path be explicitly included
          navigate(`${basePath}/${toolId}`)
        }} />

        <Switch>
          {tools.map(tool => {
            const Component = tool.component;
            return <Route path={`/${tool.id}`} key={tool.id}>
              <h1 className="inline-block text-xl text-slate-500 tracking-tight italic">
                {tool.name}
              </h1>
              <Title text={`${tool.name} · ${appName}`} />
              <Component />
            </Route>
          })}

          <Route path="/">
            <Title text={`${appName}`} />
            Press <code>ctrl/cmd + k</code> to get started
            TODO: homepage; cards w/ tool descriptions?
          </Route>
          <Route>
            <Title text={`Page Not Found · ${appName}`} />
            TODO: 404 not found
          </Route>

        </Switch>

      </Router>
    </div>
  )
}

export default App
