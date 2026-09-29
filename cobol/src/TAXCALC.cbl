      *================================================================*
      * PROGRAM : TAXCALC                                              *
      * PURPOSE : COMPUTE PROGRESSIVE ANNUAL INCOME TAX PER EMPLOYEE   *
      *           0 - 30,000 @ 0% | 30,001 - 60,000 @ 10%              *
      *           60,001 - 90,000 @ 20% | ABOVE 90,000 @ 30%           *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/tax.rpt                                  *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. TAXCALC.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT RPT-FILE ASSIGN TO "data/output/tax.rpt"
               ORGANIZATION IS LINE SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  EMP-FILE.
           COPY EMPREC.
       FD  RPT-FILE.
       01  RPT-LINE                PIC X(80).
       WORKING-STORAGE SECTION.
       01  WS-EOF                  PIC X VALUE 'N'.
           88  END-OF-FILE         VALUE 'Y'.
       01  WS-TAX                  PIC 9(07)V99 VALUE 0.
       01  WS-NET                  PIC 9(07)V99 VALUE 0.
       01  WS-TOTAL-TAX            PIC 9(09)V99 VALUE 0.
       01  WS-RATE                 PIC 99V9     VALUE 0.
       01  HDR-1.
           05  FILLER PIC X(07) VALUE "ID".
           05  FILLER PIC X(21) VALUE "NAME".
           05  FILLER PIC X(14) VALUE "   GROSS PAY".
           05  FILLER PIC X(14) VALUE "         TAX".
           05  FILLER PIC X(14) VALUE "     NET PAY".
           05  FILLER PIC X(06) VALUE "EFF%".
       01  SEP-LINE                PIC X(80) VALUE ALL "-".
       01  DTL-LINE.
           05  DTL-ID              PIC 9(05).
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-NAME            PIC X(20).
           05  FILLER              PIC X(01) VALUE SPACES.
           05  DTL-GROSS           PIC Z,ZZZ,ZZ9.99.
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-TAX             PIC Z,ZZZ,ZZ9.99.
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-NET             PIC Z,ZZZ,ZZ9.99.
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-RATE            PIC Z9.9.
       01  TRL-LINE.
           05  FILLER              PIC X(42) VALUE
               "TOTAL TAX WITHHELD:".
           05  TRL-TAX             PIC ZZZ,ZZZ,ZZ9.99.
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT RPT-FILE
           MOVE "ANNUAL INCOME TAX REPORT" TO RPT-LINE
           WRITE RPT-LINE
           WRITE RPT-LINE FROM SEP-LINE
           WRITE RPT-LINE FROM HDR-1
           WRITE RPT-LINE FROM SEP-LINE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM CALC-TAX
               END-READ
           END-PERFORM
           WRITE RPT-LINE FROM SEP-LINE
           MOVE WS-TOTAL-TAX TO TRL-TAX
           WRITE RPT-LINE FROM TRL-LINE
           CLOSE EMP-FILE RPT-FILE
           DISPLAY "TAXCALC: TAX REPORT WRITTEN"
           STOP RUN.
       CALC-TAX.
           EVALUATE TRUE
               WHEN EMP-SALARY <= 30000
                   MOVE 0 TO WS-TAX
               WHEN EMP-SALARY <= 60000
                   COMPUTE WS-TAX ROUNDED =
                       (EMP-SALARY - 30000) * 0.10
               WHEN EMP-SALARY <= 90000
                   COMPUTE WS-TAX ROUNDED =
                       3000 + (EMP-SALARY - 60000) * 0.20
               WHEN OTHER
                   COMPUTE WS-TAX ROUNDED =
                       9000 + (EMP-SALARY - 90000) * 0.30
           END-EVALUATE
           COMPUTE WS-NET = EMP-SALARY - WS-TAX
           COMPUTE WS-RATE ROUNDED = WS-TAX * 100 / EMP-SALARY
           ADD WS-TAX TO WS-TOTAL-TAX
           MOVE EMP-ID     TO DTL-ID
           MOVE EMP-NAME   TO DTL-NAME
           MOVE EMP-SALARY TO DTL-GROSS
           MOVE WS-TAX     TO DTL-TAX
           MOVE WS-NET     TO DTL-NET
           MOVE WS-RATE    TO DTL-RATE
           WRITE RPT-LINE FROM DTL-LINE.
