import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Project } from '../../types/project';
import { projectService } from '../../services/projects/projectService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { palettes, primary, text, background, border } from '@/theme/irisGarden';
import { 
  faLeaf,
  faDna,
  faVial,
  faBook,
  faRightFromBracket,
  faDiagramProject,
  faHome,
  faX
} from '@fortawesome/free-solid-svg-icons';
import logoTopLeft from '../../assets/brand/logo.png';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    const fetchActiveProject = async () => {
      try {
        const project = await projectService.getActiveProject();
        setActiveProject(project);
      } catch (error) {
        console.error('Error fetching active project:', error);
        setActiveProject(null);
      }
    };
    
    fetchActiveProject();

    // Listen for project changes (e.g., when user sets a new active project)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activeProjectChanged') {
        fetchActiveProject();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-window project changes
    const handleProjectChange = () => {
      fetchActiveProject();
    };
    
    window.addEventListener('activeProjectChanged', handleProjectChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activeProjectChanged', handleProjectChange);
    };
  }, []);

  // Create base navigation items
  const baseNavItems = [
    { name: 'Home', path: '/home', icon: <FontAwesomeIcon icon={faHome} size="sm" /> },
    { name: 'Projects', path: '/projects', icon: <FontAwesomeIcon icon={faDiagramProject} size="sm" /> },
    { name: 'Library', path: '/library', icon: <FontAwesomeIcon icon={faBook} size="sm" /> },

  ];
  
  // Add project-specific items if there's an active project
  const projectNavItems = activeProject ? [
    { 
      name: 'GCMS Analysis', 
      path: `/projects/${activeProject.name}/gcms-analysis`, 
      icon: <FontAwesomeIcon icon={faDna} size="sm" />,
      projectName: activeProject.name
    },
    { 
      name: 'Global Formula', 
      path: `/projects/${activeProject.name}/global-formula`, 
      icon: <FontAwesomeIcon icon={faLeaf} size="sm" />,
      projectName: activeProject.name
    },
    { 
      name: 'Redosing', 
      path: `/projects/${activeProject.name}/redosing`, 
      icon: <FontAwesomeIcon icon={faVial} size="sm" />,
      projectName: activeProject.name
    },
  ] : [];


  return (
    <>

      {/* Sidebar */}
      <aside 
        className={`fixed top-6 left-6 z-30 ${
          showNotifications 
            ? 'w-[400px]' 
            : 'w-[68px] hover:w-[200px]'
        } transform shadow-2xl rounded-3xl transition-all duration-300 ease-in-out group`}
        style={{
          backgroundColor: showNotifications 
            ? `${background.sage}80` // 50% opacity
            : 'white',
          backdropFilter: showNotifications ? 'blur(16px)' : 'none',
        }}
      >
        {showNotifications ? (
          // Notifications view
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b" style={{
              borderColor: border.sage,
            }}>
              <h2 className="text-xl font-semibold" style={{
                color: text.primary,
              }}>Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-lg transition-all"
                style={{
                  color: text.subtle,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = text.secondary;
                  e.currentTarget.style.backgroundColor = background.olive;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = text.subtle;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FontAwesomeIcon icon={faX} className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          // Regular sidebar view
          <div className="flex flex-col min-h-fit border rounded-3xl" style={{
            borderColor: palettes.lilac.lilac0,
          }}>
            {/* Sidebar header */}
            <div className="flex items-center py-6 px-4 border-b" style={{
              borderColor: palettes.lilac.lilac0,
            }}>
              <div className="flex items-center justify-center group-hover:justify-start transition-all duration-300">
                <div className="h-8 w-8 bg-transparent flex items-center justify-center flex-shrink-0">
                  <img src={logoTopLeft} alt="Logo" className="h-8 w-8 object-contain" />
                </div>
                <span className="ml-3 font-light text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden tracking-wide" style={{
                  color: text.primary,
                }}>
                  Parfums+
                </span>
              </div>
            </div>

          {/* Navigation */}
          <nav className="py-8">
            {/* Base Navigation */}
            <ul className="space-y-1 flex flex-col mb-4 border-b" style={{
              borderColor: palettes.lilac.lilac0,
            }}>
              {baseNavItems.map((item) => (
                <li key={item.path} className="">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                        `flex items-center justify-center group-hover:justify-start rounded-full m-0.5 px-2 py-4 text-sm font-light transition-all duration-300 ${
                          isActive 
                            ? 'shadow-lg' 
                            : ''
                        }`
                      }
                    style={({ isActive }: { isActive: boolean }) => ({
                      backgroundColor: isActive ? palettes.sage.sage3 : 'transparent',
                      color: isActive ? 'white' : palettes.sage.sage3,
                      boxShadow: isActive ? `0 10px 15px -3px ${primary.sage}20, 0 4px 6px -2px ${primary.sage}20` : 'none',
                    })}
                    onMouseEnter={(e) => {
                      const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = palettes.sage.sage3;
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = palettes.sage.sage3;
                      }
                    }}
                  >
                    <span className="group-hover:w-6 h-6 transition-all duration-300 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span className="hidden group-hover:block transition-all duration-300 overflow-hidden ml-4 whitespace-nowrap text-ellipsis">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Project Navigation */}
            {activeProject && (
              <>

                <ul className="space-y-1">
                  {projectNavItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => 
                          `flex items-center justify-center group-hover:justify-start mx-1 px-2 py-4 my-0.5 rounded-full text-sm font-light transition-all duration-300 ${
                            isActive 
                              ? 'shadow-lg' 
                              : ''
                          }`
                        }
                        style={({ isActive }: { isActive: boolean }) => ({
                          backgroundColor: isActive ? palettes.sage.sage3 : 'transparent',
                          color: isActive ? 'white' : palettes.sage.sage3,
                          boxShadow: isActive ? `0 10px 15px -3px ${primary.sage}20, 0 4px 6px -2px ${primary.sage}20` : 'none',
                        })}
                        onMouseEnter={(e) => {
                          const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = palettes.sage.sage3;
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = palettes.sage.sage3;
                          }
                        }}
                      >
                        <span className="group-hover:w-6 h-6 transition-all duration-300 flex items-center justify-center">
                          {item.icon}
                        </span>
                        <span className="hidden group-hover:block transition-all duration-300 overflow-hidden ml-4 whitespace-nowrap text-ellipsis">
                          {item.name}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                  
                </ul>
              </>
            )}

            {/* Logout button */}
            <ul className="space-y-1">
              <li className="mt-4 " >
                <button
                  onClick={logout}
                  title="Logout"
                  className="mt-1 w-full flex items-center justify-center group-hover:justify-start px-2 py-4 rounded-full text-sm font-light transition-all duration-300"
                  style={{
                    color: primary.lilac + '90',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primary.lilac + '90';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = primary.lilac + '90';
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
        )}
      </aside>
    </>
  );
};

export default Sidebar;