import {prisma} from "@/shared/lib/db";
import {Card, CardContent, CardTitle} from "@/shared/ui/card";

export default async function Home() {
  const users = await prisma.user.findMany();

  if (!users) {
    return <div>No Users</div>
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {users.map((user) => (
        <Card key={user.id}>
          <CardTitle>{user.name}</CardTitle>
          <CardContent>{user.email}</CardContent>
        </Card>
      ))}
    </div>
  );
}
