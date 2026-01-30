# Build - Junior Dev Workflow

Implement a full junior developer workflow following a TDD-first approach. This command automates the complete issue-to-PR workflow with test-first development, frequent commits, and thorough validation.

## Prerequisites

Before running this command, ensure:

- **GitHub CLI** (`gh`) is installed and authenticated: `gh auth status`
- **Git** is configured with user name and email: `git config user.name` and `git config user.email`
- **Node.js** is installed: `node --version`
- **Repository access**: You have write access to the repository
- **Clean state**: Current working directory is clean or changes are stashed/committed

## Configuration

Default configuration (automatically detected or uses these defaults):

- **Repository**: Detected from `git remote get-url origin` or defaults to `easyplantlife/easyplantlife.com`
- **Main branch**: `main`
- **Max validation attempts**: 5

## Usage

```bash
# Full workflow - pick next available issue
/build

# Work on specific issue (skip milestone/issue selection)
/build --issue <issue-number>

# Or run phases individually for more control:
/build --select-issue    # Phase 1: Issue selection only
/build --setup           # Phase 2: Issue setup (assign + branch)
/build --develop         # Phase 3: Development work
/build --validate        # Phase 4: Run validation and fixes
/build --pr              # Phase 5: Create pull request
```

## Steps

### Phase 0: Initial Setup (Always run first)

1. **Detect repository configuration**
   - Get repository from git remote: `git remote get-url origin | sed 's/.*[:/]//;s/.git$//'`
   - Expected format: `owner/repo` (e.g., `easyplantlife/easyplantlife.com`)
   - If detection fails, use default: `easyplantlife/easyplantlife.com`
   - Verify authentication: `gh auth status`
   - Verify git author configuration

### Phase 1: Issue Selection (Skip if `--issue` parameter provided)

2. **Query and select milestone**
   - Use `gh api "repos/<repo>/milestones?state=open&sort=title&direction=asc"` to fetch open milestones
   - Display milestones with their open/closed issue counts
   - Milestones follow pattern: M1 → M2 → M3 → ... → M11 (see SPECS.md)
   - Select the first milestone with open issues
   - If no milestones exist, proceed with all open issues

3. **Query open issues from selected milestone**
   - Use `gh issue list --repo <repo> --state open --assignee "" --milestone "<milestone>" --json number,title,labels,milestone`
   - Sort issues by:
     1. Priority label (`priority:critical` > `priority:high` > `priority:medium` > `priority:low`)
     2. Issue number (lower first, as earlier tasks often set up context)
   - Select the first issue from the sorted list

4. **Query full issue details**
   - Use `gh issue view <issue-number> --repo <repo> --json body,title,labels,assignees,milestone`
   - Store issue number, title, body, labels, and milestone for later use
   - Review acceptance criteria from issue body

### Phase 2: Issue Setup

5. **Assign yourself to the issue**
   - Use `gh issue edit <issue-number> --repo <repo> --add-assignee "@me"`
   - Verify assignment was successful

6. **Create branch for the issue**
   - Ensure main branch is up to date: `git checkout main && git pull origin main`
   - Generate branch name: `issue-<issue-number>-<sanitized-title>`
     - Sanitize title: lowercase, replace non-alphanumeric with hyphens, limit to 50 chars
     - Example: "M1-01: Initialize Next.js Project" → `issue-1-m1-01-initialize-nextjs-project`
   - Check if branch exists locally or remotely
   - If new: `git checkout -b <branch-name>` from main branch

7. **Push branch and link to issue**
   - Push branch: `git push -u origin <branch-name>`
   - Add comment to issue: `gh issue comment <issue-number> --repo <repo> --body "🔗 Branch created: \`<branch-name>\`\n\nWorking on this issue."`

### Phase 3: Development (Test-First Approach)

8. **Work on the issue with TDD mentality**
   - Read issue details carefully to understand requirements
   - Review acceptance criteria and test cases from issue body
   - **For code changes:**
     - Write tests first (before implementation)
     - Ensure tests cover all acceptance criteria from the issue
     - Run tests to confirm they fail (red phase)
   - **Implementation approach:**
     - Implement code to make tests pass (green phase)
     - Refactor while keeping tests green
   - **Commit frequently:**
     - Commit after each logical unit of work
     - Use descriptive commit messages: `feat: <description>`, `fix: <description>`, `test: <description>`
     - Examples:
       - `test: add tests for Button component variants`
       - `feat: implement Button component`
       - `fix: handle disabled state in Button`
   - **Push semi-frequently:**
     - Push every 3-5 commits or after completing a significant feature
   - Follow project conventions from `CLAUDE.md`
   - Reference the issue in commit messages when relevant

### Phase 4: Validation and Fixes

9. **Run validation scripts**
   - Check `package.json` for available scripts
   - Run in order:
     1. **Lint**: `npm run lint`
     2. **Type-check**: `npm run typecheck` (if available)
     3. **Tests**: `npm test`
     4. **Build**: `npm run build`
   - Capture all error output for fixing

10. **Fix validation errors (mandatory)**
    - **CRITICAL RULES:**
      - Do NOT skip, comment out, or remove tests
      - Do NOT ignore errors or warnings
      - Fix ALL errors before proceeding
    - Analyze error messages carefully
    - Fix issues systematically:
      - Fix linting errors (formatting, unused imports, etc.)
      - Fix type errors (add proper types, fix type mismatches)
      - Fix test failures (update implementation or tests as needed)
      - Ensure build succeeds
    - After fixes, commit with message: `fix: resolve lint/typecheck/test errors`
    - Re-run validation scripts to confirm fixes
    - Repeat until all validations pass (max 5 attempts)

11. **Final push**
    - Stage any remaining changes: `git add -A`
    - Commit final changes if needed
    - Push all commits: `git push origin <branch-name>`

12. **Review and update CI/CD workflows (if needed)**
    - Check if `.github/workflows/` directory exists
    - Analyze changes made in this branch
    - Determine if CI/CD workflows need updates
    - Focus on test, lint, build, and type-check workflows
    - Be conservative: only modify workflows if directly relevant

13. **Review and update documentation (if needed)**
    - Review `README.md`, `CLAUDE.md`
    - Update documentation to reflect new features or changes
    - Be conservative: only update what's directly affected

### Phase 5: Pull Request

14. **Create pull request**
    - Check if PR already exists: `gh pr list --repo <repo> --head <branch-name> --json number`
    - If exists, use existing PR
    - If not, create PR:
      - Title: Use issue title
      - Body template:

        ```markdown
        ## Summary

        Resolves #<issue-number>

        ## Changes

        <Brief description of what was implemented>

        ## Checklist

        - [ ] Tests written and passing
        - [ ] Linting passes (`npm run lint`)
        - [ ] Type checking passes (if applicable)
        - [ ] Build succeeds (`npm run build`)
        - [ ] Acceptance criteria from issue met
        - [ ] Accessibility considered

        ---

        🤖 Generated with Claude Code
        ```

      - Base: `main`
      - Head: `<branch-name>`

    - Link PR to issue: `gh issue comment <issue-number> --repo <repo> --body "🚀 Pull request created: <pr-url>"`

## Troubleshooting

### Common Issues and Solutions

**GitHub CLI not authenticated**
- Run `gh auth login` and follow the prompts
- Verify with `gh auth status`

**Permission denied on repository**
- Ensure you have write access to the repository
- Check with repository owner if you need to be added as collaborator

**Validation fails repeatedly (5+ attempts)**
- The command will stop and report the issue
- Review errors manually: `npm run lint`, `npm test`
- Fix issues locally and commit
- Resume with `/build --validate`

**Resume interrupted workflow**
- If on an issue branch (`issue-<N>-*`), the command automatically detects it
- Check current branch: `git branch --show-current`
- Resume from appropriate phase based on current state

**Git conflicts or dirty working directory**
- Stash changes: `git stash`
- Or commit current work: `git add -A && git commit -m "WIP: <description>"`
- Then re-run the command

## Notes

- **TDD-first development**: Write tests before implementation. Review acceptance criteria and test cases in issue body.
- **Frequent commits**: Commit after each logical unit of work for clear history.
- **Semi-frequent pushes**: Push every 3-5 commits to backup work.
- **Never skip tests**: Do not comment out or skip tests. Fix underlying issues instead.
- **Error handling**: If validation fails after 5 attempts, report and request manual intervention.
- **Branch naming**: Follow pattern `issue-<number>-<sanitized-title>`.
- **Commit messages**: Use conventional commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`).
- **Accessibility**: All UI components must be keyboard navigable with proper ARIA.
- **Brand compliance**: UI must be calm, minimal, with strong white space per brand guidelines.

## Example Workflow

```bash
# Full workflow - pick next issue from current milestone
/build

# Work on specific issue
/build --issue 42

# During development, commits might look like:
# git commit -m "test: add tests for newsletter form validation"
# git commit -m "feat: implement newsletter form component"
# git commit -m "fix: handle email validation edge cases"
# git push origin issue-42-newsletter-form-component

# After validation passes:
# git commit -m "fix: resolve lint errors"
# git push origin issue-42-newsletter-form-component

# Create PR:
# gh pr create --title "M8-04: Create Newsletter Signup Form Component" \
#   --body "## Summary\n\nResolves #42\n\n..." \
#   --base main --head issue-42-newsletter-form-component
```

## Integration with Merge Command

This command complements the `/merge` command:

- **/build**: Creates feature branch, implements changes, creates PR
- **/merge**: Reviews PR, validates changes, merges to main, closes issue

Together they form a complete development workflow from issue to production.
