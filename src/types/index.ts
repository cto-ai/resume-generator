export interface UserInfo {
  userFullName: string;
  userEmail: string;
  githubUserName: string;
}
export interface RepoConfig {
  github: any;
  projectName: string;
}

export interface GlobalGitConfig {
  projectName: string;
  githubUserName: string;
  userEmail: string;
}

export interface SocialMedia {
  twitter: string;
  linkedin: string;
}

export interface AppConfig {
  projectName: string;
  repoFullName: string;
  userFullName: string;
  githubUserName: string;
  userEmail: string;
  repoUrl: string;
  token: string;
  isUserSite: boolean;
  socialMedia: SocialMedia;
}

export interface WorkflowStatusCheckConfig {
  github: any;
  githubUserName: string;
  projectName: string;
  appUrl: string;
  repoUrl: string;
}
