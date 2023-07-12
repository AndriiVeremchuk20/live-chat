import Image from "next/image";
import {BiSolidUserCircle} from "react-icons/bi";

type ImageType={
	src:string;
	alt: string;
}

interface propUserAvatar {
	image?: ImageType;
	size:number;
}

const UserAvatar:React.FC<propUserAvatar> = ({image, size}) => {
	
	if(image){
	return <div className="border border-violet-900 bg-violet-300 rounded-full m-1 p-1">
		<Image width={size} height={size} src={image.src} alt={image.alt} className="rounded-full"/>
	</div>}

	return <div className="border border-violet-900 rounded-full">
		<BiSolidUserCircle size={size}/>
	</div>
}

export default UserAvatar;
