import TopicProgress from '../TopicProgress';

export default function TopicProgressExample() {
  return (
    <div className="p-6 max-w-md space-y-4">
      <TopicProgress
        topic="React Hooks"
        progress={75}
        sessions={8}
        status="learning"
      />
      <TopicProgress
        topic="TypeScript Generics"
        progress={45}
        sessions={5}
        status="struggling"
      />
      <TopicProgress
        topic="CSS Grid Layout"
        progress={95}
        sessions={12}
        status="mastered"
      />
    </div>
  );
}
