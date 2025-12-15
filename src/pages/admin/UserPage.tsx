import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Image, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { Brand } from '@/services/brand-service';
import './brand-page.scss';
import CreateBrandModal from './components/CreateBrandModal';
import ConfirmModal from '@/components/ConfirmModal';
import { UserDetail } from '@/services/user-service';
import { getListUserAction } from '@/stores/user/actions';

const UserPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading, total } = useAppSelector((state) => state.user);
  const { message } = App.useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchText]);

  const fetchUsers = () => {
    dispatch(
      getListUserAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        onSuccess: (data) => {
          console.log('Users loaded:', data);
        },
        onError: () => {
          message.error({
            content: 'Không thể tải danh sách người dùng!',
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

  // const handleToggleStatus = (brand: Brand) => {
  //   dispatch(
  //     toggleUserstatusAction({
  //       id: brand._id,
  //       isActive: !brand.isActive,
  //       onSuccess: (data) => {
  //         message.success({
  //           content: data.data.message || 'Cập nhật trạng thái thành công!',
  //           duration: 2,
  //         });
  //       },
  //       onError: (error) => {
  //         message.error({
  //           content: error?.response?.data?.message || 'Cập nhật trạng thái thất bại!',
  //           duration: 3,
  //         });
  //       },
  //     })
  //   );
  // };

  const columns: ColumnsType<UserDetail> = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: '10%',
      render: (avatar: string) => (
        <div className="avatar-logo-preview">
          {avatar ? (
            <Image
              src={avatar}
              alt="User avatar"
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
      title: 'Tên người dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '20%',
      render: (text) => <span className="user-fullName">{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      render: (text) => <span className="user-email">{text || '-'}</span>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
      render: (text) => <span className="user-phone">{text || '-'}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: '10%',
      render: (text) => (
        <span className="user-phone">{text === 'customer' ? 'Khách hàng' : 'Admin'}</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render: (date: string) => (
        <span className="brand-date">{new Date(date).toLocaleDateString('vi-VN')}</span>
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
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log(record)}
            className="delete-btn"
          />
        </Space>
      ),
    },
  ];

  const handleDelete = (record: Brand) => {
    setSelectedBrand(record);
    setOpenConfirm(true);
  };

  // const handleConfirmDelete = () => {
  //   if (!selectedBrand) return;

  //   dispatch(
  //     deleteBrandAction({
  //       id: selectedBrand._id,
  //       onSuccess: (data) => {
  //         message.success({
  //           content: data.data.message || 'Xóa thương hiệu thành công!',
  //           duration: 2,
  //         });
  //         fetchUsers();
  //         setOpenConfirm(false);
  //       },
  //       onError: (error) => {
  //         message.error({
  //           content: error?.response?.data?.message || 'Xóa thương hiệu thất bại!',
  //           duration: 3,
  //         });
  //         setOpenConfirm(false);
  //       },
  //     })
  //   );
  // };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
    fetchUsers();
  };

  return (
    <div className="brand-page">
      <Card
        className="brand-card"
        title="Quản lý người dùng"
        extra={
          <Space>
            <Input.Search
              placeholder="Tìm kiếm người dùng..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            {/* <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
              className="add-brand-btn"
            >
              Thêm người dùng
            </Button> */}
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
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

      <ConfirmModal
        open={openConfirm}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa người dùng "${selectedBrand?.name}"?`}
        okText="Xóa"
        cancelText="Hủy"
        onOk={() => {
          console.log('');
        }}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
};

export default UserPage;
