module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'chore', 'docs', 'perf', 'test', 'ci', 'build', 'revert'],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [2, 'never'], // Scope is required
    'scope-min-length': [2, 'always', 2], // Minimum length for scope
    'scope-max-length': [2, 'always', 20], // Maximum length for scope
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
