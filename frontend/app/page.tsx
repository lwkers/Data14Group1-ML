'use client'

import './globals.css'
import Navbar from './components/navbar'
import PageHeading from './components/heading'
import Tab from './components/tab'
import TableCard from './components/card'

export default function Home() {  
  return (
    <>
      <div className="min-h-full">
        <Navbar />
        <PageHeading />

        <main className="pb-16 pt-8 bg-gray-200">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-4 sm:px-0">        
              <Tab />
            </div>
            <TableCard />
          </div>
        </main>
      </div>
    </>
  )
}
