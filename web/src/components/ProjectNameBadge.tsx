/** Blue label for Erasmus+ / program name on article views */
export function ProjectNameBadge({ name }: { name?: string | null }) {
  if (!name?.trim()) return null;
  return (
    <div className="mb-4">
      <span className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
        {name.trim()}
      </span>
    </div>
  );
}
