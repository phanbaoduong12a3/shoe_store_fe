import { useAppDispatch, useAppSelector } from '@/stores';
import { useEffect, useState } from 'react';
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
  const [allTags, setAllTags] = useState<string[]>([]);

  const [activeTag, setActiveTag] = useState<string>();

  useEffect(() => {
    dispatch(
      getListBlogAction({
        tag: activeTag || undefined,
        isPublished: true,
        onSuccess: (data) => {
          console.log('Blogs loaded:', data);
          if (!activeTag) {
            const set = new Set<string>();

            data.data.blogs.forEach((b: any) =>
              b.tags?.forEach((t: string) =>
                t
                  .split(',')
                  .map((x) => x.trim().toLowerCase())
                  .filter(Boolean)
                  .forEach((x) => set.add(x))
              )
            );

            setAllTags(Array.from(set));
          }
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

  return (
    <div className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-2">Chuyên mục bài viết</h1>
        <p className="text-center text-gray-500 mb-6">
          Thông tin thương hiệu nổi bật trên toàn thế giới
        </p>

        <BlogTagMenu tags={allTags} activeTag={activeTag} onChange={setActiveTag} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
        >
          {blogs.map((b) => (
            <motion.div
              key={b._id}
              variants={fadeItem}
            >
              <BlogHoverCard
                image={b.thumbnail}
                title={b.title}
                excerpt={b.excerpt}
                content={b.content}
                height={320}
                activeTag={activeTag || 'giày'}
                viewCount={b.viewCount}
                onNavigate={() => navigate(`/category-detail/${b.categoryId._id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogBrandPage;
