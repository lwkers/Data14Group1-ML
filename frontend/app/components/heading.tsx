import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LinkIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { useState } from 'react'

const publishingOptions = [
  { name: 'Published', description: 'This project posting can be viewed by anyone who has the link.', current: true },
  { name: 'Draft', description: 'This project posting will no longer be publicly accessible.', current: false },
]

export default function PageHeading(){
    const [selected, setSelected] = useState(publishingOptions[0])
    
    return(
        <>
        {/* Page heading */}
        <header className="bg-gray-50 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <nav aria-label="Breadcrumb" className="flex">
                <ol role="list" className="flex items-center space-x-4">
                  <li>
                    <div>
                      <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        Projects
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Data Engineering
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Instacart Market Basket Analysis
              </h1>
              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  Which products will an Instacart consumer purchase again?
                </div>
              </div>
            </div>
            <div className="mt-5 flex xl:ml-4 xl:mt-0">
              <span className="hidden sm:block">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PencilIcon aria-hidden="true" className="-ml-0.5 h-5 w-5 text-gray-400" />
                  Edit
                </button>
              </span>

              <span className="ml-3 hidden sm:block">
                <button
                  type="button"
                  onClick={() => window.location.href = 'https://www.kaggle.com/c/instacart-market-basket-analysis/overview'}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <LinkIcon aria-hidden="true" className="-ml-0.5 h-5 w-5 text-gray-400" />
                  View
                </button>
              </span>

              <Listbox as="div" value={selected} onChange={setSelected} className="sm:ml-3">
                <Label className="sr-only">Change published status</Label>
                <div className="relative">
                  <div className="inline-flex divide-x divide-orange-600 rounded-md shadow-sm">
                    <div className="inline-flex divide-x divide-orange-600 rounded-md shadow-sm">
                      <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-orange-500 px-3 py-2 text-white shadow-sm">
                        <CheckIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                        <p className="text-sm font-semibold">{selected.name}</p>
                      </div>
                      <ListboxButton className="inline-flex items-center rounded-l-none rounded-r-md bg-orange-500 p-2 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50">
                        <span className="sr-only">Change published status</span>
                        <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-white" />
                      </ListboxButton>
                    </div>
                  </div>

                  <ListboxOptions
                    transition
                    className="absolute left-0 z-10 -mr-1 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:left-auto sm:right-0"
                  >
                    {publishingOptions.map((option) => (
                      <ListboxOption
                        key={option.name}
                        value={option}
                        className="group cursor-default select-none p-4 text-sm text-gray-900 data-[focus]:bg-orange-500 data-[focus]:text-white"
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p className="font-normal group-data-[selected]:font-semibold">{option.name}</p>
                            <span className="text-orange-500 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                              <CheckIcon aria-hidden="true" className="h-5 w-5" />
                            </span>
                          </div>
                          <p className="mt-2 text-gray-500 group-data-[focus]:text-orange-200">{option.description}</p>
                        </div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>

              {/* Dropdown */}
              <Menu as="div" className="relative ml-3 sm:hidden">
                <MenuButton className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
                  More
                  <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      Edit
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                      View
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </header>
        </>
    )
}