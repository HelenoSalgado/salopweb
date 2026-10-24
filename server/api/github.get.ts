interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

export interface ProjectRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
}

export default defineEventHandler(async (): Promise<ProjectRepo[]> => {
  const GITHUB_USERNAME = 'HelenoSalgado';
  const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

  try {
    const repos = await $fetch<GitHubApiRepo[]>(API_URL);

    // Filtra repositórios de sistema e mapeia os dados necessários
    const projects: ProjectRepo[] = repos
      .filter((repo) => repo.name !== '.github' && !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
      }));

    return projects;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
});
