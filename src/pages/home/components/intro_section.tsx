import React from 'react';

export default function IntroSection() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="w-full bg-whitemax-w-5xl mx-auto leading-relaxed text-gray-700">
      <h1 className="text-2xl font-bold mb-4! text-black">
        Chung Shoe™ – Mua giày chính hãng, thời trang & giá tốt
      </h1>

      <p className="mb-10!">
        Chung Shoe là nền tảng mua giày trực tuyến uy tín, nơi bạn có thể tìm thấy hàng nghìn mẫu
        giày hot nhất từ các thương hiệu đình đám như Nike, Adidas, Puma, New Balance, Converse và
        nhiều hơn nữa. Tất cả sản phẩm đều đảm bảo{' '}
        <span className="font-semibold">100% chính hãng</span>, được nhập khẩu từ nhà phân phối hoặc
        cửa hàng được uỷ quyền. Với hệ thống kiểm định chuyên nghiệp, chúng tôi mang đến trải nghiệm
        mua giày an tâm tuyệt đối.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-4! text-black">
        MUA SẮM GIÀY ONLINE DỄ DÀNG & TIỆN LỢI
      </h2>

      <p className="mb-6">
        Tại Chung Shoe, bạn có thể dễ dàng tìm kiếm các mẫu giày hot trend, giày chạy bộ, giày tập
        gym, giày lifestyle hay các phiên bản giới hạn. Toàn bộ sản phẩm đều có mô tả chi tiết,
        hướng dẫn chọn size theo chuẩn quốc tế, đánh giá từ khách hàng thực tế và gợi ý phối đồ để
        bạn lựa chọn dễ dàng hơn.
      </p>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="border border-gray-400 px-6 py-2 mx-auto block text-gray-700 hover:bg-gray-100 transition rounded-sm"
        >
          XEM THÊM
        </button>
      )}

      {expanded && (
        <div className="mt-6 text-gray-700 animate-fadeIn">
          <p className="mb-4">
            Chung Shoe còn cung cấp hệ thống phân loại nâng cao giúp bạn lọc sản phẩm theo kích cỡ,
            mức giá, thương hiệu, màu sắc và mục đích sử dụng. Nhờ vậy, bạn có thể tìm đúng đôi giày
            mong muốn chỉ trong vài giây. Ngoài ra, các bộ sưu tập mới nhất luôn được cập nhật liên
            tục hằng tuần để đảm bảo bạn không bỏ lỡ bất kỳ xu hướng thời trang nào.
          </p>
          <p className="mb-4">
            Chúng tôi cũng cung cấp các chương trình ưu đãi đặc biệt như giảm giá theo mùa, voucher
            độc quyền, miễn phí vận chuyển, đổi size nhanh trong 7 ngày và bảo hành keo đế 6 – 12
            tháng. Đội ngũ chăm sóc khách hàng luôn túc trực để hỗ trợ bạn trong mọi bước của quá
            trình mua sắm.
          </p>
          <p className="mb-4">
            Với sứ mệnh mang đến trải nghiệm mua giày hiện đại và tiện lợi nhất, Chung Shoe kỳ vọng
            trở thành điểm đến yêu thích của mọi tín đồ thể thao và người yêu thời trang trên toàn
            quốc.
          </p>
          <button
            onClick={() => setExpanded(false)}
            className="border border-gray-400 px-6 py-2 mx-auto block text-gray-700 hover:bg-gray-100 transition rounded-sm"
          >
            THU GỌN
          </button>
        </div>
      )}
    </div>
  );
}
