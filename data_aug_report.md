# Data Augmentation Verification Report
Generated at: 2026-02-27 20:29:40

## 1. Overview
- **Total Users:** 1,000
- **Total Interactions:** 74,975

## 2. Relational Integrity (Users <-> Interactions)
- ✅ **All interactions map to a valid user** in `correct_users.json`.
- ✅ **All users have at least one interaction**.
- **Average interactions per user:** 74.97

## 3. Top-Level Schema Checks
### User Fields Example
`accuracy`, `avatar`, `correctProblems`, `email`, `experience`, `name`, `preferredCompanies`, `recentActivity`, `recommendationScores`, `skillDistribution`, `solvedCountByDifficulty`, `solvedProblems`, `topicTags`, `totalInteractions`, `uniqueAttemptedIds`, `uniqueSolvedIds`, `userId`, `userRating`, `username`

### Interaction Fields Example
`__v`, `companies`, `createdAt`, `difficulty`, `language`, `memoryUsedKB`, `problemId`, `runtimeMs`, `submissionStatus`, `tags`, `timeTakenSeconds`, `title`, `userId`, `username`

## 4. Logical Consistency