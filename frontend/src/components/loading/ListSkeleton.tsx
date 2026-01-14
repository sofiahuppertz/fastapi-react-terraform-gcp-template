import React from 'react';
import { palettes } from '@/theme/irisGarden';

interface ListSkeletonProps {
  columns?: 1 | 2;
  count?: number;
}

const ListSkeleton: React.FC<ListSkeletonProps> = ({ columns = 1, count = 8 }) => {
  const gridClass = columns === 2 ? 'grid grid-cols-2 gap-2' : '';
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className={`px-4 pt-4 pb-8 ${gridClass}`}>
          {Array.from({ length: count }).map((_, index) => (
            <div 
              key={index} 
              className="rounded-full shadow-sm border mb-2 p-4"
              style={{ 
                backgroundColor: 'white',
                borderColor: palettes.grey.grey0 + '50'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Molecule name skeleton */}
                    <div 
                      className="h-5 rounded-full shimmer" 
                      style={{ 
                        width: '180px',
                        backgroundColor: palettes.grey.grey0
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center space-x-6 flex-shrink-0 pr-12">
                    {/* Percentage skeleton */}
                    <div className="flex items-center space-x-2 w-20 justify-center">
                      <div 
                        className="h-4 w-4 rounded-full shimmer"
                        style={{ backgroundColor: palettes.grey.grey1 }}
                      ></div>
                      <div 
                        className="h-4 w-12 rounded-full shimmer"
                        style={{ backgroundColor: palettes.grey.grey0 }}
                      ></div>
                    </div>
                    {/* Retention time skeleton */}
                    <div className="flex items-center space-x-1 w-16 justify-center">
                      <div 
                        className="h-3 w-3 rounded-full shimmer"
                        style={{ backgroundColor: palettes.grey.grey1 }}
                      ></div>
                      <div 
                        className="h-4 w-8 rounded-full shimmer"
                        style={{ backgroundColor: palettes.grey.grey0 }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Action button skeleton */}
                  <div 
                    className="w-8 h-8 rounded-full shimmer"
                    style={{ backgroundColor: palettes.grey.grey1 }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListSkeleton;
