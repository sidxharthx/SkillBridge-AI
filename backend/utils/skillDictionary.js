/**
 * Comprehensive skill dictionary with aliases and categories.
 * Used for rule-based skill extraction and normalization.
 */
const SKILL_DICTIONARY = {
  frontend: {
    'react': ['reactjs', 'react.js', 'react js'],
    'angular': ['angularjs', 'angular.js', 'angular js'],
    'vue': ['vuejs', 'vue.js', 'vue js'],
    'next.js': ['nextjs', 'next js', 'next.js'],
    'nuxt.js': ['nuxtjs', 'nuxt'],
    'svelte': ['sveltejs', 'sveltekit'],
    'html': ['html5', 'html 5'],
    'css': ['css3', 'css 3', 'cascading style sheets'],
    'sass': ['scss'],
    'less': [],
    'tailwind': ['tailwindcss', 'tailwind css'],
    'bootstrap': ['bootstrap 5', 'bootstrap5'],
    'material ui': ['mui', 'material-ui'],
    'jquery': [],
    'webpack': [],
    'vite': [],
    'typescript': ['ts'],
    'javascript': ['js', 'es6', 'es2015', 'ecmascript'],
    'redux': ['redux toolkit', 'rtk'],
    'zustand': [],
    'responsive design': ['responsive web design', 'rwd'],
    'pwa': ['progressive web app'],
    'web components': [],
    'storybook': [],
    'figma': [],
    'framer motion': [],
  },
  backend: {
    'node.js': ['nodejs', 'node js', 'node'],
    'express': ['expressjs', 'express.js'],
    'django': ['django rest framework', 'drf'],
    'flask': [],
    'fastapi': ['fast api'],
    'spring boot': ['spring', 'spring framework'],
    'ruby on rails': ['rails', 'ror'],
    'asp.net': ['asp.net core', '.net core', '.net'],
    'laravel': [],
    'koa': ['koa.js'],
    'nestjs': ['nest.js', 'nest js'],
    'graphql': [],
    'rest api': ['restful api', 'rest', 'restful'],
    'grpc': [],
    'microservices': ['micro services'],
    'websocket': ['websockets', 'socket.io', 'ws'],
    'rabbitmq': ['rabbit mq'],
    'kafka': ['apache kafka'],
    'redis': [],
    'nginx': [],
    'apache': [],
  },
  database: {
    'mongodb': ['mongo', 'mongoose'],
    'postgresql': ['postgres', 'psql', 'pg'],
    'mysql': ['my sql'],
    'sqlite': [],
    'oracle': ['oracle db'],
    'sql server': ['mssql', 'ms sql'],
    'dynamodb': ['dynamo db'],
    'cassandra': ['apache cassandra'],
    'firebase': ['firestore', 'firebase realtime'],
    'supabase': [],
    'prisma': [],
    'sequelize': [],
    'typeorm': [],
    'sql': ['structured query language'],
    'nosql': ['no sql'],
    'elasticsearch': ['elastic search', 'es'],
  },
  tools: {
    'git': ['github', 'gitlab', 'bitbucket'],
    'docker': ['dockerfile', 'docker compose'],
    'kubernetes': ['k8s'],
    'jenkins': [],
    'github actions': ['gh actions'],
    'ci/cd': ['cicd', 'continuous integration', 'continuous deployment'],
    'terraform': [],
    'ansible': [],
    'jira': [],
    'confluence': [],
    'slack': [],
    'postman': [],
    'swagger': ['openapi'],
    'vs code': ['vscode', 'visual studio code'],
    'linux': ['unix', 'bash', 'shell scripting'],
    'npm': ['yarn', 'pnpm'],
    'webpack': [],
    'babel': [],
    'eslint': [],
    'prettier': [],
    'jest': [],
    'mocha': [],
    'cypress': [],
    'selenium': [],
    'playwright': [],
  },
  cloud: {
    'aws': ['amazon web services', 'amazon aws'],
    'azure': ['microsoft azure'],
    'gcp': ['google cloud', 'google cloud platform'],
    'heroku': [],
    'vercel': [],
    'netlify': [],
    'digitalocean': ['digital ocean'],
    'cloudflare': [],
    's3': ['aws s3', 'amazon s3'],
    'ec2': ['aws ec2'],
    'lambda': ['aws lambda', 'serverless'],
    'cloudfront': [],
    'route 53': [],
    'iam': [],
  },
  languages: {
    'python': ['python3', 'py'],
    'java': [],
    'c++': ['cpp', 'c plus plus'],
    'c#': ['csharp', 'c sharp'],
    'c': [],
    'go': ['golang'],
    'rust': [],
    'kotlin': [],
    'swift': [],
    'php': [],
    'ruby': [],
    'r': ['r programming'],
    'scala': [],
    'dart': [],
    'perl': [],
    'matlab': [],
    'solidity': [],
  },
  softSkills: {
    'communication': ['written communication', 'verbal communication'],
    'leadership': ['team leadership', 'people management'],
    'teamwork': ['team player', 'collaboration', 'cross-functional'],
    'problem solving': ['problem-solving', 'analytical thinking', 'critical thinking'],
    'time management': ['deadline management'],
    'agile': ['scrum', 'kanban', 'agile methodology'],
    'project management': ['pm', 'project planning'],
    'mentoring': ['coaching', 'training'],
    'presentation': ['public speaking'],
    'stakeholder management': ['client management'],
  },
};

/**
 * Build a reverse lookup map: alias -> { canonical, category }
 */
function buildReverseLookup() {
  const map = new Map();
  for (const [category, skills] of Object.entries(SKILL_DICTIONARY)) {
    for (const [canonical, aliases] of Object.entries(skills)) {
      map.set(canonical.toLowerCase(), { canonical, category });
      for (const alias of aliases) {
        map.set(alias.toLowerCase(), { canonical, category });
      }
    }
  }
  return map;
}

const REVERSE_LOOKUP = buildReverseLookup();

module.exports = { SKILL_DICTIONARY, REVERSE_LOOKUP };
