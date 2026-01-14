import React, { ReactNode } from 'react';
import { faArrowLeft, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import SlideTabNavigation, { TabItem } from '../controls/SlideTabNavigation.tsx';
import SearchBar from '../controls/SearchBar.tsx';
import { IconButton } from '@/components/base/IconButton';
import { palettes } from '@/theme/colors';


export interface NavigationBarProps {
  // Back button
  showBackButton?: boolean;
  onBack?: () => void;
  
  // Tab navigation
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  
  // Search functionality
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  
  // Action buttons
  showDownloadButton?: boolean;
  downloadLabel?: string;
  onDownload?: () => void;
  downloadDisabled?: boolean;
  downloadLoading?: boolean;
  downloadSuccess?: boolean;
  
  showAddButton?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  
  // Styling
  className?: string;
  
  // Visibility
  hidden?: boolean;
  
  // Custom content
  customContent?: ReactNode;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  showBackButton = false,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  showSearch = false,
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  showDownloadButton = false,
  downloadLabel = 'Download',
  onDownload,
  downloadDisabled = false,
  downloadLoading = false,
  showAddButton = false,
  addLabel = 'Add',
  onAdd,
  hidden = false,
  customContent
}) => {
  // Return null if hidden
  if (hidden) {
    return null;
  }

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between rounded-full shadow-sm  border navbar-scroll`}
      style={{
        backgroundColor: palettes.primary[0] + '40',
        borderColor: palettes.primary[0] + '80',
        padding: '6px 16px',
        overflowX: 'auto',
        overflowY: 'visible'
      }}
    >
      {/* Left side - Back button and tabs */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {showBackButton && onBack && (
          <div className="flex-shrink-0">
            <IconButton
              icon={faArrowLeft}
              onClick={onBack}
              variant="ghost"
              size="md"
              tooltip="Go back"
            />
          </div>
        )}
        
        {tabs && tabs.length > 0 && activeTab && onTabChange && (
          <SlideTabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={onTabChange}
            className="min-w-fit"
          />
        )}
      </div>

      {/* Right side - Search, actions, and custom content */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        {showSearch && (
          <div className="flex-shrink-0">
            <SearchBar
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              autoFocus={true}
            />
          </div>
        )}

        {/* Download Button */}
        {showDownloadButton && onDownload && (
          <div className="flex-shrink-0">
            <IconButton
              icon={faDownload}
              onClick={onDownload}
              variant="ghost"
              size="md"
              tooltip={downloadLabel}
              disabled={downloadDisabled}
              loading={downloadLoading}
            />
          </div>
        )}

        {/* Add Button */}
        {showAddButton && onAdd && (
          <div className="flex-shrink-0">
            <IconButton
              icon={faPlus}
              onClick={onAdd}
              size="md"
              tooltip={addLabel}
            />
          </div>
        )}


        {/* Custom content */}
        {customContent && (
          <div className="flex-shrink-0">
            {customContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
