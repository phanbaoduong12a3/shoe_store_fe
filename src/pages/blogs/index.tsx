import { useAppDispatch, useAppSelector } from '@/stores';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import BlogSkeleton from '@/container/blog-card/BlogSkeleton';
import BlogTagMenu from './BlogTagMenu ';
import { fadeItem, staggerContainer } from '@/container/blog-card/animations';
import BlogHoverCard from '@/container/blog-card/BlogHoverCard';
import { getListBlogAction } from '@/stores/blog/actions';
import { App } from 'antd';

const BlogBrandPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { blogs, loading } = useAppSelector((s) => s.blog);

  const [activeTag, setActiveTag] = useState<string>();

  useEffect(() => {
    dispatch(
      getListBlogAction({
        onSuccess: (data) => {
          console.log('Blogs loaded:', data);
        },
        onError: () => {
          message.error({
            content: 'Không thể tải danh sách bài viết!',
            duration: 3,
          });
        },
      })
    );
  }, [activeTag]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) =>
      b.tags?.forEach((t: string) => t.split(',').forEach((x) => set.add(x.trim())))
    );
    return Array.from(set);
  }, [blogs]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-3 gap-6">
        <BlogSkeleton height={420} />
        <BlogSkeleton height={200} />
        <BlogSkeleton height={200} />
      </div>
    );
  }

  if (!blogs.length) return null;

  const featured = blogs[0];
  const sideBlogs = blogs.slice(1, 5);
  const others = blogs.slice(5);

  return (
    <div className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-2">Chuyên mục bài viết</h1>
        <p className="text-center text-gray-500 mb-6">
          Thông tin thương hiệu nổi bật trên toàn thế giới
        </p>

        <BlogTagMenu tags={tags} activeTag={activeTag} onChange={setActiveTag} />

        {/* TOP */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
        >
          <motion.div
            variants={fadeItem}
            className="lg:col-span-2"
            onClick={() => navigate(`/category-detail/${featured.categoryId._id}`)}
          >
            <BlogHoverCard
              image={featured.thumbnail}
              title={featured.title}
              excerpt={featured.excerpt}
              height={420}
              activeTag={activeTag || 'giày'}
              viewCount={featured.viewCount}
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {sideBlogs.map((b) => (
              <motion.div
                key={b._id}
                variants={fadeItem}
                onClick={() => navigate(`/category-detail/${b.categoryId._id}`)}
              >
                <BlogHoverCard
                  image={b.thumbnail}
                  title={b.title}
                  height={200}
                  activeTag={activeTag || 'giày'}
                  viewCount={b.viewCount}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {others.map((b) => (
            <motion.div
              key={b._id}
              variants={fadeItem}
              onClick={() => navigate(`/category-detail/${b.categoryId._id}`)}
            >
              <BlogHoverCard
                image={b.thumbnail}
                title={b.title}
                height={160}
                activeTag={activeTag || 'giày'}
                viewCount={b.viewCount}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogBrandPage;
