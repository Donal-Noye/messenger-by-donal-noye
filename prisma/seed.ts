import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
	const users = await Promise.all([
		prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com' } }),
		prisma.user.create({ data: { name: 'Bob', email: 'bob@example.com' } }),
		prisma.user.create({ data: { name: 'Charlie', email: 'charlie@example.com' } }),
		prisma.user.create({ data: { name: 'David', email: 'david@example.com' } }),
		prisma.user.create({ data: { name: 'Eve', email: 'eve@example.com' } }),
	])

	console.log('Created users:', users)

	// Create groups
	const groups = await Promise.all([
		prisma.group.create({ data: { name: 'General Chat' } }),
		prisma.group.create({ data: { name: 'Tech Talk' } }),
		prisma.group.create({ data: { name: 'Book Club' } }),
	])

	console.log('Created groups:', groups)

	// Add users to groups
	for (const group of groups) {
		// Randomly select 3-5 users for each group
		const groupUsers = users
			.sort(() => 0.5 - Math.random())
			.slice(0, Math.floor(Math.random() * 3) + 3)

		await Promise.all(
			groupUsers.map((user) =>
				prisma.groupMember.create({
					data: {
						userId: user.id,
						groupId: group.id,
					},
				})
			)
		)

		console.log(`Added users to group ${group.name}:`, groupUsers.map((u) => u.name))
	}

	// Create messages
	const messages = [
		"Hello everyone!",
		"How's it going?",
		"What's new?",
		"Any interesting plans for the weekend?",
		"Has anyone read any good books lately?",
	]

	for (const group of groups) {
		const groupMembers = await prisma.groupMember.findMany({
			where: { groupId: group.id },
			include: { user: true },
		})

		await Promise.all(
			messages.map((content) => {
				const randomUser = groupMembers[Math.floor(Math.random() * groupMembers.length)].user
				return prisma.message.create({
					data: {
						content,
						userId: randomUser.id,
						groupId: group.id,
					},
				})
			})
		)

		console.log(`Created messages in group ${group.name}`)
	}
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})