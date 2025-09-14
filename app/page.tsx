import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Liam Bailey
      </h1>
      <p className="mb-4">
        {`Yoooo. I'm actively doing cool stuff. Some of which I will try to write about`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
