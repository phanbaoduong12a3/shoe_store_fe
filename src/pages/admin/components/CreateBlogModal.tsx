import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Upload, App, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useAppDispatch } from '@/stores';
import CustomDropdown from '@/components/CustomDropdown';
import { getCategoriesAction } from '@/stores/category';
import { createBlogAction } from '@/stores/blog/actions';

interface CreateBlogModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateBlogModal = ({ open, onCancel, onSuccess }: CreateBlogModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  useEffect(() => {
    if (open) {
      // Load categories
      dispatch(
        getCategoriesAction({
          isActive: true,
          onSuccess: (data) => {
            setCategories(data.data.categories);
          },
          onError: () => {},
        })
      );
    }
  }, [open, dispatch]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('data', values);
      setLoading(true);

      const logoFile = fileList[0]?.originFileObj;

      dispatch(
        createBlogAction({
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt,
          thumbnail: logoFile,
          isPublished: values.isPublished ?? true,
          tags: values.tags,
          categoryId: values.categoryId,
          onSuccess: () => {
            message.success({
              content: 'Tạo bài viết thành công!',
              duration: 2,
            });
            form.resetFields();
            setFileList([]);
            setLoading(false);
            onSuccess();
          },
          onError: () => {
            message.error({
              content: 'Tạo bài viết thất bại!',
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
      title="Thêm bài viết mới"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Tạo mới"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
        <Form.Item
          label="Tên bài viết"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tên bài viết!' }]}
        >
          <Input placeholder="Nhập tên bài viết" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
        >
          <Input placeholder="Nhập slug (vd: nike)" />
        </Form.Item>

        <Form.Item
          label="Nội dung bài viết"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập nội dung bài viết" />
        </Form.Item>

        <Form.Item label="Mô tả ngắn" name="excerpt">
          <Input placeholder="Nhập mô tả ngắn" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <CustomDropdown
            placeholder="Danh mục"
            options={categories?.map((b) => ({
              label: b.name,
              value: b._id,
            }))}
            onChange={(value) => form.setFieldsValue({ categoryId: value })}
          />
        </Form.Item>
        <Form.List name="tags">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Hãy nhập tên thẻ bài viết' }]}
                  >
                    <Input placeholder="Nhập tên thẻ" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                  Thêm thẻ bài viết
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label="Ảnh bài viết" name="thumbnail">
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

        <Form.Item label="Trạng thái" name="isPublished" valuePropName="checked">
          <Switch checkedChildren="Công khai" unCheckedChildren="Ẩn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBlogModal;
