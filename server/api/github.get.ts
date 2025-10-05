export default defineEventHandler(async () => {
  const GITHUB_USERNAME = 'HelenoSalgado';
  const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

  try {
    const repos = await $fetch(API_URL);

    // Filtra e mapeia apenas os dados que precisamos
    const projects = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
    }));

    return projects;
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    // Retorna um array vazio ou lança um erro, dependendo de como você quer tratar a falha
    return [];
  }
});
