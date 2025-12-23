import { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Upload, App, Space, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useAppDispatch } from '@/stores';
import { BlogDetail } from '@/services/blog-service';
import { updateBlogAction } from '@/stores/blog/actions';
import CustomDropdown from '@/components/CustomDropdown';
import { getCategoriesAction } from '@/stores/category';

interface EditBlogModalProps {
  open: boolean;
  blog: BlogDetail | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditBlogModal = ({ open, blog, onCancel, onSuccess }: EditBlogModalProps) => {
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

  useEffect(() => {
    if (blog && open) {
      form.setFieldsValue({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        isPublished: blog.isPublished ?? true,
        tags: normalizeTags(blog.tags),
        categoryId: typeof blog.categoryId === 'string' ? blog.categoryId : blog.categoryId?._id,
      });

      if (blog.thumbnail) {
        setFileList([
          {
            uid: '-1',
            name: 'logo.png',
            status: 'done',
            url: blog.thumbnail,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else if (!open) {
      form.resetFields();
      setFileList([]);
    }
  }, [blog, open, form]);

  const handleSubmit = async () => {
    if (!blog) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      dispatch(
        updateBlogAction({
          id: blog._id,
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt,
          thumbnail: fileList[0] as any,
          isPublished: values.isPublished ?? true,
          tags: values.tags,
          categoryId: values.categoryId,
          onSuccess: () => {
            message.success({
              content: 'Cập nhật bài viết thành công!',
              duration: 2,
            });
            form.resetFields();
            setFileList([]);
            setLoading(false);
            onSuccess();
          },
          onError: () => {
            message.error({
              content: 'Cập nhật bài viết thất bại!',
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
  const normalizeTags = (tags: any): string[] => {
    if (!tags) return [];

    // Case hiện tại của bạn
    if (
      Array.isArray(tags) &&
      tags.length === 1 &&
      typeof tags[0] === 'string' &&
      tags[0].includes(',')
    ) {
      return tags[0]
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Case chuẩn
    if (Array.isArray(tags)) return tags;

    // Case string JSON
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch {
        return [];
      }
    }

    return [];
  };

  return (
    <Modal
      title="Chỉnh sửa bài viết"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Cập nhật"
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
            options={categories?.map((c) => ({
              label: c.name,
              value: c._id,
            }))}
            value={form.getFieldValue('categoryId')}
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

export default EditBlogModal;
