      *================================================================*
      * PROGRAM : HIGHPAID                                             *
      * PURPOSE : EXTRACT EMPLOYEES EARNING ABOVE A THRESHOLD (60,000) *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/high_earners.dat                         *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HIGHPAID.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT OUT-FILE ASSIGN TO "data/output/high_earners.dat"
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
       01  WS-THRESHOLD            PIC 9(07)V99 VALUE 60000.00.
       01  WS-READ                 PIC 9(03) VALUE 0.
       01  WS-SELECTED             PIC 9(03) VALUE 0.
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT OUT-FILE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END
                       ADD 1 TO WS-READ
                       IF EMP-SALARY > WS-THRESHOLD
                           ADD 1 TO WS-SELECTED
                           WRITE OUT-RECORD FROM EMP-RECORD
                       END-IF
               END-READ
           END-PERFORM
           CLOSE EMP-FILE OUT-FILE
           DISPLAY "HIGHPAID: " WS-SELECTED " OF " WS-READ
                   " RECORDS SELECTED"
           STOP RUN.
