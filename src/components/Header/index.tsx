import Link from 'next/link';

export default function Header() {
  // TODO
  return (
    <Link href={'/'}>
      <img src="/Logo.png" alt="logo" style={{ cursor: 'pointer' }} />
    </Link>
  );
}
