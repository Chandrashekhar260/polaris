import StatCard from '../StatCard';
import { Brain } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 max-w-xs">
      <StatCard
        title="Topics Learned"
        value={12}
        icon={Brain}
        description="This week"
      />
    </div>
  );
}
