import { Combobox, Dialog, Transition } from "@headlessui/react"
import { ChangeEvent, Fragment, useEffect, useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface CommandPaletteItem {
  id: string,
  name: string,
  description?: string
}

function simpleFilter<T extends CommandPaletteItem>(items: T[], query?: string) {
  if (!query) {
    return items;
  }

  const normalisedQuery = query.toLowerCase();

  return items.filter(tool => {
    return tool.name.toLowerCase().includes(normalisedQuery) || tool.description?.includes(normalisedQuery)
  })
}

export default function CommandPalette<T extends CommandPaletteItem>({
  items,
  onActivate,
}: {
  items: T[],
  onActivate: (itemId: CommandPaletteItem["id"]) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredItems = simpleFilter(items, query);

  useEffect(() => {
    function onKeydown(event: any) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(v => !v);
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [setIsOpen])

  return <Transition
    show={isOpen}
    as={Fragment}
    afterLeave={() => {
      setQuery("");
    }}
  >
    <Dialog
      onClose={setIsOpen}
      className="fixed inset-0 p-4 md:pt-[20vh] overflow-y-auto"
    >
      <Transition.Child
        className="fixed inset-0 bg-sky-200/60"
        enter="duration-300 ease-out"
        enterFrom="opacity-0 backdrop-blur-none"
        enterTo="opacity-100 backdrop-blur-sm"
        leave="duration-200 ease-in"
        leaveFrom="opacity-100 backdrop-blur-sm"
        leaveTo="opacity-0 backdrop-blur-none"
      >
        <Dialog.Overlay />
      </Transition.Child>

      <Transition.Child
        enter="duration-300 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Combobox
          as="div"
          onChange={(value: string) => {
            setIsOpen(false);
            onActivate(value);
          }}
          className="relative w-full md:max-w-xl mx-auto bg-white rounded-xl shadow-2xl ring-1 ring-black/5 divide-y divide-slate-200 overflow-hidden flex flex-col"
          value={query}
        >
          <div className="flex items-center px-4">
            <MagnifyingGlassIcon
              className="h-6 w-6 text-slate-500"
            />
            <Combobox.Input
              className="w-full border-0 bg-transparent text-sm focus:ring-0 text-slate-800 placeholder-slate-400"
              placeholder="Search..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value);
              }}
            />
          </div>
          {filteredItems.length > 0 && (
            <Combobox.Options static
              className="py-4 text-sm max-h-96 overflow-y-auto"
            >
              {filteredItems.map(item => (
                <Combobox.Option key={item.id} value={item.id}>
                  {({ active }) => (
                    <div className={`px-4 py-2 space-x-1 ${active ? 'bg-sky-600' : 'bg-white'}`}>
                      <span className={`font-bold ${active ? 'text-white' : 'text-slate-800'} `}>{item.name}</span>
                      <span className={active ? 'text-sky-200' : 'text-slate-400'}>{item.description}</span>
                    </div>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
          {
            query && filteredItems.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No results found</p>
            )
          }
        </Combobox>
      </Transition.Child>
    </Dialog>
  </Transition>
}