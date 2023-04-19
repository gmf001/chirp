export const LoadingSpinner = ({
  size,
  top,
}: {
  size?: number;
  top?: number;
}) => {
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          top: top ?? "2.5rem",
        }}
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-[4px] border-current border-t-transparent text-blue-400"
          role="status"
          aria-label="loading"
          style={{ height: size ?? "2rem", width: size ?? "2rem" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
};
