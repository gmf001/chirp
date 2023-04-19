import { api } from "@/utils/api";
import Head from "next/head";
import NextError from "next/error";
import { PageLayout } from "@/components/page-layout";
import { generateSSGHelper } from "@/server/ssgHelper";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PostView } from "@/components/post-view";

const SinglePostPage: NextPage<{ id: string }> = (props) => {
  const { data: pageData } = api.posts.getById.useQuery({
    id: props.id,
  });

  if (!pageData) return <NextError statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`${pageData.post.content} - @${pageData.author.username}`}</title>
      </Head>

      <PageLayout>
        <PostView {...pageData} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = generateSSGHelper();

  const id = ctx.params?.id;
  if (typeof id !== "string") throw new Error("id is not a string");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
