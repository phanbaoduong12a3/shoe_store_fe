import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Image, Input } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import './brand-page.scss';
import CreateBrandModal from './components/CreateBrandModal';
import ConfirmModal from '@/components/ConfirmModal';
import { UserDetail } from '@/services/user-service';
import { deleteUserAction, getListUserAction } from '@/stores/user/actions';

const UserPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading, total } = useAppSelector((state) => state.user);
  const { message } = App.useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
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
    setCurrentPage(1);
  };

  const columns: ColumnsType<UserDetail> = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: '10%',
      render: (avatar: string) => (
        <div className="user-logo-preview">
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
      render: (text) => <span className="user-name">{text}</span>,
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
        <span className="user-role">{text === 'customer' ? 'Khách hàng' : 'Admin'}</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render: (date: string) => (
        <span className="user-date">{new Date(date).toLocaleDateString('vi-VN')}</span>
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
            onClick={() => handleDelete(record)}
            className="delete-btn"
          />
        </Space>
      ),
    },
  ];

  const handleDelete = (record: UserDetail) => {
    setSelectedUser(record);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    dispatch(
      deleteUserAction({
        id: selectedUser._id,
        onSuccess: (data) => {
          message.success({
            content: 'Xóa người dùng thành công!',
            duration: 2,
          });
          fetchUsers();
          setOpenConfirm(false);
        },
        onError: (error) => {
          message.error({
            content: 'Xóa người dùng thất bại!',
            duration: 3,
          });
          setOpenConfirm(false);
        },
      })
    );
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
    fetchUsers();
  };

  return (
    <div className="user-page">
      <Card
        className="user-card"
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
            showTotal: (total) => `Tổng ${total} người dùng`,
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
        content={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.fullName}"?`}
        okText="Xóa"
        cancelText="Hủy"
        onOk={() => {
          handleConfirmDelete();
        }}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
};

export default UserPage;
