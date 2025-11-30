import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, InputNumber, Spin, Tag, Breadcrumb, App } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, StarFilled } from '@ant-design/icons';
import TextDefault from '@/components/Text/Text';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getProductDetailAction } from '@/stores/product';
import { addToCartAction } from '@/stores/cart';
import { RoutePaths } from '@/routers/routes-constants';
import { Link } from 'react-router-dom';
import type { Category, Brand } from '@/services/product-service';
import { getOrCreateSessionId, isUserLoggedIn } from '@/utils/cart-utils';
import './product-detail.scss';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { productDetail, loading } = useAppSelector((state) => state.product);
  const { loading: addingToCart } = useAppSelector((state) => state.cart);
  const { message } = App.useApp();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    if (id) {
      dispatch(
        getProductDetailAction({
          id,
          onSuccess: (data) => {
            console.log('Product detail loaded:', data);
            if (data.data.product.variants.length > 0) {
              setSelectedColor(data.data.product.variants[0].color);
              setSelectedSize(data.data.product.variants[0].size);
            }
          },
          onError: (error) => {
            console.error('Error loading product detail:', error);
          },
        })
      );
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!selectedVariant || !id) {
      message.warning('Vui lòng chọn màu sắc và kích cỡ!');
      return;
    }

    const isLoggedIn = isUserLoggedIn();
    const sessionId = !isLoggedIn ? getOrCreateSessionId() : userId;

    console.log('Session ID:', getOrCreateSessionId(), userId);

    dispatch(
      addToCartAction({
        productId: id,
        variantId: selectedVariant._id,
        quantity,
        sessionId,
        onSuccess: (data) => {
          message.success({
            content: data.data.message || 'Đã thêm sản phẩm vào giỏ hàng! 🛒',
            duration: 2,
          });
        },
        onError: (error) => {
          message.error({
            content:
              error?.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại!',
            duration: 3,
          });
        },
      })
    );
  };

  if (loading || !productDetail) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const product = productDetail;
  const category = typeof product.categoryId === 'object' ? (product.categoryId as Category) : null;
  const brand = typeof product.brandId === 'object' ? (product.brandId as Brand) : null;

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const availableSizes = product.variants
    .filter((v) => v.color === selectedColor)
    .map((v) => ({ size: v.size, stock: v.stock }));

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  return (
    <div className="product-detail-page">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>
          <Link to={RoutePaths.HOME}>Trang chủ</Link>
        </Breadcrumb.Item>
        {category && (
          <Breadcrumb.Item>
            <Link to={RoutePaths.HOME}>{category.name}</Link>
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Flex gap={40} className="product-container">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[selectedImage]?.url || primaryImage?.url}
              alt={product.images[selectedImage]?.alt || product.name}
            />
            {hasDiscount && <div className="discount-badge">-{discountPercent}%</div>}
          </div>
          <Flex gap={12} className="thumbnail-list">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img.url} alt={img.alt || product.name} />
              </div>
            ))}
          </Flex>
        </div>

        <div className="product-info">
          <Flex vertical gap={16}>
            {brand && (
              <Flex align="center" gap={12}>
                <img src={brand.logo} alt={brand.name} className="brand-logo" />
                <TextDefault color="#6b7280">{brand.name}</TextDefault>
              </Flex>
            )}

            <TextDefault fs={32} fw="700" className="product-name">
              {product.name}
            </TextDefault>

            <Flex gap={12} align="center">
              <TextDefault color="#6b7280">SKU: {product.sku}</TextDefault>
              {product.isNew && <Tag color="green">Mới</Tag>}
              {product.isFeatured && <Tag color="blue">Nổi bật</Tag>}
              {product.isActive ? (
                <Tag color="success">Còn hàng</Tag>
              ) : (
                <Tag color="error">Hết hàng</Tag>
              )}
            </Flex>

            <Flex gap={24} align="center">
              <Flex gap={4} align="center">
                <StarFilled style={{ color: '#fadb14' }} />
                <TextDefault fw="600">5.0</TextDefault>
                <TextDefault color="#6b7280">(0 đánh giá)</TextDefault>
              </Flex>
              <TextDefault color="#6b7280">Đã bán: {product.totalSold}</TextDefault>
            </Flex>

            <Flex gap={16} align="center" className="price-section">
              <TextDefault fs={36} fw="700" color="#1555d5">
                {displayPrice.toLocaleString('vi-VN')}đ
              </TextDefault>
              {hasDiscount && (
                <TextDefault fs={24} color="#b9c0cb" style={{ textDecoration: 'line-through' }}>
                  {product.price.toLocaleString('vi-VN')}đ
                </TextDefault>
              )}
            </Flex>

            {product.shortDescription && (
              <TextDefault color="#6b7280" className="short-description">
                {product.shortDescription}
              </TextDefault>
            )}

            <div className="divider" />

            <div className="selection-group">
              <TextDefault fw="600" className="selection-label">
                Màu sắc:
              </TextDefault>
              <Flex gap={12} wrap="wrap">
                {uniqueColors.map((color) => (
                  <Button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(null);
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </Flex>
            </div>

            <div className="selection-group">
              <TextDefault fw="600" className="selection-label">
                Kích cỡ:
              </TextDefault>
              <Flex gap={12} wrap="wrap">
                {availableSizes.map((item) => (
                  <Button
                    key={item.size}
                    className={`size-btn ${selectedSize === item.size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(item.size)}
                    disabled={item.stock === 0}
                  >
                    {item.size}
                  </Button>
                ))}
              </Flex>
            </div>

            {selectedVariant && (
              <TextDefault color="#6b7280">
                Còn lại: <span style={{ fontWeight: 600 }}>{selectedVariant.stock}</span> sản phẩm
              </TextDefault>
            )}

            <div className="selection-group">
              <TextDefault fw="600" className="selection-label">
                Số lượng:
              </TextDefault>
              <InputNumber
                min={1}
                max={selectedVariant?.stock || 99}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                size="large"
                className="quantity-input"
              />
            </div>

            <Flex gap={16}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                className="add-to-cart-btn"
                disabled={!selectedVariant}
                loading={addingToCart}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button size="large" icon={<HeartOutlined />} className="wishlist-btn">
                Yêu thích
              </Button>
            </Flex>
          </Flex>
        </div>
      </Flex>

      <div className="product-details-section">
        <TextDefault fs={24} fw="700" className="section-title">
          Thông tin chi tiết
        </TextDefault>

        <Flex vertical gap={24} className="details-content">
          {product.description && (
            <div className="detail-block">
              <TextDefault fs={18} fw="600">
                Mô tả sản phẩm
              </TextDefault>
              <TextDefault color="#6b7280">{product.description}</TextDefault>
            </div>
          )}

          {product.specifications && (
            <div className="detail-block">
              <TextDefault fs={18} fw="600">
                Thông số kỹ thuật
              </TextDefault>
              <div className="specs-grid">
                {product.specifications.material && (
                  <Flex justify="space-between" className="spec-row">
                    <TextDefault color="#6b7280">Chất liệu:</TextDefault>
                    <TextDefault fw="600">{product.specifications.material}</TextDefault>
                  </Flex>
                )}
                {product.specifications.sole && (
                  <Flex justify="space-between" className="spec-row">
                    <TextDefault color="#6b7280">Đế giày:</TextDefault>
                    <TextDefault fw="600">{product.specifications.sole}</TextDefault>
                  </Flex>
                )}
                {product.specifications.weight && (
                  <Flex justify="space-between" className="spec-row">
                    <TextDefault color="#6b7280">Trọng lượng:</TextDefault>
                    <TextDefault fw="600">{product.specifications.weight}</TextDefault>
                  </Flex>
                )}
                {product.specifications.origin && (
                  <Flex justify="space-between" className="spec-row">
                    <TextDefault color="#6b7280">Xuất xứ:</TextDefault>
                    <TextDefault fw="600">{product.specifications.origin}</TextDefault>
                  </Flex>
                )}
                {product.specifications.gender && (
                  <Flex justify="space-between" className="spec-row">
                    <TextDefault color="#6b7280">Giới tính:</TextDefault>
                    <TextDefault fw="600">
                      {product.specifications.gender === 'male'
                        ? 'Nam'
                        : product.specifications.gender === 'female'
                          ? 'Nữ'
                          : product.specifications.gender === 'unisex'
                            ? 'Unisex'
                            : 'Trẻ em'}
                    </TextDefault>
                  </Flex>
                )}
              </div>
            </div>
          )}
        </Flex>
      </div>
    </div>
  );
};

export default ProductDetailPage;
