import { useTheme } from '../../hooks/useTheme';

export default function Logo({ variant = 'full' }) {
  const { theme } = useTheme();

  const logoStyle = {
    height: '32px',
    width: 'auto',
    filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
  };

  if (variant === 'icon') {
    return (
      <img
        src="/images/logo.svg"
        alt="BeerWorld"
        style={logoStyle}
      />
    );
  }

  return (
    <img
      src="/images/logo.svg"
      alt="BeerWorld"
      style={logoStyle}
    />
  );
}
