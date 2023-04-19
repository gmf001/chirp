import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "@/utils/api";
import { PageLayout } from "@/components/page-layout";
import { HomeFeed } from "@/components/home-feed";
import { CreatePostForm } from "@/components/create-post";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return null;

  return (
    <PageLayout>
      <div className="relative flex border-b border-zinc-800 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostForm />}
      </div>

      <HomeFeed />
    </PageLayout>
  );
};

export default Home;
