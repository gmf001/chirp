import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { TRPCClientError } from "@trpc/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "./loading";

export const CreatePostForm = () => {
  const [input, setInput] = useState("");

  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errMessage = err.data?.zodError?.fieldErrors?.content;
      console.log("err", err);
      if (errMessage && errMessage[0]) {
        return toast.error(errMessage[0]);
      }

      if (err instanceof TRPCClientError) {
        if (err.message == "TOO_MANY_REQUESTS") {
          return toast.error("Too many requests. Please try again later.");
        }
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full items-center gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        height={56}
        width={56}
        priority
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button
          className="text-sm font-bold uppercase text-blue-300 disabled:text-gray-700"
          disabled={isPosting}
          onClick={() => mutate({ content: input })}
        >
          Post
        </button>
      )}

      {isPosting && (
        <div className="h-fit w-[20px]">
          <LoadingSpinner size={20} top={0} />
        </div>
      )}
    </div>
  );
};
