import { api } from "@/utils/api";
import { LoadingSpinner } from "./loading";
import { PostView } from "./post-view";

export const ProfileFeed = (props: { userId: string }) => {
  const { data: posts, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!posts || posts.length === 0) return <div>No posts</div>;

  return (
    <div className="flex flex-col">
      {posts?.map((post) => (
        <PostView key={post.post.id} {...post} />
      ))}
    </div>
  );
};
