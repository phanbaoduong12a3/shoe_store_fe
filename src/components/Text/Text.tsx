import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
const { Text } = Typography;

interface Iprops extends TextProps {
  children: React.ReactNode;
  fw?: string;
  center?: boolean;
  fs?: number;
  color?: string;
}
const TextDefault = ({ children, fw = '400', center, className, fs, color, ...rest }: Iprops) => {
  return (
    <Text
      className={`${center && 'text-center'} ${className ?? ''}`}
      style={{ fontFamily: `Manrope-${fw}`, fontSize: `${fs}px`, color: `${color}` }}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default TextDefault;
