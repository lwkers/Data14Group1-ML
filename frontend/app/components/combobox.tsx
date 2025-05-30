'use client'

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'

interface Person {
  index: number;
  user_id: string;
}

export default function InputUserId({ setUserId }:any) {
  const [query, setQuery] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [people, setPeople] = useState([]);

  useEffect(() => {
    async function loadUserData() {
      const parts = [1,400,750]; // 根据需要加载的用户ID
      const allPeople:any = [];

      for (let part of parts) {
        const data = await import(`../test_users/test_users_part${part}.json`);
        allPeople.push(...data.default);
      }

      setPeople(allPeople);
    }

    loadUserData();
  }, [])

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person:any) => {
          return person.user_id.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(person:any) => {
        setQuery('')
        setSelectedPerson(person)
        if (person && person.user_id) {
          setUserId(person.user_id);
        }
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">Select User</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={(person: Person) => person?.user_id}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {filteredPeople.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person:any) => (
              <ComboboxOption
                key={person.index}
                value={person}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate group-data-[selected]:font-semibold">{person.user_id}</span>

                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}
