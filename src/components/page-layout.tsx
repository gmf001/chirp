import { type PropsWithChildren } from "react";

export const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="mx-auto md:max-w-2xl">
      <div className="flex min-h-screen flex-col border-x border-zinc-800">
        {children}
      </div>
    </main>
  );
};
