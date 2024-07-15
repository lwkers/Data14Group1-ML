import { useState } from "react";
import InputUserId from "./combobox"
import ResultsTable from "./table"

export default function TableCard() {
  const [userId, setUserId] = useState("");
  
  return (
    <div className="px-4 sm:px-1">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Repeat Purchase Probability</h1>
          <p className="mt-2 text-sm text-gray-700">
            The likelihood of each product being repurchased by users.
          </p>
        </div>
        <div className="flex mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <InputUserId setUserId={setUserId}/>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <ResultsTable userId={userId}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}