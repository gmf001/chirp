import { api } from "@/utils/api";
import { LoadingSpinner } from "./loading";
import { PostView } from "./post-view";

export const HomeFeed = () => {
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  if (!posts) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col">
      {posts?.map((post) => (
        <PostView key={post.post.id} {...post} />
      ))}
    </div>
  );
};
