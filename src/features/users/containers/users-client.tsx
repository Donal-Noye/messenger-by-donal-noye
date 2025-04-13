"use client";

import {UserDomain} from "@/entities/user/index";
import { UserCard } from "@/features/users/ui/user-card";
import { SearchUsers } from "@/features/users/containers/search-users";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDebounce } from "use-debounce";

export function UsersClient({
  users: initialUsers,
}: {
  users: UserDomain.UserEntity[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const loadUsers = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/users/api/?page=${currentPage}&limit=20&searchTerm=${encodeURIComponent(search)}`,
      );
      const newUsers = await response.json();

      setUsers((prev) =>
        currentPage === 1 ? newUsers : [...prev, ...newUsers],
      );
      setHasMore(newUsers.length === 20);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadUsers(1, deferredSearchTerm);
  }, [deferredSearchTerm, loadUsers]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage((prev) => {
        const nextPage = prev + 1;
        loadUsers(nextPage, debouncedSearchTerm);
        return nextPage;
      });
    }
  }, [inView, hasMore, isLoading, searchTerm, loadUsers, debouncedSearchTerm]);



  const userList = useMemo(
    () => users.map((user) => <UserCard key={user.id} user={user} />),
    [users],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="py-6 px-8 border-b-2 border-b-primary/30">
        <h1 className="scroll-m-20 text-xl font-medium tracking-tight sm:text-3xl">
          Users
        </h1>
      </div>
      <div className="px-6 pt-4">
        <SearchUsers onSearchTerm={setSearchTerm} />
      </div>
      <ScrollArea className="h-full overflow-auto flex-1">
        <div
          ref={ref}
          className="py-6 px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? <Skeletons /> : userList}
        </div>
      </ScrollArea>
    </div>
  );
}

const Skeletons = () =>
  Array(3)
    .fill(0)
    .map((_, i) => (
      <Skeleton key={i} className="h-[240px] w-full will-change-transform" />
    ));