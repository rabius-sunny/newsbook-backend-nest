import { fetchOnServer } from '@/action/data'
import { lazy } from 'react'
import MainHeader from './MainHeader'
import TopBar from './TopBar'
const CategoryNav = lazy(() => import('./CategoryNav'))

export default function Header() {

    const data = fetchOnServer('/categories', 3600)
    return (
        <>
            {/* Header */}
            <header className='bg-white border-gray-100 border-b'>
                <TopBar />
                <MainHeader />
            </header>

            {/* Navigation */}
            <CategoryNav promise={data} />
        </>
    )
}
