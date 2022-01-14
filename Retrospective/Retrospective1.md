TEMPLATE FOR RETROSPECTIVE (Team R3)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 3 vs 1
- Total points committed vs done: 21 vs 5 
- Nr of hours planned vs spent (as a team): 80 vs 75

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|:---:|:-----:|:----:|:-----:|:--------:|
| _0_ |   -   |   -  |   20  |    28    |
| _1_ |   7   |   5  |   37  |    42    |
| _2_ |   2   |   8  |   18  |     5    |
| _3_ |   1   |   8  |    5  |     0    |

- Hours per task (average, standard deviation): average 6.82, standard deviation 7.68
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent, from previous table: 1.07

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 8
  - Total hours spent 3
  - Nr of automated unit test cases 4
  - Coverage (if available) N/D
- E2E testing:
  - Total hours estimated 4
  - Total hours spent 2
- Code review 
  - Total hours estimated 2
  - Total hours spent 2
- Technical Debt management:
  - Total hours estimated 8
  - Total hours spent 5
  - Hours estimated for remediation by SonarQube 2h 19min
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  
  We had an estimation error so we did a step back for redefining tasks and assignements, hence we could not complete all the tasks for the other stories

- What lessons did you learn (both positive and negative) in this sprint?
  
  We have learnt the importance of making the tests. It is easier and faster than manually testing everything.
  Having a technical debt has led us to a bad estimation of the workflow

- Which improvement goals set in the previous retrospective were you able to achieve? 

  In the previous retrospective we had some organization problems which we have sorted out.
  The workload was well distributed and the all the repositories are set up properly 

- Which ones you were not able to achieve? Why?

  We have achieved all the goals that we set last time.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  Next time we should care much more about patterns of the code implementation to avoid future negative consequences in terms of code refactoring.
  We need to implement the tests more quickly because we have taken too much time for them this time.


- Really good communication and even if we are remote we are so close to each other.