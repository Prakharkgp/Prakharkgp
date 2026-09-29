      *================================================================*
      * PROGRAM : VALIDATE                                             *
      * PURPOSE : APPLY DATA-QUALITY AND POLICY CHECKS TO EACH RECORD  *
      *           AND WRITE AN EXCEPTION REPORT                        *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/validation.rpt                           *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. VALIDATE.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT RPT-FILE ASSIGN TO "data/output/validation.rpt"
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
       01  WS-MIN-WAGE             PIC 9(07)V99 VALUE 30000.00.
       01  WS-READ                 PIC 9(03) VALUE 0.
       01  WS-CLEAN                PIC 9(03) VALUE 0.
       01  WS-FLAGGED              PIC 9(03) VALUE 0.
       01  WS-ISSUES               PIC 9(02) VALUE 0.
       01  WS-DATE-NUM             PIC 9(08).
       01  SEP-LINE                PIC X(70) VALUE ALL "-".
       01  ERR-LINE.
           05  ERR-ID              PIC 9(05).
           05  FILLER              PIC X(02) VALUE SPACES.
           05  ERR-NAME            PIC X(20).
           05  FILLER              PIC X(01) VALUE SPACES.
           05  ERR-MSG             PIC X(40).
       01  SUM-LINE.
           05  SUM-LABEL           PIC X(24).
           05  SUM-COUNT           PIC ZZ9.
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT RPT-FILE
           MOVE "EMPLOYEE DATA VALIDATION REPORT" TO RPT-LINE
           WRITE RPT-LINE
           WRITE RPT-LINE FROM SEP-LINE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM CHECK-RECORD
               END-READ
           END-PERFORM
           WRITE RPT-LINE FROM SEP-LINE
           MOVE "RECORDS READ:" TO SUM-LABEL
           MOVE WS-READ TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           MOVE "RECORDS CLEAN:" TO SUM-LABEL
           MOVE WS-CLEAN TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           MOVE "RECORDS FLAGGED:" TO SUM-LABEL
           MOVE WS-FLAGGED TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           CLOSE EMP-FILE RPT-FILE
           DISPLAY "VALIDATE: " WS-FLAGGED " OF " WS-READ
                   " RECORDS FLAGGED"
           STOP RUN.
       CHECK-RECORD.
           ADD 1 TO WS-READ
           MOVE 0 TO WS-ISSUES
           MOVE EMP-ID   TO ERR-ID
           MOVE EMP-NAME TO ERR-NAME
           IF EMP-ID IS NOT NUMERIC OR EMP-ID = 0
               MOVE "INVALID EMPLOYEE ID" TO ERR-MSG
               PERFORM LOG-ISSUE
           END-IF
           IF EMP-NAME = SPACES
               MOVE "MISSING NAME" TO ERR-MSG
               PERFORM LOG-ISSUE
           END-IF
           IF EMP-DEPT NOT = "IT" AND NOT = "HR"
              AND NOT = "SALES" AND NOT = "FINANCE"
              AND NOT = "OPERATIONS"
               MOVE "UNKNOWN DEPARTMENT" TO ERR-MSG
               PERFORM LOG-ISSUE
           END-IF
           IF EMP-SALARY < WS-MIN-WAGE
               MOVE "SALARY BELOW 30,000 POLICY MINIMUM" TO ERR-MSG
               PERFORM LOG-ISSUE
           END-IF
           MOVE EMP-HIRE-DATE TO WS-DATE-NUM
           IF FUNCTION TEST-DATE-YYYYMMDD(WS-DATE-NUM) NOT = 0
               MOVE "INVALID HIRE DATE" TO ERR-MSG
               PERFORM LOG-ISSUE
           END-IF
           IF EMP-AGE < 18 OR EMP-AGE > 70
               MOVE "AGE OUTSIDE 18-70 RANGE" TO ERR-MSG
               PERFORM LOG-ISSUE
           END-IF
           IF WS-ISSUES = 0
               ADD 1 TO WS-CLEAN
           ELSE
               ADD 1 TO WS-FLAGGED
           END-IF.
       LOG-ISSUE.
           ADD 1 TO WS-ISSUES
           WRITE RPT-LINE FROM ERR-LINE.
