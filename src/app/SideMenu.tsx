import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaWallet, FaUsers, FaCreditCard, FaUser } from 'react-icons/fa';
import './sidebar.css';

export const SideMenu = () => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    // Initialize from session storage or default to 0
    return parseInt(sessionStorage.getItem('activeIndex') || '0', 10);
  });

  useEffect(() => {
    // Update activeIndex based on the current pathname
    switch (pathname) {
      case '/':
        setActiveIndex(0);
        break;
      case '/room':
        setActiveIndex(1);
        break;
      case '/cards':
        setActiveIndex(2);
        break;
      case '/profile':
        setActiveIndex(3);
        break;
      default:
        setActiveIndex(0);
    }
  }, [pathname]);

  useEffect(() => {
    // Store the active index in session storage whenever it changes
    sessionStorage.setItem('activeIndex', activeIndex.toString());
  }, [activeIndex]);

  return (
    <aside className="sidebar">
      <div className="inner">
        <div className="header">
          <img src="/logo.jpg" alt="Logo" className="logo" />
          <h1>MetaPayd</h1>
        </div>
        <nav
          className="menu"
          style={{
            '--top': `${activeIndex * 56}px`,
          } as React.CSSProperties}
        >
          <div
            className="indicator"
            style={{ transform: `translateY(${activeIndex * 56}px)` }}
          />

          <Link href="/" passHref>
            <button className={activeIndex === 0 ? 'active' : ''}>
              <FaWallet size={20} />
              <p>Wallet</p>
            </button>
          </Link>

          <Link href="/room" passHref>
            <button className={activeIndex === 1 ? 'active' : ''}>
              <FaUsers size={20} />
              <p>Room</p>
            </button>
          </Link>

          <Link href="/cards" passHref>
            <button className={activeIndex === 2 ? 'active' : ''}>
              <FaCreditCard size={20} />
              <p>View Card</p>
            </button>
          </Link>

          <Link href="/profile" passHref>
            <button className={activeIndex === 3 ? 'active' : ''}>
              <FaUser size={20} />
              <p>Profile</p>
            </button>
          </Link>
        </nav>
      </div>
    </aside>
  );
};
