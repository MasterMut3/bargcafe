const GITHUB_API = "https://api.github.com";

const OWNER = "MasterMut3";
const REPO = "bargcafe";
const BRANCH = "main";

async function githubRequest(env, path, options = {}) {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "bargcafe-worker",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `GitHub returned non-JSON response (${response.status}): ${text.slice(0, 200)}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `GitHub API request failed: ${response.status}`
    );
  }

  return data;
}

export async function getRepositoryFile(env, path) {
  return githubRequest(
    env,
    `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`
  );
}