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
  - Total hours estimated: 8
  - Total hours spent: 8
  - Nr of automated unit test cases: 2
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
  Difficulties encountered during the development.

- What lessons did you learn (both positive and negative) in this sprint?
  Negative: errors can always occur.
  Positive: we think that we have successfully accomplished a nice result with the platform that we have developed.

- Which improvement goals set in the previous retrospective were you able to achieve?

- Which ones you were not able to achieve? Why?
  We've decided to focus on implementing more stories so we have neglected client testing.

- One thing you are proud of as a Team!!
  We have worked well together and synchronized our skills in order to accomplish the result
