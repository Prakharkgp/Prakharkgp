      *================================================================*
      * PROGRAM : SENIORTY                                             *
      * PURPOSE : COMPUTE YEARS OF SERVICE AS OF A FIXED RUN DATE AND  *
      *           CLASSIFY EACH EMPLOYEE INTO A SENIORITY BAND         *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/seniority.rpt                            *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. SENIORTY.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT RPT-FILE ASSIGN TO "data/output/seniority.rpt"
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
      *    FIXED "AS OF" DATE SO THE OUTPUT IS REPRODUCIBLE
       01  WS-AS-OF-DATE           PIC 9(08) VALUE 20260929.
       01  WS-HIRE-DATE            PIC 9(08).
       01  WS-DAYS                 PIC S9(07).
       01  WS-YEARS                PIC 9(02)V9.
       01  WS-BAND                 PIC X(12).
       01  WS-JUNIOR               PIC 9(03) VALUE 0.
       01  WS-MID                  PIC 9(03) VALUE 0.
       01  WS-SENIOR               PIC 9(03) VALUE 0.
       01  WS-VETERAN              PIC 9(03) VALUE 0.
       01  SEP-LINE                PIC X(60) VALUE ALL "-".
       01  HDR-1.
           05  FILLER PIC X(07) VALUE "ID".
           05  FILLER PIC X(21) VALUE "NAME".
           05  FILLER PIC X(12) VALUE "HIRE DATE".
           05  FILLER PIC X(08) VALUE "YEARS".
           05  FILLER PIC X(12) VALUE "BAND".
       01  DTL-LINE.
           05  DTL-ID              PIC 9(05).
           05  FILLER              PIC X(02) VALUE SPACES.
           05  DTL-NAME            PIC X(20).
           05  FILLER              PIC X(01) VALUE SPACES.
           05  DTL-HIRE            PIC 9999/99/99.
           05  FILLER              PIC X(03) VALUE SPACES.
           05  DTL-YEARS           PIC Z9.9.
           05  FILLER              PIC X(03) VALUE SPACES.
           05  DTL-BAND            PIC X(12).
       01  SUM-LINE.
           05  SUM-LABEL           PIC X(20).
           05  SUM-COUNT           PIC ZZ9.
       PROCEDURE DIVISION.
       MAIN-PARA.
           OPEN INPUT EMP-FILE OUTPUT RPT-FILE
           MOVE "SENIORITY REPORT AS OF 2026-09-29" TO RPT-LINE
           WRITE RPT-LINE
           WRITE RPT-LINE FROM SEP-LINE
           WRITE RPT-LINE FROM HDR-1
           WRITE RPT-LINE FROM SEP-LINE
           PERFORM UNTIL END-OF-FILE
               READ EMP-FILE
                   AT END SET END-OF-FILE TO TRUE
                   NOT AT END PERFORM CALC-SERVICE
               END-READ
           END-PERFORM
           WRITE RPT-LINE FROM SEP-LINE
           MOVE "JUNIOR   (< 3 YRS)" TO SUM-LABEL
           MOVE WS-JUNIOR TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           MOVE "MID      (3-7 YRS)" TO SUM-LABEL
           MOVE WS-MID TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           MOVE "SENIOR  (8-14 YRS)" TO SUM-LABEL
           MOVE WS-SENIOR TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           MOVE "VETERAN (15+ YRS)" TO SUM-LABEL
           MOVE WS-VETERAN TO SUM-COUNT
           WRITE RPT-LINE FROM SUM-LINE
           CLOSE EMP-FILE RPT-FILE
           DISPLAY "SENIORTY: SENIORITY REPORT WRITTEN"
           STOP RUN.
       CALC-SERVICE.
           MOVE EMP-HIRE-DATE TO WS-HIRE-DATE
           COMPUTE WS-DAYS =
               FUNCTION INTEGER-OF-DATE(WS-AS-OF-DATE)
             - FUNCTION INTEGER-OF-DATE(WS-HIRE-DATE)
           COMPUTE WS-YEARS = WS-DAYS / 365.25
           EVALUATE TRUE
               WHEN WS-YEARS < 3
                   MOVE "JUNIOR" TO WS-BAND
                   ADD 1 TO WS-JUNIOR
               WHEN WS-YEARS < 8
                   MOVE "MID" TO WS-BAND
                   ADD 1 TO WS-MID
               WHEN WS-YEARS < 15
                   MOVE "SENIOR" TO WS-BAND
                   ADD 1 TO WS-SENIOR
               WHEN OTHER
                   MOVE "VETERAN" TO WS-BAND
                   ADD 1 TO WS-VETERAN
           END-EVALUATE
           MOVE EMP-ID       TO DTL-ID
           MOVE EMP-NAME     TO DTL-NAME
           MOVE WS-HIRE-DATE TO DTL-HIRE
           MOVE WS-YEARS     TO DTL-YEARS
           MOVE WS-BAND      TO DTL-BAND
           WRITE RPT-LINE FROM DTL-LINE.
