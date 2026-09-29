      *================================================================*
      * PROGRAM : PAYRAISE                                             *
      * PURPOSE : APPLY DEPARTMENT-BASED RAISE AND WRITE NEW MASTER    *
      *           IT 8%, FINANCE 6%, SALES 5%, OTHERS 4%               *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/employees_raised.dat                     *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYRAISE.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT OUT-FILE ASSIGN TO "data/output/employees_raised.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  EMP-FILE.
           COPY EMPREC.
       FD  OUT-FILE.
       01  OUT-RECORD              PIC X(54).
       WORKING-STORAGE SECTION.
       01  WS-EOF                  PIC X VALUE 'N'.
           88  END-OF-FILE         VALUE 'Y'.
       01  WS-COUNT                PIC 9(03)   VALUE 0.
       01  WS-PCT                  PIC V99     VALUE 0.
       01  WS-TOTAL-INCREASE       PIC 9(09)V99 VALUE 0.
       01  WS-OLD-SALARY           PIC 9(07)V99.
       01  WS-DISP-INCREASE        PIC ZZZ,ZZZ,ZZ9.99.
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT OUT-FILE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM APPLY-RAISE
               END-READ
           END-PERFORM
           CLOSE EMP-FILE OUT-FILE
           MOVE WS-TOTAL-INCREASE TO WS-DISP-INCREASE
           DISPLAY "PAYRAISE: " WS-COUNT " RECORDS UPDATED, "
                   "TOTAL INCREASE " WS-DISP-INCREASE
           STOP RUN.
       APPLY-RAISE.
           EVALUATE EMP-DEPT
               WHEN "IT"         MOVE .08 TO WS-PCT
               WHEN "FINANCE"    MOVE .06 TO WS-PCT
               WHEN "SALES"      MOVE .05 TO WS-PCT
               WHEN OTHER        MOVE .04 TO WS-PCT
           END-EVALUATE
           MOVE EMP-SALARY TO WS-OLD-SALARY
           COMPUTE EMP-SALARY ROUNDED = EMP-SALARY * (1 + WS-PCT)
           COMPUTE WS-TOTAL-INCREASE =
               WS-TOTAL-INCREASE + EMP-SALARY - WS-OLD-SALARY
           ADD 1 TO WS-COUNT
           WRITE OUT-RECORD FROM EMP-RECORD.
