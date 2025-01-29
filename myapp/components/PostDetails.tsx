interface PostDetailsProps {
  post: {
    id: string;
    title: string;
    content: string;
  }
}

export default function PostDetails({ post }: PostDetailsProps) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
} 