import { api } from "@/utils/api";
import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "@/server/db";
import SuperJSON from "superjson";
import { appRouter } from "@/server/api/root";
import NextError from "next/error";
import { PageLayout } from "@/components/page-layout";

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
        <pre>{JSON.stringify(userProfile, null, 2)}</pre>
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
