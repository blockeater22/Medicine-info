export default function Loading() {
  return (
    <div className="container-custom py-24">
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded-lg w-2/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-64 bg-muted rounded-xl mt-8" />
      </div>
    </div>
  );
}
