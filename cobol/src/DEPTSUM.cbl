      *================================================================*
      * PROGRAM : DEPTSUM                                              *
      * PURPOSE : SORT BY DEPARTMENT AND PRINT CONTROL-BREAK TOTALS    *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/deptsum.rpt                              *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. DEPTSUM.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT SORT-FILE ASSIGN TO "deptsum.srt".
           SELECT RPT-FILE ASSIGN TO "data/output/deptsum.rpt"
               ORGANIZATION IS LINE SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  EMP-FILE.
       01  EMP-IN                  PIC X(54).
       SD  SORT-FILE.
           COPY EMPREC.
       FD  RPT-FILE.
       01  RPT-LINE                PIC X(80).
       WORKING-STORAGE SECTION.
       01  WS-EOF                  PIC X VALUE 'N'.
           88  END-OF-SORT         VALUE 'Y'.
       01  WS-FIRST                PIC X VALUE 'Y'.
       01  WS-PREV-DEPT            PIC X(10).
       01  WS-DEPT-COUNT           PIC 9(03)    VALUE 0.
       01  WS-DEPT-TOTAL           PIC 9(09)V99 VALUE 0.
       01  WS-DEPT-AVG             PIC 9(07)V99 VALUE 0.
       01  WS-GRAND-COUNT          PIC 9(03)    VALUE 0.
       01  WS-GRAND-TOTAL          PIC 9(09)V99 VALUE 0.
       01  HDR-1.
           05  FILLER PIC X(12) VALUE "DEPARTMENT".
           05  FILLER PIC X(10) VALUE "HEADCOUNT".
           05  FILLER PIC X(18) VALUE "     TOTAL SALARY".
           05  FILLER PIC X(18) VALUE "    AVERAGE SALARY".
       01  SEP-LINE                PIC X(60) VALUE ALL "-".
       01  DTL-LINE.
           05  DTL-DEPT            PIC X(12).
           05  FILLER              PIC X(04) VALUE SPACES.
           05  DTL-COUNT           PIC ZZ9.
           05  FILLER              PIC X(05) VALUE SPACES.
           05  DTL-TOTAL           PIC ZZ,ZZZ,ZZ9.99.
           05  FILLER              PIC X(05) VALUE SPACES.
           05  DTL-AVG             PIC Z,ZZZ,ZZ9.99.
       PROCEDURE DIVISION.
       MAIN-PARA.
           SORT SORT-FILE ON ASCENDING KEY EMP-DEPT
                             ASCENDING KEY EMP-ID
               USING EMP-FILE
               OUTPUT PROCEDURE IS PRODUCE-REPORT
           DISPLAY "DEPTSUM: " WS-GRAND-COUNT " RECORDS SUMMARISED"
           STOP RUN.
       PRODUCE-REPORT.
           OPEN OUTPUT RPT-FILE
           MOVE "DEPARTMENT SALARY SUMMARY" TO RPT-LINE
           WRITE RPT-LINE
           WRITE RPT-LINE FROM SEP-LINE
           WRITE RPT-LINE FROM HDR-1
           WRITE RPT-LINE FROM SEP-LINE
           PERFORM UNTIL END-OF-SORT
               RETURN SORT-FILE
                   AT END SET END-OF-SORT TO TRUE
                   NOT AT END PERFORM PROCESS-RECORD
               END-RETURN
           END-PERFORM
           IF WS-FIRST = 'N'
               PERFORM DEPT-BREAK
           END-IF
           WRITE RPT-LINE FROM SEP-LINE
           MOVE "ALL DEPTS" TO DTL-DEPT
           MOVE WS-GRAND-COUNT TO DTL-COUNT
           MOVE WS-GRAND-TOTAL TO DTL-TOTAL
           COMPUTE WS-DEPT-AVG ROUNDED =
               WS-GRAND-TOTAL / WS-GRAND-COUNT
           MOVE WS-DEPT-AVG TO DTL-AVG
           WRITE RPT-LINE FROM DTL-LINE
           CLOSE RPT-FILE.
       PROCESS-RECORD.
           IF WS-FIRST = 'Y'
               MOVE 'N' TO WS-FIRST
               MOVE EMP-DEPT TO WS-PREV-DEPT
           END-IF
           IF EMP-DEPT NOT = WS-PREV-DEPT
               PERFORM DEPT-BREAK
               MOVE EMP-DEPT TO WS-PREV-DEPT
           END-IF
           ADD 1 TO WS-DEPT-COUNT WS-GRAND-COUNT
           ADD EMP-SALARY TO WS-DEPT-TOTAL WS-GRAND-TOTAL.
       DEPT-BREAK.
           MOVE WS-PREV-DEPT TO DTL-DEPT
           MOVE WS-DEPT-COUNT TO DTL-COUNT
           MOVE WS-DEPT-TOTAL TO DTL-TOTAL
           COMPUTE WS-DEPT-AVG ROUNDED = WS-DEPT-TOTAL / WS-DEPT-COUNT
           MOVE WS-DEPT-AVG TO DTL-AVG
           WRITE RPT-LINE FROM DTL-LINE
           MOVE 0 TO WS-DEPT-COUNT WS-DEPT-TOTAL.
