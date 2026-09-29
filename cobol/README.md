# COBOL Programs

Ten GnuCOBOL batch programs that each process the same employee input file
and write their results to `data/output/`.

## Layout

```
copybooks/EMPREC.cpy      shared 54-byte employee record layout
src/*.cbl                 the 10 programs
data/input/employees.dat  input file (15 fixed-width records)
data/output/              output produced by each program (committed)
run_all.sh                compile and run every program
```

## Input record (`EMPREC.cpy`)

| Field      | PIC        | Bytes |
|------------|------------|-------|
| ID         | 9(05)      | 1-5   |
| Name       | X(20)      | 6-25  |
| Department | X(10)      | 26-35 |
| Salary     | 9(07)V99   | 36-44 |
| Hire date  | 9(08) YYYYMMDD | 45-52 |
| Age        | 9(02)      | 53-54 |

## Programs

| # | Program    | What it does                                        | Output                          |
|---|------------|-----------------------------------------------------|---------------------------------|
| 1 | `EMPLIST`  | Formatted employee listing report                   | `emplist.rpt`                   |
| 2 | `SALSTATS` | Payroll count, total, average, min and max          | `salstats.rpt`                  |
| 3 | `DEPTSUM`  | SORT by department with control-break subtotals     | `deptsum.rpt`                   |
| 4 | `SORTNAME` | SORT ... USING/GIVING by employee name              | `sorted_by_name.dat`            |
| 5 | `PAYRAISE` | Department-based raise (IT 8%, FIN 6%, SALES 5%, others 4%) | `employees_raised.dat`  |
| 6 | `HIGHPAID` | Extract employees earning over 60,000               | `high_earners.dat`              |
| 7 | `TAXCALC`  | Progressive income tax, net pay, effective rate     | `tax.rpt`                       |
| 8 | `SENIORTY` | Years of service as of 2026-09-29 and seniority band | `seniority.rpt`                |
| 9 | `VALIDATE` | Data-quality and policy checks, exception report    | `validation.rpt`                |
|10 | `CSVEXPRT` | Convert fixed-width file to CSV                     | `employees.csv`                 |

## Running

Requires [GnuCOBOL](https://gnucobol.sourceforge.io/) (`apt install gnucobol`).

```sh
./run_all.sh
```

Compiled binaries go to `bin/` (git-ignored); reports and data files are
regenerated in `data/output/`.
