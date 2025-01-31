
import Layout from '../../components/Layout'
// import BookingForm  from './../../components/BookingForm'
import { BookingList } from './../../components/BookingList'

export default function BookingsPage() {


  return (
    <Layout title="Bookings | House Listing Platform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Bookings</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <BookingList />
        </div>
      </div>
    </Layout>
  )
}