import BlogPost from "../../../components/blog";
import Layout from "../../../components/Layout";
export default async function page({params}) {
    const {id} = await params;
  return (
    <Layout title={`Blogs details for blog id ${id}`}>
    <BlogPost/>
    </Layout>
  )
}
