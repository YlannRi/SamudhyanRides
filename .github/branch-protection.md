# Branch Protection

GitHub branch protection is not stored in this repository by default, so it must be configured in the repository settings.

## Recommended rules

Apply the same rule to `main` and `develop`.

- Require a pull request before merging
- Require at least 1 approval
- Dismiss stale pull request approvals when new commits are pushed
- Require conversation resolution before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict direct pushes to protected branches
- Do not allow force pushes
- Do not allow branch deletion

## Required status checks

Use these workflow job names as required checks:

- `database`
- `backend`
- `frontend`
- `frontend-e2e`

## Coverage gates enforced by CI

- Backend coverage: `pytest --cov-fail-under=90`
- Frontend coverage thresholds:
  - Statements: `90%`
  - Branches: `80%`
  - Functions: `90%`
  - Lines: `95%`

## Where to configure it

In GitHub:

1. Open `Settings`
2. Open `Branches` or `Rules`
3. Create a rule or ruleset for `main`
4. Repeat for `develop`
5. Add the required status checks listed above
