import RecommendationCard from '../RecommendationCard';

export default function RecommendationCardExample() {
  return (
    <div className="p-6 max-w-2xl">
      <RecommendationCard
        title="Understanding JWT Token Security Best Practices"
        description="Comprehensive guide covering secure token storage, refresh token rotation, and common security pitfalls in JWT implementation."
        resourceUrl="https://example.com/jwt-security"
        resourceType="documentation"
        difficulty="Intermediate"
        estimatedTime="15 min read"
        topics={["JWT", "Security", "Authentication"]}
        reason="You're working on JWT implementation in auth-service.ts. This resource addresses secure token handling patterns."
      />
    </div>
  );
}
