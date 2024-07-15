const tabs = [
  { name: 'Overview', href: '#', current: false },
  { name: 'Users', href: '#', count: '200,000+', current: false },
  { name: 'Orders', href: '#', count: '3,000,000+', current: false },
  { name: 'Results', href: '#', current: true },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Tab(){
    return(
        <>
            {/* Tabs */}
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    defaultValue={tabs.find((tab) => tab.current).name}
                    className="mt-4 mb-4 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-500"
                >
                    {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
                </div>
                <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav aria-label="Tabs" className="-mb-px mt-2 flex space-x-8">
                    {tabs.map((tab) => (
                        <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                            tab.current
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
                        )}
                        >
                        {tab.name}
                        {tab.count ? (
                            <span
                            className={classNames(
                                tab.current ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-900',
                                'ml-2 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
                            )}
                            >
                            {tab.count}
                            </span>
                        ) : null}
                        </a>
                    ))}
                    </nav>
                </div>
            </div>
        </>
    )
}