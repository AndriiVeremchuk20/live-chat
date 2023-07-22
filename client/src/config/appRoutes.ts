const routes = {
	home: "/",
	auth :{
		login: "/auth/login",
		registrations: "/auth/registrations"
	},
	profile: {
		profile: "/profile/",
		userProofile: (id: string) => `/profile/${id}`,
		completeProfile: "/profile/complete-profile"
	},
	info: {
		verifyemail: "/info/verify-email",
	},
	help: {
		forgotPassword: "/help/forgotPassword",
		resetPassword: "/help/resetPassword",
	}

}

export default routes
