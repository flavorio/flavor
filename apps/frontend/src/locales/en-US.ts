export default {
  actions: {
    collapseSidebar: "Collapse sidebar",
    backToHome: "Back To Home",
  },
  auth: {
    forgotPassword: "Forgotten password?",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    signInWithGoogle: "Sign in with Google",
    signInWithGithub: "Sign in with Github",
    signInWithTwitter: "Sign in with Twitter",
    signInWithFacebook: "Sign in with Facebook",
    redirectToSignInDesc: "Already have an account? Sign in",
    redirectToSignUpDesc: "Don't have an account? Sign up.",
  },
  user: {
    email: "Email",
    password: "Password",
  },
  space: {
    space: "Space",
    spaceMembers: "Space members",
    invite: {
      title: "{{spaceName}} space sharing",
      desc: "This space has {count, plural, =0 {no spaceMembers} one {# collaborator} other {# spaceMembers}}. Adding a space collaborator will give them access to all bases within this space.",
      tabEmail: "Invite by email",
      emailPlaceholder: "Invite more space spaceMembers via email",
      tabLink: "Invite by link",
      linkPlaceholder:
        "Create an invite link that grants the following access to anyone who opens it: ",
      emailSend: "Send invite",
      linkSend: "Create link",
      spaceTitle: "Space spaceMembers",
      collaboratorSearchPlaceholder:
        "Find a space collaborator by name or email",
      collaboratorJoin: "joined {joinTime}",
      collaboratorRemove: "Remove collaborator",
      linkTitle: "Invite links",
      linkCreatedTime: "created {createdTime}",
      linkCopySuccess: "Link copied",
      linkRemove: "Remove link",
    },
    spaceRole: {
      role: {
        owner: "Owner",
        creator: "Creator",
        editor: "Editor",
        commenter: "Commenter",
        viewer: "Viewer",
      },
      description: {
        owner:
          "Can fully configure and edit bases, and manage space settings and billing",
        creator: "Can fully configure and edit bases",
        editor:
          "Can edit records and views, but cannot configure tables or fields",
        commenter: "Can comment on records",
        viewer: "Cannot edit or comment",
      },
    },
  },
  doc: {
    createANewDoc: "Create a new document",
    rename: "Rename",
  },
};
