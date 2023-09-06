const AppRoutes = {
  home: "/",
  auth: {
    login: "/auth/login",
    registrations: "/auth/registrations",
  },
  profile: {
    profile: "/profile/",
    userProfile: (id: string) => `/profile/${id}`,
    completeProfile: "/profile/complete-profile",
  },
  info: {
    verifyemail: "/info/verify-email",
  },
  help: {
    forgotPassword: "/help/forgotPassword",
    resetPassword: "/help/resetPassword",
  },
  chat: {
    base: "/chat",
    toChat: (id: string) => `/chat/${id}`,
  },
  post: {
    add: "/post/add",
    getPostLikes: (post_id: string) => `/post/like/${post_id}`,
  },
};

export default AppRoutes;
