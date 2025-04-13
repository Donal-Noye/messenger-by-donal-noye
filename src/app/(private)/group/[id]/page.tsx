import { Group } from "@/features/group/server";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-background h-full sm:rounded-3xl overflow-hidden relative z-[100]">
      <Group groupId={id} />
    </div>
  );
}
