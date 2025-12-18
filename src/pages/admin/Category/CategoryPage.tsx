import { useEffect, useState } from 'react';
import { Table, Card, Tag, Space, Button, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getCategoriesAction } from '@/stores/category';
import { Category } from '@/services/category-service';
import CreateCategoryModal from '../components/CreateCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';
import './category-page.scss';

const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, total } = useAppSelector((state) => state.category);
  const { message } = App.useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    dispatch(
      getCategoriesAction({
        isActive: true,
        onSuccess: (data) => {},
        onError: (error) => {
          message.error({
            content: 'Không thể tải danh sách danh mục!',
            duration: 3,
          });
        },
      })
    );
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text) => <span className="category-name">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      render: (text) => <span className="category-description">{text || '-'}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => (
        <span className="category-date">{new Date(date).toLocaleDateString('vi-VN')}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="edit-btn"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="delete-btn"
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Category) => {
    setSelectedCategory(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: Category) => {
    console.log('Delete:', record);
    message.info('Chức năng đang phát triển');
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
    fetchCategories();
  };

  const handleEditModalSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  return (
    <div className="category-page">
      <Card
        className="category-card"
        title="Quản lý danh mục"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
            className="add-category-btn"
          >
            Thêm danh mục
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          pagination={{
            total: total,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} danh mục`,
          }}
        />
      </Card>

      <CreateCategoryModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateModalSuccess}
      />

      <EditCategoryModal
        open={isEditModalOpen}
        category={selectedCategory}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={handleEditModalSuccess}
      />
    </div>
  );
};

export default CategoryPage;
