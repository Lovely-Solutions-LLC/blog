import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((b, a) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
<Link key={post.slug} href={`/blog/${post.slug}`} className="block mb-4">
  <div className="w-full flex flex-col md:flex-row md:items-baseline md:space-x-3">
    <p className="text-neutral-600 dark:text-neutral-400 tabular-nums whitespace-nowrap md:w-44">
      {formatDate(post.metadata.publishedAt, false)}
    </p>
    <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
      {post.metadata.title}
    </p>
  </div>
</Link>


        ))}
    </div>
  )
}
