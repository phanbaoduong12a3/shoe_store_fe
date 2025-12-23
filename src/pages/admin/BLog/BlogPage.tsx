import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Switch, Image, Input, Popover } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import './blog-page.scss';
import CreateBrandModal from '../components/CreateBrandModal';
import ConfirmModal from '@/components/ConfirmModal';
import { BlogDetail } from '@/services/blog-service';
import { deleteBlogAction, getListBlogAction, toggleBlogStatusAction } from '@/stores/blog/actions';
import CreateBlogModal from '../components/CreateBlogModal';

const BlogPage = () => {
  const dispatch = useAppDispatch();
  const { blogs, loading, total } = useAppSelector((state) => state.blog);
  const { message } = App.useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogDetail | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, pageSize, searchText]);

  const fetchBlogs = () => {
    dispatch(
      getListBlogAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        onError: () => {
          message.error('Không thể tải danh sách bài viết!');
        },
      })
    );
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const handleDelete = (record: BlogDetail) => {
    setSelectedBlog(record);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBlog) return;

    dispatch(
      deleteBlogAction({
        id: selectedBlog._id,
        onSuccess: () => {
          message.success('Xóa bài viết thành công!');
          fetchBlogs();
          setOpenConfirm(false);
        },
        onError: () => {
          message.error('Xóa bài viết thất bại!');
          setOpenConfirm(false);
        },
      })
    );
  };
  const handleToggleStatus = (blog: BlogDetail) => {
    dispatch(
      toggleBlogStatusAction({
        id: blog._id,
        isPublished: !blog.isPublished,
        onSuccess: () => {
          message.success({
            content: 'Cập nhật trạng thái thành công!',
            duration: 2,
          });
          fetchBlogs();
        },
        onError: () => {
          message.error({
            content: 'Cập nhật trạng thái thất bại!',
            duration: 3,
          });
        },
      })
    );
  };
  const columns: ColumnsType<BlogDetail> = [
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      width: 80,
      align: 'center',
      render: (img: string) =>
        img ? (
          <Image
            src={img}
            width={50}
            height={50}
            preview={false}
            style={{ objectFit: 'cover', borderRadius: 6 }}
          />
        ) : (
          <div className="no-image">No image</div>
        ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: 220,
      render: (text) => <strong className="blog-title">{text}</strong>,
    },
    {
      title: 'Trích dẫn',
      dataIndex: 'excerpt',
      width: 260,
      render: (text: string) => <span className="ellipsis">{text || '-'}</span>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: 400,
      render: (text: string) => {
        if (!text) return '-';

        return (
          <Popover
            trigger="click"
            placement="right"
            getPopupContainer={() => document.body}
            classNames={{
              root: 'blog-content-popover',
            }}
            content={<div className="popover-content">{text}</div>}
          >
            <div className="cell-content">{text}</div>
          </Popover>
        );
      },
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      width: 100,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 120,
      align: 'center',
      render: (isPublished: boolean, record) => (
        <div className="status-toggle">
          <Switch
            checked={isPublished}
            onChange={() => handleToggleStatus(record)}
            checkedChildren="Công khai"
            unCheckedChildren="Ẩn"
          />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-page">
      <Card
        title="Quản lý bài viết"
        extra={
          <Space>
            <Input.Search
              allowClear
              placeholder="Tìm kiếm bài viết"
              prefix={<SearchOutlined />}
              onSearch={(v) => {
                setSearchText(v);
                setCurrentPage(1);
              }}
              style={{ width: 260 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Thêm bài viết
            </Button>
          </Space>
        }
      >
        <Table
          tableLayout="fixed"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={blogs}
          rowKey="_id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `Tổng ${t} bài viết`,
          }}
        />
      </Card>

      <CreateBlogModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchBlogs();
        }}
      />

      <ConfirmModal
        open={openConfirm}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa "${selectedBlog?.title}"?`}
        okText="Xóa"
        cancelText="Hủy"
        onOk={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
};

export default BlogPage;
