import prisma from "../../prisma"

const getUser = async({id}: {id: string})=>{
	const mbUser = await prisma.user.findFirst({where: {id}});

	return mbUser; 
}

export default getUser;
