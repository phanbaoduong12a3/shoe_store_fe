// container/blog-card/BlogCard.tsx
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  blog: any;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
      onClick={() => {
        // redirect sang category
        navigate(`/category-detail/${blog.categoryId._id}`);
      }}
    >
      <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{blog.title}</h3>

        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{blog.excerpt}</p>

        <div className="flex items-center gap-2 mt-4">
          <img src={blog.authorId.avatar} className="w-6 h-6 rounded-full" />
          <span className="text-sm text-gray-700">{blog.authorId.fullName}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
