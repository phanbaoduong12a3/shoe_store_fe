import TextDefault from '@/components/Text/Text';
import { Button, Flex, App } from 'antd';
import './product-card.scss';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@/routers/routes-constants';
import { Product } from '@/services/product-service';
import { useAppDispatch, useAppSelector } from '@/stores';
import { addToCartAction } from '@/stores/cart';
import { getOrCreateSessionId, isUserLoggedIn } from '@/utils/cart-utils';

interface IProps {
  product: Product;
}

const ProductCard = ({ product }: IProps) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { loading: addingToCart } = useAppSelector((state) => state.cart);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const userId = localStorage.getItem('userId') || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    const firstVariant = product.variants[0];
    if (!firstVariant) {
      message.warning('Sản phẩm hiện không có sẵn!');
      return;
    }

    const isLoggedIn = isUserLoggedIn();
    const sessionId = !isLoggedIn ? getOrCreateSessionId() : userId;

    dispatch(
      addToCartAction({
        productId: product._id,
        variantId: firstVariant._id,
        quantity: 1,
        sessionId,
        onSuccess: (data) => {
          message.success({
            content: data.data.message || 'Đã thêm vào giỏ hàng! 🛒',
            duration: 2,
          });
        },
        onError: (error) => {
          message.error({
            content: error?.response?.data?.message || 'Không thể thêm vào giỏ hàng!',
            duration: 3,
          });
        },
      })
    );
  };

  return (
    <Link to={RoutePaths.PRODUCT_DETAIL_LINK(product._id)}>
      <Flex className="home-product-card" gap={24} vertical>
        <div className="home-product-image-wrapper">
          <img
            src={primaryImage?.url || 'https://via.placeholder.com/300'}
            alt={primaryImage?.alt || product.name}
          />
          {product.isNew && <span className="home-product-badge home-product-badge-new">Mới</span>}
          {hasDiscount && <span className="home-product-badge home-product-badge-sale">Sale</span>}
        </div>
        <Flex gap={6} vertical className="home-product-card-info">
          <TextDefault fs={21} fw="600" className="home-product-name">
            {product.name}
          </TextDefault>
          <Flex gap={8} align="center">
            <TextDefault color="#1555d5" fw="600" fs={18}>
              {displayPrice.toLocaleString('vi-VN')}đ
            </TextDefault>
            {hasDiscount && (
              <TextDefault color="#b9c0cb" fs={14} style={{ textDecoration: 'line-through' }}>
                {product.price.toLocaleString('vi-VN')}đ
              </TextDefault>
            )}
          </Flex>
          <Button className="home-product-btn-add" onClick={handleAddToCart} loading={addingToCart}>
            Thêm vào giỏ hàng
          </Button>
        </Flex>
      </Flex>
    </Link>
  );
};

export default ProductCard;
