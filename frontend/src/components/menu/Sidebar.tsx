import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { palettes, colors, text, border } from '@/theme/colors';
import {
  faRightFromBracket,
  faHome,
  faCog
} from '@fortawesome/free-solid-svg-icons';
// Image is in public/images/ - reference with absolute path from public root
const logo = '/images/logo.webp';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: faHome },
    { name: 'Settings', path: '/settings', icon: faCog },
  ];

  return (
    <aside
      className="fixed top-6 left-6 z-30 w-[68px] hover:w-[200px] transform shadow-xl rounded-3xl transition-all duration-300 ease-in-out group bg-white"
    >
      <div className="flex flex-col min-h-fit border rounded-3xl" style={{
        borderColor: border.secondary,
      }}>
        {/* Logo header */}
        <div className="flex items-center py-6 px-4 border-b" style={{
          borderColor: border.secondary,
        }}>
          <div className="flex items-center justify-center group-hover:justify-start transition-all duration-300">
            <div className="h-8 w-8 bg-transparent flex items-center justify-center flex-shrink-0">
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            </div>
            <span className="ml-3 font-light text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden tracking-wide" style={{
              color: text.primary,
            }}>
              App Name
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-8">
          <ul className="space-y-1 flex flex-col">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-center group-hover:justify-start rounded-full m-0.5 px-2 py-4 text-sm font-light transition-all duration-300 ${
                      isActive ? 'shadow-lg' : ''
                    }`
                  }
                  style={({ isActive }: { isActive: boolean }) => ({
                    backgroundColor: isActive ? palettes.primary[3] : 'transparent',
                    color: isActive ? 'white' : palettes.primary[3],
                    boxShadow: isActive ? `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}20` : 'none',
                  })}
                  onMouseEnter={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = palettes.primary[3];
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = palettes.primary[3];
                    }
                  }}
                >
                  <span className="group-hover:w-6 h-6 transition-all duration-300 flex items-center justify-center">
                    <FontAwesomeIcon icon={item.icon} size="sm" />
                  </span>
                  <span className="hidden group-hover:block transition-all duration-300 overflow-hidden ml-4 whitespace-nowrap text-ellipsis">
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout button */}
          <ul className="space-y-1 mt-4 pt-4 border-t" style={{ borderColor: border.secondary }}>
            <li>
              <button
                onClick={logout}
                title="Logout"
                className="w-full flex items-center justify-center group-hover:justify-start px-2 py-4 rounded-full text-sm font-light transition-all duration-300"
                style={{
                  color: colors.secondary + '90',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary + '90';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.secondary + '90';
                }}
              >
                <span className="group-hover:w-6 h-6 transition-all duration-300 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </span>
                <span className="hidden group-hover:block transition-all duration-300 overflow-hidden ml-4 whitespace-nowrap text-ellipsis">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
