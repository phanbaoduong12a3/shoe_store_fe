import TextDefault from '@/components/Text/Text';
import { Col, Divider, Layout, Row } from 'antd';
import './footer.scss';

const FooterAntd = Layout.Footer;

const Footer = () => {
  return (
    <FooterAntd className="footer">
      <Row gutter={[40, 20]}>
        <Col xs={24} md={6}>
          <TextDefault fw="700">Chung shoe</TextDefault>
          <p>Điểm đến hàng đầu cho những đôi giày thời trang và chất lượng.</p>
        </Col>

        <Col xs={12} md={6}>
          <div className="title">Về chúng tôi</div>
          <div className="link-items">Câu chuyện thương hiệu</div>
          <div className="link-items">Cửa hàng</div>
          <div className="link-items">Tuyển dụng</div>
        </Col>

        <Col xs={12} md={6}>
          <div className="title">Hỗ trợ khách hàng</div>
          <div className="link-items">Chính sách đổi trả</div>
          <div className="link-items">Chính sách bảo hành</div>
          <div className="link-items">Liên hệ</div>
        </Col>

        <Col xs={24} md={6}>
          <div className="title">Kết nối với chúng tôi</div>
          <Row gutter={12}>
            <Col>FB</Col>
            <Col>IG</Col>
            <Col>TK</Col>
          </Row>
        </Col>
      </Row>

      <Divider style={{ marginTop: 30 }} />

      <div style={{ textAlign: 'center', color: '#888' }}>
        © {new Date().getFullYear()} Chung shoe. All rights reserved.
      </div>
    </FooterAntd>
  );
};

export default Footer;
