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
import { updateProductAction } from '@/stores/product';
import { getBrandsAction } from '@/stores/brand';
import { getCategoriesAction } from '@/stores/category';
import CustomDropdown from '@/components/CustomDropdown';
import { Product } from '@/services/product-service';
import { RcFile } from 'antd/es/upload/interface';

interface EditProductModalProps {
  open: boolean;
  product: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditProductModal = ({ open, product, onCancel, onSuccess }: EditProductModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    if (product && open) {
      console.log('product: ', product);
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
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        shortDescription: product.shortDescription,

        categoryId:
          typeof product.categoryId === 'string' ? product.categoryId : product.categoryId?._id,

        brandId: typeof product.brandId === 'string' ? product.brandId : product.brandId?._id,

        price: product.price,
        salePrice: product.salePrice,
        costPrice: product.costPrice,

        variants: product.variants || [],
        specifications: product.specifications || {},
        seo: product.seo || { metaKeywords: [] },

        isFeatured: product.isFeatured,
        isNew: product.isNew,
      });

      if (product.images?.length > 0) {
        const convertOldImages = async () => {
          const converted: UploadFile[] = await Promise.all(
            product.images.map(async (img, index) => {
              const file = await urlToFile(img.url, img.alt || `image-${index}.jpg`);

              const rcFile = toRcFile(file, String(index));

              return {
                uid: String(index),
                name: img.alt || `image-${index}`,
                status: 'done',
                url: img.url,
                thumbUrl: img.url,
                isPrimary: img.isPrimary,
                originFileObj: rcFile,
                size: rcFile.size,
                type: rcFile.type,
              };
            })
          );

          setFileList(converted);
        };

        convertOldImages();
      } else {
        setFileList([]);
      }
    }
  }, [product, open]);
  const toRcFile = (file: File, uid: string): RcFile => {
    const rc = file as RcFile;
    rc.uid = uid;
    return rc;
  };
  const urlToFile = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const images = fileList.map((file) => file.originFileObj).filter(Boolean) as File[];

      dispatch(
        updateProductAction({
          id: product?._id || '',
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
          images: images.length ? images : undefined, // nếu không upload ảnh mới thì giữ nguyên
          variants: values.variants || [],
          specifications: values.specifications,
          seo: values.seo,
          isFeatured: values.isFeatured || false,
          isNew: values.isNew || false,

          onSuccess: (data) => {
            message.success({
              content: 'Cập nhật sản phẩm thành công!',
              duration: 2,
            });
            setLoading(false);
            onSuccess();
          },

          onError: (error) => {
            message.error({
              content: 'Cập nhật thất bại!',
              duration: 3,
            });
            setLoading(false);
          },
        })
      );
    } catch (error) {
      console.error('Update validate failed:', error);
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
              options={categories?.map((c) => ({
                label: c.name,
                value: c._id,
              }))}
              value={form.getFieldValue('categoryId')}
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
              value={form.getFieldValue('brandId')}
              onChange={(value) => form.setFieldsValue({ brandId: value })}
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
      key: 'specifications',
      label: 'Thông số kỹ thuật',
      children: (
        <>
          <Form.Item label="Chất liệu" name={['specifications', 'material']}>
            <Input placeholder="Nhập chất liệu" />
          </Form.Item>

          <Form.Item label="Đế giày" name={['specifications', 'sole']}>
            <Input placeholder="Nhập loại đế" />
          </Form.Item>

          <Form.Item label="Trọng lượng" name={['specifications', 'weight']}>
            <Input placeholder="Nhập trọng lượng" />
          </Form.Item>

          <Form.Item label="Xuất xứ" name={['specifications', 'origin']}>
            <Input placeholder="Nhập xuất xứ" />
          </Form.Item>

          <Form.Item label="Giới tính" name={['specifications', 'gender']}>
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
          <Form.Item label="Meta Title" name={['seo', 'metaTitle']}>
            <Input placeholder="Nhập meta title" />
          </Form.Item>

          <Form.Item label="Meta Description" name={['seo', 'metaDescription']}>
            <Input.TextArea rows={3} placeholder="Nhập meta description" />
          </Form.Item>

          <Form.Item label="Meta Keywords" name={['seo', 'metaKeywords']}>
            <Select mode="tags" placeholder="Nhập keywords và nhấn Enter" />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Cập nhật sản phẩm"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={900}
      okText="Lưu sản phẩm"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
};

export default EditProductModal;
