import { api } from "@/utils/api";
import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "@/server/db";
import SuperJSON from "superjson";
import { appRouter } from "@/server/api/root";
import NextError from "next/error";
import { PageLayout } from "@/components/page-layout";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = (props) => {
  const { data: userProfile } = api.profile.getUserByUsername.useQuery({
    username: props.username,
  });

  if (!userProfile) return <NextError statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`@${props.username}`}</title>
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-blue-400">
          <Image
            src={userProfile.profileImageUrl}
            alt={`@${props.username}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[60px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[60px]"></div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">{`@${
            userProfile.username ?? ""
          }`}</h1>
        </div>
        <div className="w-full border-b border-zinc-800"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });

  const slug = ctx.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("Slug is not a string");
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
