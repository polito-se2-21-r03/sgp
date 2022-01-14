# TEMPLATE FOR RETROSPECTIVE (Team R3)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done: 10 vs 8
- Total points committed vs done: 196 vs 162
- Nr of hours planned vs spent (as a team): 80 vs 80

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| :---: | :-----: | :----: | :--------: | :----------: |
| _#0_  |    1    |   -    |     5h     |      5h      |
| _#11_ |    2    |   8    |    20h     |     13h      |
| _#12_ |    2    |   13   |     6h     |      6h      |
| _#13_ |    2    |   55   |     6h     |      6h      |
| _#14_ |    2    |   13   |     5h     |      5h      |
| _#15_ |    2    |   8    |    20h     |     20h      |
| _#16_ |    2    |   21   |     4h     |      2h      |
| _#17_ |    2    |   21   |   3h 30m   |    3h 30m    |
| _#18_ |    2    |   13   |   1h 30m   |    1h 30m    |
| _#19_ |    1    |   13   |     2h     |      6h      |
| _#20_ |    2    |   13   |     4h     |      4h      |
| _#21_ |    1    |   21   |     3h     |      8h      |

- Hours per task (average, standard deviation):
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review
  - Total hours estimated
  - Total hours spent
- Technical Debt management:
  - Total hours estimated
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )

## ASSESSMENT

- What caused your errors in estimation (if any)?
  Difficulties encountered during the delelopement

- What lessons did you learn (both positive and negative) in this sprint?
  Errors can always occur

- Which improvement goals set in the previous retrospective were you able to achieve?

- Which ones you were not able to achieve? Why?
  We've decided to focus on implementing more stories so we have neglected client testing.

- One thing you are proud of as a Team!!
