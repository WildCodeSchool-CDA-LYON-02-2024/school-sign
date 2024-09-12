"use client";

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface ClassSection {
  id: string;
  name: string;
}

interface SelectMenuProps {
  selected: ClassSection | null;
  setSelected: (classSection: ClassSection | null) => void;
  options: ClassSection[];
}

export default function SelectMenu({ selected, setSelected, options }: SelectMenuProps) {
  console.log(selected);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Label>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
          <span className="flex items-center">
            {selected ? (
              <>
                <span className="ml-3 block truncate">{selected.name}</span>
              </>
            ) : (
              <span className="ml-3 block truncate">Select a class</span>
            )}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>

        <ListboxOptions
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {options.map((classSection) => (
            <ListboxOption
              key={classSection.id}
              value={classSection}
              className="group relative cursor-default select-none  py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                  {classSection.name}
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                <CheckIcon aria-hidden="true" className="h-5 w-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
