import { UserDomain } from "@/entities/user/index";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function UsersClient({ users }: { users: UserDomain.UserEntity[] }) {
  return (
    <div>
      Users
      <div className="grid grid-cols-3 gap-6">
        {users.map((user) => {
          return (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardDescription>{user.id}</CardDescription>
              <CardFooter>{user.email}</CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
