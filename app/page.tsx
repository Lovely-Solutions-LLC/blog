import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Liam Bailey
      </h1>
      <p className="mb-4">
        {`I'm a 20 year old dropout who cold emailed my way into tech startups at 19`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
