      *================================================================*
      * PROGRAM : CSVEXPRT                                             *
      * PURPOSE : CONVERT THE FIXED-WIDTH EMPLOYEE FILE TO CSV         *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/employees.csv                            *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. CSVEXPRT.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT CSV-FILE ASSIGN TO "data/output/employees.csv"
               ORGANIZATION IS LINE SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  EMP-FILE.
           COPY EMPREC.
       FD  CSV-FILE.
       01  CSV-LINE                PIC X(100).
       WORKING-STORAGE SECTION.
       01  WS-EOF                  PIC X VALUE 'N'.
           88  END-OF-FILE         VALUE 'Y'.
       01  WS-COUNT                PIC 9(03) VALUE 0.
       01  WS-SALARY-ED            PIC Z(06)9.99.
       01  WS-AGE-ED               PIC Z9.
       01  WS-PTR                  PIC 9(03).
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT CSV-FILE
           MOVE "id,name,department,salary,hire_date,age" TO CSV-LINE
           WRITE CSV-LINE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM WRITE-CSV
               END-READ
           END-PERFORM
           CLOSE EMP-FILE CSV-FILE
           DISPLAY "CSVEXPRT: " WS-COUNT " RECORDS EXPORTED"
           STOP RUN.
       WRITE-CSV.
           ADD 1 TO WS-COUNT
           MOVE EMP-SALARY TO WS-SALARY-ED
           MOVE EMP-AGE    TO WS-AGE-ED
           MOVE SPACES TO CSV-LINE
           MOVE 1 TO WS-PTR
           STRING EMP-ID                         DELIMITED BY SIZE
                  ","                            DELIMITED BY SIZE
                  FUNCTION TRIM(EMP-NAME)        DELIMITED BY SIZE
                  ","                            DELIMITED BY SIZE
                  FUNCTION TRIM(EMP-DEPT)        DELIMITED BY SIZE
                  ","                            DELIMITED BY SIZE
                  FUNCTION TRIM(WS-SALARY-ED)    DELIMITED BY SIZE
                  ","                            DELIMITED BY SIZE
                  EMP-HIRE-YYYY "-" EMP-HIRE-MM "-" EMP-HIRE-DD
                                                 DELIMITED BY SIZE
                  ","                            DELIMITED BY SIZE
                  FUNCTION TRIM(WS-AGE-ED)       DELIMITED BY SIZE
               INTO CSV-LINE WITH POINTER WS-PTR
           END-STRING
           WRITE CSV-LINE.
