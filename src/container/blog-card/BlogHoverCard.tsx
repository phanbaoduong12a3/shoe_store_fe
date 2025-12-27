import { motion } from 'framer-motion';
import { EyeOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useState } from 'react';

interface Props {
  image: string;
  title: string;
  excerpt?: string;
  content?: string;
  height: number;
  activeTag: string;
  viewCount?: number;
  onNavigate?: () => void;
}

const BlogHoverCard = ({
  image,
  title,
  excerpt,
  content,
  height,
  activeTag,
  viewCount = 0,
  onNavigate,
}: Props) => {
  const [open, setOpen] = useState(false);
  const handleNavigate = () => {
    if (open) return;
    onNavigate?.();
  };

  return (
    <>
      {/* CARD */}
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="group cursor-pointer"
        onClick={handleNavigate}
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

          {/* TAG */}
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded font-semibold">
              {activeTag}
            </span>
          </div>

          {/* VIEW */}
          <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white bg-black/50 px-2 py-1 rounded">
            <EyeOutlined />
            {viewCount}
          </div>

          {/* CONTENT */}
          {excerpt && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90">
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition">
                {title}
              </h2>
              <p className="text-gray-300 line-clamp-2 mb-2">{excerpt}</p>

              <span
                className="text-yellow-400 text-sm font-semibold hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                Xem thêm →
              </span>
            </div>
          )}
        </div>

        {!excerpt && (
          <h3 className="mt-2 text-sm font-semibold line-clamp-2 group-hover:text-yellow-500 transition">
            {title}
          </h3>
        )}
      </motion.div>

      {/* MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        maskClosable={false}
      >
        <img src={image} alt={title} className="w-full h-64 object-cover rounded mb-4" />

        <h1 className="text-2xl font-bold mb-3">{title}</h1>

        {excerpt && <p className="text-gray-600 italic mb-4">{excerpt}</p>}

        {content && <div className="prose max-w-none">{content}</div>}
      </Modal>
    </>
  );
};

export default BlogHoverCard;
