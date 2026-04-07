import Post from "./Post";

export default function Feed({ posts = [] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-border rounded-3xl mt-6 bg-card/50">
        <p className="text-muted-foreground font-medium">No posts to display right now.</p>
        <p className="text-sm text-muted-foreground mt-1">Check back later or follow more people!</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      {posts.map((post) => (
        <Post key={post.id || Math.random()} data={post} />
      ))}
    </div>
  );
}