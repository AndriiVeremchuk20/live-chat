import routes from "@/config/appRoutes";
import Link from "next/link";

const Header = () => {
return <div className="flex h-[100px] justify-between items-center">
	<div className="text-3xl mx-4">100 messages</div>
	<div className="mx-3 text-xl">
		<Link href={routes.auth.login} className="text-blue-600 underline hover:text-blue-300">Login</Link> 
		<span className="mx-1">or</span>
		<Link href={routes.auth.registrations} className="text-blue-600 underline hover:text-blue-300">Registration</Link>
	</div>
</div>
}

export default Header;
