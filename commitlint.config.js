module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'chore', 'docs', 'perf', 'test', 'ci', 'build', 'revert'],
    ],
    'scope-case': [0], // Allow any case and special characters (e.g., docs/#20)
    'scope-empty': [2, 'never'], // Scope is required
    'scope-min-length': [2, 'always', 2], // Minimum length for scope
    'scope-max-length': [2, 'always', 30], // Increased to allow scope like docs/#20
    'subject-case': [0], // Allow any case and non-English characters (e.g., 한글)
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
