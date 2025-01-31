import {BookingList} from '../../../components/BookingList'
import BookingDetails from '../../../components/BookingDetails';
import Layout from '../../../components/Layout'

async function bookPage({params}) {
    const {id}=await params;
  
  return (
    <Layout  title='Booking Detail Page'>
   <BookingDetails bookingId={id}/>
   </Layout>
  )
}

export default bookPage