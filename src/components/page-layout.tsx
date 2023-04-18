import { type PropsWithChildren } from "react";

export const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="mx-auto md:max-w-2xl">
      <div className="flex h-screen flex-col overflow-y-scroll border-x border-zinc-800 scrollbar-hide">
        {children}
      </div>
    </main>
  );
};
