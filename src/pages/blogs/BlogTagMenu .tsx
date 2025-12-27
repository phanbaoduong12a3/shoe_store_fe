const BlogTagMenu = ({
  tags,
  activeTag,
  onChange,
}: {
  tags: string[];
  activeTag?: string;
  onChange: (tag?: string) => void;
}) => {
  return (
    <div className="flex gap-6 justify-center mb-8 text-sm font-semibold">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={activeTag === tag ? 'text-yellow-400' : 'text-gray-400 hover:text-black'}
        >
          {tag.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
export default BlogTagMenu;
