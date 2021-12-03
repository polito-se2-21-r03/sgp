# TEMPLATE FOR RETROSPECTIVE (Team R3)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 6 vs 6
- Total points committed vs done 53 vs 53
- Nr of hours planned vs spent (as a team) 80 vs 80

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | -       | -      | 10         | 10           |
| _#2_  | 2       | 8      | 18         | 18           |
| _#3_  | 1       | 8      | 5          | 5            |
| _#4_  | 2       | 21     | 4          | 4            |
| _#5_  | 2       | 8      | 9          | 9            |
| _#6_  | 2       | 5      | 16         | 16           |
| _#7_  | 3       | 3      | 18         | 18           |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation) average= 6.67, standard_deviation=5.5
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 1

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated 7
  - Total hours spent 7
  - Nr of automated unit test cases 6
  - Coverage 56.9
- E2E testing:
  - Total hours estimated 7
  - Total hours spent 7
- Code review
  - Total hours estimated 3
  - Total hours spent 5
- Technical Debt management:
  - Total hours estimated 23
  - Total hours spent 23
  - Hours estimated for remediation by SonarQube 45 min
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation 10
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 0.00 %
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) A A A

## ASSESSMENT

- What caused your errors in estimation (if any)? /

- What lessons did you learn (both positive and negative) in this sprint?
  We improve our planning and practical skills and that fact have permitted us to work the same time but with more productivity, but in the other hand we noticed that the problems can upgrade with the development of the project.
- Which improvement goals set in the previous retrospective were you able to achieve?
  We were able to connect successfully the sonar cloud framework with our project, so we were able to read the metrics and COVERAGE.
- Which ones you were not able to achieve? Why?
  We were still not able to log each hour spent on our tasks immediatly after the implementation.
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  1. Improve the reporting ability using the Youtrack platform (e.g. better description on task, log hour spent).

- One thing you are proud of as a Team!!
  That a team work isn't made only for work.
