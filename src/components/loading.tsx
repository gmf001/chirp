export const LoadingSpinner = ({ size }: { size?: number }) => {
  return (
    <div className="absolute inset-0 top-10 flex w-full justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-[4px] border-current border-t-transparent text-blue-400"
        role="status"
        aria-label="loading"
        style={{ height: size ?? "2rem", width: size ?? "2rem" }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
