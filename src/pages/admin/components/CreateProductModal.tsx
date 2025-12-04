import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  App,
  Tabs,
  Button,
  Space,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useAppDispatch } from '@/stores';
import { createProductAction } from '@/stores/product';
import { getBrandsAction } from '@/stores/brand';
import { getCategoriesAction } from '@/stores/category';
import CustomDropdown from '@/components/CustomDropdown';

interface CreateProductModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateProductModal = ({ open, onCancel, onSuccess }: CreateProductModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ _id: string; name: string }>>([]);

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

      // Load brands
      dispatch(
        getBrandsAction({
          onSuccess: (data) => {
            setBrands(data.data.brands);
          },
          onError: () => {},
        })
      );
    }
  }, [open, dispatch]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const images = fileList.map((file) => file.originFileObj).filter(Boolean) as File[];

      dispatch(
        createProductAction({
          name: values.name,
          slug: values.slug,
          sku: values.sku,
          description: values.description,
          shortDescription: values.shortDescription,
          categoryId: values.categoryId,
          brandId: values.brandId,
          price: values.price,
          salePrice: values.salePrice,
          costPrice: values.costPrice,
          images,
          variants: values.variants || [],
          specifications: {
            material: values.material,
            sole: values.sole,
            weight: values.weight,
            origin: values.origin,
            gender: values.gender,
          },
          seo: {
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
            metaKeywords: values.metaKeywords,
          },
          isFeatured: values.isFeatured || false,
          isNew: values.isNew || false,
          onSuccess: (data) => {
            message.success({
              content: data.data.message || 'Tạo sản phẩm thành công!',
              duration: 2,
            });
            form.resetFields();
            setFileList([]);
            setLoading(false);
            onSuccess();
          },
          onError: (error) => {
            message.error({
              content: error?.response?.data?.message || 'Tạo sản phẩm thất bại!',
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

  const tabItems = [
    {
      key: 'basic',
      label: 'Thông tin cơ bản',
      children: (
        <>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
          >
            <Input placeholder="Nhập slug (vd: nike-air-max)" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: 'Vui lòng nhập SKU!' }]}
          >
            <Input placeholder="Nhập SKU" />
          </Form.Item>

          <Form.Item label="Mô tả ngắn" name="shortDescription">
            <Input.TextArea rows={2} placeholder="Nhập mô tả ngắn" />
          </Form.Item>

          <Form.Item label="Mô tả chi tiết" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
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

          <Form.Item
            label="Thương hiệu"
            name="brandId"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
          >
            <CustomDropdown
              placeholder="Thương hiệu"
              options={brands?.map((b) => ({
                label: b.name,
                value: b._id,
              }))}
              onChange={(value) => form.setFieldsValue({ categoryId: value })}
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Giá gốc"
              name="price"
              rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
              <InputNumber
                min={0}
                style={{ width: 150 }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder="0"
              />
            </Form.Item>

            <Form.Item label="Giá sale" name="salePrice">
              <InputNumber
                min={0}
                style={{ width: 150 }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder="0"
              />
            </Form.Item>

            <Form.Item label="Giá vốn" name="costPrice">
              <InputNumber
                min={0}
                style={{ width: 150 }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder="0"
              />
            </Form.Item>
          </Space>

          <Space>
            <Form.Item label="Nổi bật" name="isFeatured" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Mới" name="isNew" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </>
      ),
    },
    {
      key: 'images',
      label: 'Hình ảnh',
      children: (
        <Form.Item label="Hình ảnh sản phẩm" help="Tối đa 10 ảnh">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList.slice(0, 10))}
            beforeUpload={() => false}
            maxCount={10}
            multiple
          >
            {fileList.length < 10 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      ),
    },
    {
      key: 'variants',
      label: 'Biến thể',
      children: (
        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'color']}
                    rules={[{ required: true, message: 'Nhập màu' }]}
                  >
                    <Input placeholder="Màu" style={{ width: 120 }} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'colorCode']}>
                    <Input placeholder="Mã màu (#fff)" style={{ width: 100 }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'size']}
                    rules={[{ required: true, message: 'Nhập size' }]}
                  >
                    <InputNumber placeholder="Size" style={{ width: 80 }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'stock']}
                    rules={[{ required: true, message: 'Nhập tồn kho' }]}
                  >
                    <InputNumber placeholder="Tồn kho" style={{ width: 100 }} min={0} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'sku']}
                    rules={[{ required: true, message: 'Nhập SKU' }]}
                  >
                    <Input placeholder="SKU biến thể" style={{ width: 150 }} />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm biến thể
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ),
    },
    {
      key: 'specs',
      label: 'Thông số kỹ thuật',
      children: (
        <>
          <Form.Item label="Chất liệu" name="material">
            <Input placeholder="Nhập chất liệu" />
          </Form.Item>

          <Form.Item label="Đế giày" name="sole">
            <Input placeholder="Nhập loại đế" />
          </Form.Item>

          <Form.Item label="Trọng lượng" name="weight">
            <Input placeholder="Nhập trọng lượng" />
          </Form.Item>

          <Form.Item label="Xuất xứ" name="origin">
            <Input placeholder="Nhập xuất xứ" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select placeholder="Chọn giới tính">
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="unisex">Unisex</Select.Option>
              <Select.Option value="kids">Trẻ em</Select.Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      key: 'seo',
      label: 'SEO',
      children: (
        <>
          <Form.Item label="Meta Title" name="metaTitle">
            <Input placeholder="Nhập meta title" />
          </Form.Item>

          <Form.Item label="Meta Description" name="metaDescription">
            <Input.TextArea rows={3} placeholder="Nhập meta description" />
          </Form.Item>

          <Form.Item label="Meta Keywords" name="metaKeywords">
            <Select mode="tags" placeholder="Nhập keywords và nhấn Enter" />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Thêm sản phẩm mới"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={900}
      okText="Tạo sản phẩm"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
