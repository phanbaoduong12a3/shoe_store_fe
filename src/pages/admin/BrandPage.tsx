import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Switch, Image, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getBrandsAction, toggleBrandStatusAction, deleteBrandAction } from '@/stores/brand';
import { Brand } from '@/services/brand-service';
import './brand-page.scss';
import CreateBrandModal from './components/CreateBrandModal';
import EditBrandModal from './components/EditBrandModal';
import ConfirmModal from '@/components/ConfirmModal';

const BrandPage = () => {
  const dispatch = useAppDispatch();
  const { brands, loading, total } = useAppSelector((state) => state.brand);
  const { message } = App.useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [currentPage, pageSize, searchText]);

  const fetchBrands = () => {
    dispatch(
      getBrandsAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        onSuccess: (data) => {
          console.log('Brands loaded:', data);
        },
        onError: (error) => {
          message.error({
            content: 'Không thể tải danh sách thương hiệu!',
            duration: 3,
          });
        },
      })
    );
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleToggleStatus = (brand: Brand) => {
    dispatch(
      toggleBrandStatusAction({
        id: brand._id,
        isActive: !brand.isActive,
        onSuccess: (data) => {
          message.success({
            content: 'Cập nhật trạng thái thành công!',
            duration: 2,
          });
        },
        onError: (error) => {
          message.error({
            content: 'Cập nhật trạng thái thất bại!',
            duration: 3,
          });
        },
      })
    );
  };

  const columns: ColumnsType<Brand> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: '10%',
      render: (logo: string) => (
        <div className="brand-logo-preview">
          {logo ? (
            <Image
              src={logo}
              alt="Brand logo"
              width={50}
              height={50}
              style={{ objectFit: 'contain' }}
              preview={false}
            />
          ) : (
            <div className="no-logo">No Logo</div>
          )}
        </div>
      ),
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text) => <span className="brand-name">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      render: (text) => <span className="brand-description">{text || '-'}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      render: (isActive: boolean, record) => (
        <div className="status-toggle">
          <Switch
            checked={isActive}
            onChange={() => handleToggleStatus(record)}
            checkedChildren="Hoạt động"
            unCheckedChildren="Ẩn"
          />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
      render: (date: string) => (
        <span className="brand-date">{new Date(date).toLocaleDateString('vi-VN')}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '8%',
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

  const handleEdit = (record: Brand) => {
    setSelectedBrand(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: Brand) => {
    setSelectedBrand(record);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBrand) return;

    dispatch(
      deleteBrandAction({
        id: selectedBrand._id,
        onSuccess: (data) => {
          message.success({
            content: 'Xóa thương hiệu thành công!',
            duration: 2,
          });
          fetchBrands();
          setOpenConfirm(false);
        },
        onError: (error) => {
          message.error({
            content: 'Xóa thương hiệu thất bại!',
            duration: 3,
          });
          setOpenConfirm(false);
        },
      })
    );
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
    fetchBrands();
  };

  const handleEditModalSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedBrand(null);
    fetchBrands();
  };

  return (
    <div className="brand-page">
      <Card
        className="brand-card"
        title="Quản lý thương hiệu"
        extra={
          <Space>
            <Input.Search
              placeholder="Tìm kiếm thương hiệu..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
              className="add-brand-btn"
            >
              Thêm thương hiệu
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={brands}
          rowKey="_id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} thương hiệu`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      <CreateBrandModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateModalSuccess}
      />

      <EditBrandModal
        open={isEditModalOpen}
        brand={selectedBrand}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedBrand(null);
        }}
        onSuccess={handleEditModalSuccess}
      />

      <ConfirmModal
        open={openConfirm}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa thương hiệu "${selectedBrand?.name}"?`}
        okText="Xóa"
        cancelText="Hủy"
        onOk={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
};

export default BrandPage;
