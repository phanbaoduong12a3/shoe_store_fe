import ContentLoader from 'react-content-loader';

const ImageSkeleton = () => {
  return (
    <div className="home-product-card">
      <ContentLoader
        speed={2}
        width="100%"
        height={300}
        viewBox="0 0 100 300"
        backgroundColor="#f3f4f6"
        foregroundColor="#e5e7eb"
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" rx="0" ry="0" width="100" height="300" />
      </ContentLoader>

      <div className="home-product-card-info">
        <ContentLoader
          speed={2}
          width="100%"
          height={56}
          viewBox="0 0 100 56"
          backgroundColor="#f3f4f6"
          foregroundColor="#e5e7eb"
          preserveAspectRatio="none"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100" height="12" />
          <rect x="0" y="18" rx="4" ry="4" width="85" height="12" />
          <rect x="0" y="40" rx="4" ry="4" width="60" height="16" />
        </ContentLoader>

        <div style={{ marginTop: '8px' }}>
          <ContentLoader
            speed={2}
            width="100%"
            height={40}
            viewBox="0 0 100 40"
            backgroundColor="#f3f4f6"
            foregroundColor="#e5e7eb"
            preserveAspectRatio="none"
          >
            <rect x="0" y="0" rx="8" ry="8" width="100" height="40" />
          </ContentLoader>
        </div>
      </div>
    </div>
  );
};

export default ImageSkeleton;
