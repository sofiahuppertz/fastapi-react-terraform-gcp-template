import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { palettes, text } from '@/theme/irisGarden';
import { IconButton } from '@/components/base/IconButton';
import { CancelButton } from '../buttons/CancelButton';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  placeholder = 'Search...',
  onChange,
  className = '',
  autoFocus = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSearch = () => {
    if (isExpanded && onChange) {
      onChange('');
    }
    setIsExpanded(!isExpanded);
  };

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex items-center transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-auto'
      }`}>
        {isExpanded ? (
          <div className="relative w-full">
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-9 pr-10 py-2 text-sm border rounded-full focus:outline-none transition-all"
              style={{
                backgroundColor: palettes.grey.grey0 + '30',
                borderColor: palettes.grey.grey1,
                color: text.secondary
              }}
              autoFocus={autoFocus}
            />
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5"
              style={{ color: palettes.grey.grey2 }}
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <CancelButton
                onClick={toggleSearch}
                size="sm"
                tooltip="Clear search"
              />
            </div>
          </div>
        ) : (
          <IconButton
            icon={faMagnifyingGlass}
            onClick={toggleSearch}
            variant="ghost"
            size="md"
            tooltip="Search"
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;

