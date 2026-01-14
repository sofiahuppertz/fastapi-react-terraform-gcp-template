import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { PaginationState } from '../../types/library';
import { palettes, text } from '@/theme/colors';
import { IconButton } from '../base/IconButton';

interface PaginationControlsProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ pagination, onPageChange }) => {
  const { page, totalPages, hasPrev, hasNext, total } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    console.log('Not showing pagination controls because totalPages <= 1');
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-1 p-4 px-6 rounded-full shadow-sm"
    style={{
      backgroundColor: palettes.neutral[0] + '50',
    }}
    >
      <div className="flex items-center text-sm" style={{ color: text.subtle }}>
        <span>
          Showing {Math.min((page - 1) * pagination.limit + 1, total)} to{' '}
          {Math.min(page * pagination.limit, total)} of {total} results
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <IconButton
          icon={faChevronLeft}
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          variant="ghost"
        />
        
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center shadow-sm ${pageNum === page ? 'cursor-not-allowed' : ''}`}
            style={{
              backgroundColor: pageNum === page ? palettes.secondary[2] : palettes.neutral[1] + '20',
              color: pageNum === page ? 'white' : palettes.secondary[2]
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = palettes.secondary[2];
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = pageNum === page ? palettes.secondary[2] : palettes.neutral[1] + '20';
              e.currentTarget.style.color = pageNum === page ? 'white' : palettes.secondary[2];
            }}
          >
            {pageNum}
          </button>
        ))}
        
        
        <IconButton
          icon={faChevronRight}
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          variant="ghost"
        />
      </div>
    </div>
  );
};

export default PaginationControls; 