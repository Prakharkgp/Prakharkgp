      *================================================================*
      * PROGRAM : SORTNAME                                             *
      * PURPOSE : SORT EMPLOYEE FILE ALPHABETICALLY BY NAME            *
      * INPUT   : data/input/employees.dat                             *
      * OUTPUT  : data/output/sorted_by_name.dat                       *
      *================================================================*
       IDENTIFICATION DIVISION.
       PROGRAM-ID. SORTNAME.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "data/input/employees.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT SORT-FILE ASSIGN TO "sortname.srt".
           SELECT OUT-FILE ASSIGN TO "data/output/sorted_by_name.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  EMP-FILE.
       01  EMP-IN                  PIC X(54).
       SD  SORT-FILE.
           COPY EMPREC.
       FD  OUT-FILE.
       01  EMP-OUT                 PIC X(54).
       PROCEDURE DIVISION.
       MAIN-PARA.
           SORT SORT-FILE ON ASCENDING KEY EMP-NAME
               USING EMP-FILE
               GIVING OUT-FILE
           DISPLAY "SORTNAME: SORT COMPLETED"
           STOP RUN.
