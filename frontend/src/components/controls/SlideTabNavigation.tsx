import React, { useRef, useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { palettes, border, colors } from '@/theme/colors';

export interface TabItem {
  key: string;
  label: string;
  icon?: IconDefinition;
  isConditional?: boolean; // For tabs that only show under certain conditions
  isVisible?: boolean; // Whether the conditional tab should be visible
}

export interface SlideTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabClick: (tabKey: string) => void;
  className?: string;
  colorScheme?: {
    background?: string;
    border?: string;
    activeBackground?: string;
    activeText?: string;
    inactiveText?: string;
  };
}

const SlideTabNavigation: React.FC<SlideTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabClick,
  className = '',
  colorScheme = {
    background: palettes.secondary[0] + '90',
    border: border.secondary,
    activeBackground: colors.secondary,
    activeText: palettes.secondary[0],
    inactiveText: palettes.secondary[6],
  }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  // Filter tabs to only include visible ones - memoized to prevent infinite re-renders
  const visibleTabs = useMemo(() => 
    tabs.filter(tab => !tab.isConditional || tab.isVisible),
    [tabs]
  );
  
  // Calculate active tab index
  const activeTabIndex = visibleTabs.findIndex(tab => tab.key === activeTab);

  // Update slider position based on active tab
  useEffect(() => {
    if (activeTabIndex === -1 || !containerRef.current) {
      setSliderStyle({ left: 0, width: 0 });
      return;
    }

    const activeTabKey = visibleTabs[activeTabIndex].key;
    const activeButton = buttonRefs.current.get(activeTabKey);
    const container = containerRef.current;

    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    // Calculate position relative to container (accounting for container padding)
    const left = buttonRect.left - containerRect.left;
    const width = buttonRect.width;

    setSliderStyle({ left, width });
  }, [activeTab, activeTabIndex, visibleTabs]);

  // Set button ref
  const setButtonRef = (key: string, element: HTMLButtonElement | null) => {
    if (element) {
      buttonRefs.current.set(key, element);
    } else {
      buttonRefs.current.delete(key);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex rounded-full shadow-sm border p-1 w-fit ${className}`}
      style={{ 
        backgroundColor: colorScheme.background,
        borderColor: colorScheme.border
      }}
    >
      {/* Sliding background indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out shadow-sm"
        style={{
          backgroundColor: colorScheme.activeBackground,
          width: `${sliderStyle.width}px`,
          left: `${sliderStyle.left}px`,
          transform: 'translateZ(0)' // Hardware acceleration
        }}
      />
      
      {/* Tab buttons */}
      {visibleTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        
        return (
          <button
            key={tab.key}
            ref={(el) => setButtonRef(tab.key, el)}
            onClick={() => onTabClick(tab.key)}
            className="relative z-10 flex items-center px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap"
            style={{
              color: isActive ? colorScheme.activeText : colorScheme.inactiveText,
            }}
          >
            {tab.icon && (
              <FontAwesomeIcon icon={tab.icon} className="h-2.5 w-2.5 mr-2" />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SlideTabNavigation;
