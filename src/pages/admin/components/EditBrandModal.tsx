import { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Upload, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useAppDispatch } from '@/stores';
import { updateBrandAction } from '@/stores/brand';
import { Brand } from '@/services/brand-service';

interface EditBrandModalProps {
  open: boolean;
  brand: Brand | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditBrandModal = ({ open, brand, onCancel, onSuccess }: EditBrandModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (brand && open) {
      form.setFieldsValue({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || '',
        isActive: brand.isActive,
      });

      // Set existing logo preview
      if (brand.logo) {
        setFileList([
          {
            uid: '-1',
            name: 'logo.png',
            status: 'done',
            url: brand.logo,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else if (!open) {
      form.resetFields();
      setFileList([]);
    }
  }, [brand, open, form]);

  const handleSubmit = async () => {
    if (!brand) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      dispatch(
        updateBrandAction({
          id: brand._id,
          name: values.name,
          slug: values.slug,
          description: values.description,
          logo: fileList[0] as any,
          isActive: values.isActive ?? true,
          onSuccess: (data) => {
            message.success({
              content: data.data.message || 'Cập nhật thương hiệu thành công!',
              duration: 2,
            });
            form.resetFields();
            setFileList([]);
            setLoading(false);
            onSuccess();
          },
          onError: (error) => {
            message.error({
              content: error?.response?.data?.message || 'Cập nhật thương hiệu thất bại!',
              duration: 3,
            });
            setLoading(false);
          },
        })
      );
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title="Chỉnh sửa thương hiệu"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên thương hiệu"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu!' }]}
        >
          <Input placeholder="Nhập tên thương hiệu" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
        >
          <Input placeholder="Nhập slug (vd: nike)" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Nhập mô tả thương hiệu" />
        </Form.Item>

        <Form.Item label="Logo" name="logo">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBrandModal;
