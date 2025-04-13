import { Input } from "@/shared/ui/input";
import { SearchIcon } from "lucide-react";

export function SearchGroup({
  onSearchTerm,
}: {
  onSearchTerm: (value: string) => void;
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
      <Input
        onChange={(e) => onSearchTerm(e.target.value)}
        className="h-14 pl-14 placeholder:text-primary/50"
        type="text"
        placeholder="Search here..."
      />
    </div>
  );
}
