      *================================================================*
      * PROGRAM : EMPLIST                                              *
      * PURPOSE : PRODUCE A FORMATTED EMPLOYEE LISTING REPORT          *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/emplist.rpt                              *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. EMPLIST.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT RPT-FILE ASSIGN TO "data/output/emplist.rpt"
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
       01  WS-COUNT                PIC 9(03) VALUE 0.
       01  HDR-1                   PIC X(80) VALUE
           "                     EMPLOYEE MASTER LISTING".
       01  HDR-2.
           05  FILLER PIC X(07) VALUE "ID".
           05  FILLER PIC X(21) VALUE "NAME".
           05  FILLER PIC X(11) VALUE "DEPARTMENT".
           05  FILLER PIC X(15) VALUE "      SALARY".
           05  FILLER PIC X(12) VALUE "HIRE DATE".
           05  FILLER PIC X(03) VALUE "AGE".
       01  HDR-3                   PIC X(80) VALUE ALL "-".
       01  DTL-LINE.
           05  DTL-ID              PIC 9(05).
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-NAME            PIC X(20).
           05  FILLER              PIC X(01) VALUE SPACES.
           05  DTL-DEPT            PIC X(10).
           05  FILLER              PIC X(01) VALUE SPACES.
           05  DTL-SALARY          PIC Z,ZZZ,ZZ9.99.
           05  FILLER              PIC X(03) VALUE SPACES.
           05  DTL-HIRE-YYYY       PIC 9(04).
           05  FILLER              PIC X VALUE "-".
           05  DTL-HIRE-MM         PIC 9(02).
           05  FILLER              PIC X VALUE "-".
           05  DTL-HIRE-DD         PIC 9(02).
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-AGE             PIC Z9.
       01  TRL-LINE.
           05  FILLER              PIC X(20) VALUE
               "TOTAL EMPLOYEES:".
           05  TRL-COUNT           PIC ZZ9.
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT RPT-FILE
           WRITE RPT-LINE FROM HDR-1
           WRITE RPT-LINE FROM HDR-3
           WRITE RPT-LINE FROM HDR-2
           WRITE RPT-LINE FROM HDR-3
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM WRITE-DETAIL
               END-READ
           END-PERFORM
           WRITE RPT-LINE FROM HDR-3
           MOVE WS-COUNT TO TRL-COUNT
           WRITE RPT-LINE FROM TRL-LINE
           CLOSE EMP-FILE RPT-FILE
           DISPLAY "EMPLIST: " WS-COUNT " RECORDS LISTED"
           STOP RUN.
       WRITE-DETAIL.
           ADD 1 TO WS-COUNT
           MOVE EMP-ID        TO DTL-ID
           MOVE EMP-NAME      TO DTL-NAME
           MOVE EMP-DEPT      TO DTL-DEPT
           MOVE EMP-SALARY    TO DTL-SALARY
           MOVE EMP-HIRE-YYYY TO DTL-HIRE-YYYY
           MOVE EMP-HIRE-MM   TO DTL-HIRE-MM
           MOVE EMP-HIRE-DD   TO DTL-HIRE-DD
           MOVE EMP-AGE       TO DTL-AGE
           WRITE RPT-LINE FROM DTL-LINE.
