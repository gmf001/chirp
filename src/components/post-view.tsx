import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type RouterOutputs } from "@/utils/api";

dayjs.extend(relativeTime);

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const PostView = ({ post, author }: PostWithAuthor) => {
  return (
    <div key={post.id} className="flex gap-4 border-b border-zinc-800 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`Profile image for ${author.username}`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 text-sm  text-slate-200">
          <Link href={`/@${author.username}`}>
            <span className="font-semibold text-blue-200">{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{` ·  ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
