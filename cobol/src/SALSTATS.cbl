      *================================================================*
      * PROGRAM : SALSTATS                                             *
      * PURPOSE : COMPUTE PAYROLL STATISTICS (TOTAL/AVG/MIN/MAX)       *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/salstats.rpt                             *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. SALSTATS.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT RPT-FILE ASSIGN TO "data/output/salstats.rpt"
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
       01  WS-COUNT                PIC 9(05)     VALUE 0.
       01  WS-TOTAL                PIC 9(09)V99  VALUE 0.
       01  WS-AVG                  PIC 9(07)V99  VALUE 0.
       01  WS-MIN                  PIC 9(07)V99  VALUE 9999999.99.
       01  WS-MAX                  PIC 9(07)V99  VALUE 0.
       01  WS-MIN-NAME             PIC X(20).
       01  WS-MAX-NAME             PIC X(20).
       01  OUT-LINE.
           05  OUT-LABEL           PIC X(24).
           05  OUT-AMOUNT          PIC ZZZ,ZZZ,ZZ9.99.
           05  FILLER              PIC X(02) VALUE SPACES.
           05  OUT-NAME            PIC X(20).
       01  CNT-LINE.
           05  CNT-LABEL           PIC X(24).
           05  CNT-VALUE           PIC ZZZ,ZZZ,ZZ9.
       01  WS-SEP                  PIC X(60) VALUE ALL "=".
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT RPT-FILE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM ACCUMULATE
               END-READ
           END-PERFORM
           IF WS-COUNT > 0
               COMPUTE WS-AVG ROUNDED = WS-TOTAL / WS-COUNT
           END-IF
           PERFORM WRITE-REPORT
           CLOSE EMP-FILE RPT-FILE
           DISPLAY "SALSTATS: " WS-COUNT " RECORDS PROCESSED"
           STOP RUN.
       ACCUMULATE.
           ADD 1 TO WS-COUNT
           ADD EMP-SALARY TO WS-TOTAL
           IF EMP-SALARY < WS-MIN
               MOVE EMP-SALARY TO WS-MIN
               MOVE EMP-NAME   TO WS-MIN-NAME
           END-IF
           IF EMP-SALARY > WS-MAX
               MOVE EMP-SALARY TO WS-MAX
               MOVE EMP-NAME   TO WS-MAX-NAME
           END-IF.
       WRITE-REPORT.
           MOVE "PAYROLL STATISTICS" TO RPT-LINE
           WRITE RPT-LINE
           WRITE RPT-LINE FROM WS-SEP
           MOVE "EMPLOYEE COUNT:" TO CNT-LABEL
           MOVE WS-COUNT TO CNT-VALUE
           WRITE RPT-LINE FROM CNT-LINE
           MOVE SPACES TO OUT-LINE
           MOVE "TOTAL PAYROLL:" TO OUT-LABEL
           MOVE WS-TOTAL TO OUT-AMOUNT
           WRITE RPT-LINE FROM OUT-LINE
           MOVE SPACES TO OUT-LINE
           MOVE "AVERAGE SALARY:" TO OUT-LABEL
           MOVE WS-AVG TO OUT-AMOUNT
           WRITE RPT-LINE FROM OUT-LINE
           MOVE "MINIMUM SALARY:" TO OUT-LABEL
           MOVE WS-MIN TO OUT-AMOUNT
           MOVE WS-MIN-NAME TO OUT-NAME
           WRITE RPT-LINE FROM OUT-LINE
           MOVE "MAXIMUM SALARY:" TO OUT-LABEL
           MOVE WS-MAX TO OUT-AMOUNT
           MOVE WS-MAX-NAME TO OUT-NAME
           WRITE RPT-LINE FROM OUT-LINE
           WRITE RPT-LINE FROM WS-SEP.
