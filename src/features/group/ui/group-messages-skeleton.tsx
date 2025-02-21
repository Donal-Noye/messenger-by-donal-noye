import {Skeleton} from "@/shared/ui/skeleton";

export function GroupMessagesSkeleton() {
	return (
		<>
			<div className="flex flex-col items-start space-y-2">
				<Skeleton className="w-48 h-10 rounded-lg"/>
				<Skeleton className="w-32 h-10 rounded-lg"/>
			</div>
			<div className="flex flex-col items-end space-y-2">
				<Skeleton className="w-36 h-10 rounded-lg"/>
				<Skeleton className="w-64 h-10 rounded-lg"/>
			</div>
			<div className="flex flex-col items-start space-y-2">
				<Skeleton className="w-40 h-10 rounded-lg"/>
				<Skeleton className="w-24 h-10 rounded-lg"/>
				<Skeleton className="w-96 h-12 rounded-lg"/>
			</div>
			<div className="flex flex-col items-end space-y-2">
				<Skeleton className="w-28 h-10 rounded-lg"/>
				<Skeleton className="w-44 h-10 rounded-lg"/>
			</div>
		</>
	)
}