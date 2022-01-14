# TEMPLATE FOR RETROSPECTIVE (Team R3)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done: 4 vs 3
- Total points committed vs done: 27 vs 19
- Nr of hours planned vs spent (as a team): 80 vs 80

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | -       | -      | 10         | 10           |
| _#8_  | 3       | 3      | 5          | 5            |
| _#9_  | 2       | 8      | 30         | 30           |
| _#10_ | 3       | 8      | 5          | 5            |
| _#11_ | 3       | 8      | 30         | 30           |

- Hours per task (average, standard deviation): average = 6.67, standard deviation = 6.00
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table = 1

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 6
  - Total hours spent: 6
  - Nr of automated unit test cases: 4
  - Coverage: 40.0%
- E2E testing:
  - Total hours estimated: 3
  - Total hours spent: 3
- Code review:
  - Total hours estimated: 6
  - Total hours spent: 6
- Technical Debt management:
  - Total hours estimated: 10h
  - Total hours spent: 10h
  - Hours estimated for remediation by SonarQube: 1h 25min
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation: 1h 18min
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.2%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): Reliability A, Security A, Mantainability A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  We have misunderstood the meaning of a story that took us more time than we have estimated.

- What lessons did you learn (both positive and negative) in this sprint?
  What we learnt during this sprint is that asking question is always a good solution to solve our problems.

- Which improvement goals set in the previous retrospective were you able to achieve?
  We have achieved the only goal that we set in the previous retrospective, i.e., logging the hours in YouTrack immediately after the implementation.
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  For the next sprint we would like to learn how to test the client in order to cover frontend as well

- One thing you are proud of as a Team!! Great teamwork.
