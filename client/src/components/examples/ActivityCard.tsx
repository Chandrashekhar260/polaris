import ActivityCard from '../ActivityCard';

export default function ActivityCardExample() {
  return (
    <div className="p-6 max-w-md">
      <ActivityCard
        filename="auth-service.ts"
        filepath="src/services/auth-service.ts"
        topics={["TypeScript", "Authentication", "JWT"]}
        summary="Implementing JWT token validation and refresh logic for user authentication flow"
        timestamp={new Date(Date.now() - 1000 * 60 * 15)}
      />
    </div>
  );
}
