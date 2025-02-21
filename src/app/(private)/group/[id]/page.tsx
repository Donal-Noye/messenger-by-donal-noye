import { Group } from "@/features/group/server";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-background h-full rounded-3xl z-10 overflow-hidden relative">
      <Group groupId={id} />
    </div>
  );
}
