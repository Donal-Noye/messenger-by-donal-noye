export function searchItems<T>(items: T[], searchTerm: string, fieldPath: string): T[] {
	const lowerSearchTerm = searchTerm.toLowerCase();

	return items.filter((item) => {
		const fields = fieldPath.split(".");

		let value: any = item;
		for (const field of fields) {
			value = value?.[field];
			if (value === undefined) return false;
		}

		return value?.toString().toLowerCase().includes(lowerSearchTerm);
	});
}