import Layout from "../../../components/Layout";
import OwnerProfile from "../../../components/profileComponent";

async function Profile({params}) {
    const {id}=await params;
  
  return (
    <Layout title="Profile Page">
    <OwnerProfile id={id}/>
    </Layout>
  )
}

export default Profile