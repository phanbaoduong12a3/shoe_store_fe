// components/BlogHoverCard.tsx
import { motion } from 'framer-motion';
import { EyeOutlined } from '@ant-design/icons';

interface Props {
  image: string;
  title: string;
  excerpt?: string;
  height: number;
  activeTag: string;
  viewCount?: number;
}

const BlogHoverCard = ({ image, title, excerpt, height, activeTag, viewCount = 0 }: Props) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* IMAGE */}
        <motion.img
          src={image}
          style={{ height }}
          className="w-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.7 }}
        />

        {/* OVERLAY */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* TAG BADGE */}

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded font-semibold">
            {activeTag}
          </span>
        </div>

        {/* VIEW COUNT */}
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white bg-black/50 px-2 py-1 rounded">
          <EyeOutlined />
          {viewCount}
        </div>

        {/* CONTENT */}
        {excerpt && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90">
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">
              {title}
            </h2>
            <p className="text-gray-300 line-clamp-3">{excerpt}</p>
          </div>
        )}
      </div>

      {!excerpt && (
        <h3 className="mt-2 text-sm font-semibold line-clamp-2 group-hover:text-yellow-500 transition">
          {title}
        </h3>
      )}
    </motion.div>
  );
};

export default BlogHoverCard;
