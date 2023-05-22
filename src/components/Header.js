import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
  
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    return (
        <header>
            <Link to={'/'}>
                <h1 style={{fontSize: scrollPosition > 100 ? '1.5rem' : '2rem', cursor: 'pointer'}}>
                    {scrollPosition > 100 ? 'AW' : 'Abby Winder'}
                </h1>
            </Link>
        </header>
    )
};

export default Header;