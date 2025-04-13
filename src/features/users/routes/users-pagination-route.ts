import { NextResponse } from "next/server";
import { getAllUsers } from "@/entities/user/server";

export async function usersPaginationRoute(request: Request) {
	const { searchParams } = new URL(request.url);

	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 20;
	const searchTerm = searchParams.get("searchTerm") || "";

	const users = await getAllUsers({ page, limit, searchTerm });

	return NextResponse.json(users);
}