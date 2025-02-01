import Layout from "@/components/Layout";
import   HouseDetails from '@/components/HouseComponent'

export default async function HousePage({ params }) {
    const { id } = await params;

    return (
        <Layout title="House Details">
            <HouseDetails id={id}/>
           
        </Layout>
    );
}

