import { getUncachableGitHubClient } from '../server/github';
import { execSync } from 'child_process';

async function getAccessTokenForPush() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken!
      }
    }
  );
  const data = await response.json();
  const connectionSettings = data.items?.[0];
  return connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
}

async function pushToGitHub() {
  const repoName = 'chromakit';
  
  try {
    console.log('Getting GitHub client...');
    const octokit = await getUncachableGitHubClient();
    
    console.log('Getting authenticated user...');
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    const token = await getAccessTokenForPush();
    
    try {
      execSync('git remote remove github', { stdio: 'pipe' });
    } catch (e) {
    }
    
    execSync(`git remote add github https://${user.login}:${token}@github.com/${user.login}/${repoName}.git`, { stdio: 'inherit' });
    
    console.log('Pushing to GitHub...');
    execSync('git push -u github main --force', { stdio: 'inherit' });
    
    console.log(`\nSuccess! Your code has been pushed to: https://github.com/${user.login}/${repoName}`);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

pushToGitHub();
