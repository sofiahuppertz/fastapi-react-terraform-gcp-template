import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListSkeleton from '@/components/loading/ListSkeleton';
import { ListState } from '@/hooks/useListState';
import { text } from '@/theme/colors';

interface BaseListComponentProps<T> {
  // Data
  items: T[];
  totalArea?: number; // For abundance calculations
  
  // State management
  listState?: ListState;
  updateListState?: (updates: Partial<ListState>) => void;
  
  // Search & Sort
  searchTerm?: string;
  searchFields?: (item: T) => string[]; // Function to extract searchable fields
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  sortFields?: Record<string, (item: T) => string | number>; // Map of sort keys to value extractors
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;
  
  // Rendering
  renderItem: (item: T, index: number, displayedItems: T[]) => React.ReactNode;
  getItemKey: (item: T) => string;
  
  // Messages
  emptyMessage?: string;
  emptySearchMessage?: string;
  loadingMoreMessage?: string;
  endMessage?: string;
  
  // Infinite scroll config
  itemsPerPage?: number;
  scrollContainerId: string;
  
  // Additional props
  className?: string;
  listClassName?: string;
  
  // Callbacks
  onDataChange?: (items: T[], totalArea?: number) => void;
  onItemCountChange?: (count: number) => void;
}

/**
 * Reusable list component with infinite scroll, search, sort, and state persistence.
 * Handles loading states, error states, empty states, and scroll position restoration.
 */
function BaseListComponent<T>({
  items,
  totalArea,
  listState,
  updateListState,
  searchTerm = '',
  searchFields,
  sortBy,
  sortDirection = 'asc',
  sortFields,
  isLoading,
  error,
  renderItem,
  getItemKey,
  emptyMessage = 'No items found',
  emptySearchMessage = 'No items match your search',
  loadingMoreMessage = 'Loading more items...',
  endMessage,
  itemsPerPage = 20,
  scrollContainerId,
  className = 'h-full flex flex-col',
  listClassName = 'px-2 pt-6 pb-8',
  onDataChange,
  onItemCountChange
}: BaseListComponentProps<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Process items: filter by search and sort
  const processedItems = useMemo(() => {
    let filtered = items;

    // Apply search filter
    if (searchTerm && searchTerm.trim() && searchFields) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = items.filter(item => {
        const fields = searchFields(item);
        return fields.some(field => field.toLowerCase().includes(searchLower));
      });
    }

    // Apply sorting
    if (sortBy && sortFields && sortFields[sortBy]) {
      const sortFn = sortFields[sortBy];
      filtered = [...filtered].sort((a, b) => {
        const aValue = sortFn(a);
        const bValue = sortFn(b);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        } else {
          const comparison = (aValue as number) - (bValue as number);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
      });
    }

    return filtered;
  }, [items, searchTerm, searchFields, sortBy, sortDirection, sortFields]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(processedItems, totalArea);
    }
  }, [processedItems, totalArea, onDataChange]);

  // Notify parent of count changes
  useEffect(() => {
    if (onItemCountChange) {
      onItemCountChange(processedItems.length);
    }
  }, [processedItems.length, onItemCountChange]);

  // Load more items for infinite scroll
  const fetchMoreData = useCallback(() => {
    if (displayedItems.length >= processedItems.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const nextItems = processedItems.slice(
        displayedItems.length,
        displayedItems.length + itemsPerPage
      );
      
      setDisplayedItems(prev => [...prev, ...nextItems]);
      
      const newCount = displayedItems.length + nextItems.length;
      if (newCount >= processedItems.length) {
        setHasMore(false);
      }
    }, 50);
  }, [displayedItems.length, processedItems, itemsPerPage]);

  // Track previous processed items to detect changes
  const prevProcessedItemsRef = React.useRef<T[]>([]);
  const prevItemsLengthRef = React.useRef<number>(0);
  const prevItemsKeysRef = React.useRef<string>('');
  const prevSearchTermRef = React.useRef<string>(searchTerm);
  const shouldRestoreScrollRef = React.useRef<boolean>(false);

  // Initialize displayed items when processed items change
  useEffect(() => {
    // Create a stable key from the first and last items to detect content changes
    const itemsKey = processedItems.length > 0 
      ? `${getItemKey(processedItems[0])}-${getItemKey(processedItems[processedItems.length - 1])}-${processedItems.length}`
      : '';
    
    const hasStructureChanged = 
      processedItems.length !== prevItemsLengthRef.current ||
      itemsKey !== prevItemsKeysRef.current;

    // Check if search term has changed
    const hasSearchChanged = prevSearchTermRef.current !== searchTerm;

    // Check if items have been updated (same structure but different item data)
    const hasItemUpdates = prevProcessedItemsRef.current.length > 0 && 
      processedItems.length === prevProcessedItemsRef.current.length &&
      processedItems.some((item, index) => {
        const prevItem = prevProcessedItemsRef.current[index];
        return !prevItem || item !== prevItem;
      });

    if (hasStructureChanged || hasSearchChanged) {
      prevItemsLengthRef.current = processedItems.length;
      prevItemsKeysRef.current = itemsKey;
      prevProcessedItemsRef.current = processedItems;
      prevSearchTermRef.current = searchTerm;

      if (processedItems.length > 0) {
        // If search changed, reset to initial page and scroll to top
        // Otherwise, restore previous scroll position by loading more items if needed
        const itemsToLoad = hasSearchChanged 
          ? itemsPerPage 
          : Math.min(listState?.displayedItemsCount || itemsPerPage, processedItems.length);
        
        const initialItems = processedItems.slice(0, itemsToLoad);
        setDisplayedItems(initialItems);
        setHasMore(processedItems.length > itemsToLoad);
        
        // Only restore scroll if search hasn't changed
        shouldRestoreScrollRef.current = !hasSearchChanged;
        
        // Reset scroll position if search changed
        if (hasSearchChanged) {
          const scrollContainer = document.getElementById(scrollContainerId);
          if (scrollContainer) {
            scrollContainer.scrollTop = 0;
          }
          if (updateListState) {
            updateListState({ scrollPosition: 0, displayedItemsCount: itemsToLoad });
          }
        }
      } else {
        setDisplayedItems([]);
        setHasMore(false);
        shouldRestoreScrollRef.current = false;
      }
    } else if (hasItemUpdates) {
      // Items have been updated but structure is the same
      // Update displayed items to reflect the new data while preserving displayed count
      const currentDisplayCount = displayedItems.length;
      const itemsToDisplay = processedItems.slice(0, Math.min(currentDisplayCount, processedItems.length));
      setDisplayedItems(itemsToDisplay);
      setHasMore(processedItems.length > itemsToDisplay.length);
      prevProcessedItemsRef.current = processedItems;
      shouldRestoreScrollRef.current = true;
    } else {
      // Update ref even if nothing changed to track current state
      prevProcessedItemsRef.current = processedItems;
      prevSearchTermRef.current = searchTerm;
    }
  }, [processedItems, itemsPerPage, listState?.displayedItemsCount, getItemKey, displayedItems.length, searchTerm, scrollContainerId, updateListState]);

  // Restore scroll position after data is loaded and items are rendered
  useEffect(() => {
    if (displayedItems.length > 0 && listState?.scrollPosition && shouldRestoreScrollRef.current) {
      const scrollContainer = document.getElementById(scrollContainerId);
      if (scrollContainer) {
        // Use requestAnimationFrame to ensure DOM is updated, then restore scroll
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollContainer.scrollTop = listState.scrollPosition!;
            shouldRestoreScrollRef.current = false;
          });
        });
      }
    }
  }, [displayedItems, listState?.scrollPosition, scrollContainerId]);

  // Save scroll position and displayed items count
  const handleScrollPositionChange = useCallback(() => {
    if (updateListState) {
      const scrollContainer = document.getElementById(scrollContainerId);
      if (scrollContainer) {
        updateListState({
          scrollPosition: scrollContainer.scrollTop,
          displayedItemsCount: displayedItems.length
        });
      }
    }
  }, [updateListState, displayedItems.length, scrollContainerId]);

  // Add scroll event listener to save position
  useEffect(() => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer && updateListState) {
      let scrollTimeout: NodeJS.Timeout;
      const throttledScrollHandler = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          handleScrollPositionChange();
        }, 200);
      };

      scrollContainer.addEventListener('scroll', throttledScrollHandler);
      return () => {
        scrollContainer.removeEventListener('scroll', throttledScrollHandler);
        clearTimeout(scrollTimeout);
      };
    }
  }, [handleScrollPositionChange, updateListState, scrollContainerId]);

  // Error state
  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-gray-600 mb-2">Failed to load items</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <ListSkeleton />;
  }

  // Empty state
  if (processedItems.length === 0 && !isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {searchTerm ? emptySearchMessage : emptyMessage}
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          )}
        </div>
      </div>
    );
  }

  // List with infinite scroll
  return (
    <div className={className}>
      <div id={scrollContainerId} className="flex-1 overflow-auto">
        <InfiniteScroll
          dataLength={displayedItems.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2" style={{ color: text.secondary }}>
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                <span className="text-sm  ">{loadingMoreMessage}</span>
              </div>
            </div>
          }
          endMessage={
            displayedItems.length > 0 && endMessage && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">
                  <b>{endMessage.replace('{count}', displayedItems.length.toString())}</b>
                </p>
              </div>
            )
          }
          scrollableTarget={scrollContainerId}
          className={listClassName}
        >
          {displayedItems.map((item, index) => (
            <React.Fragment key={getItemKey(item)}>
              {renderItem(item, index, displayedItems)}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default BaseListComponent;

