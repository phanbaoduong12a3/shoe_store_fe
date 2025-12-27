// components/BlogSkeleton.tsx
const BlogSkeleton = ({ height }: { height: number }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded" style={{ height }} />
      <div className="mt-2 h-4 bg-gray-200 rounded w-3/4" />
      <div className="mt-1 h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
};

export default BlogSkeleton;
