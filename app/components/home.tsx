// client component for home page
'use client'

import VehicleFilter from '@/app/components/VehicleFilter'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="p-8">
      <Link href="/search">About</Link>
      <h1 className="text-3xl font-semibold mb-6">
        Najdi svoje vozilo
      </h1>
      <VehicleFilter />
    </div>
  )
}
