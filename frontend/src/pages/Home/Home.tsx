import Breadcrumb from '../../components/controls/Breadcrumb';
import { text } from '@/theme/colors';

export function Home() {
  return (
    <div className="h-full flex flex-col">
      {/* Header with Breadcrumb */}
      <div className="flex-shrink-0">
        <Breadcrumb
          items={[
            {
              label: 'Home',
              fontWeight: 'medium',
              color: text.primary
            }
          ]}
        />
      </div>

      {/* Empty content area */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Welcome to your dashboard</p>
      </div>
    </div>
  );
}
