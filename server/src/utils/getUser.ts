import prisma from "../../prisma"

const isUser = async({id}: {id: string})=>{
	const mbUser = await prisma.user.findFirst({where: {id}});

	return mbUser; 
}
