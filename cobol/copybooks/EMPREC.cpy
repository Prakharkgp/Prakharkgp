      *----------------------------------------------------------------*
      * EMPREC - EMPLOYEE INPUT RECORD LAYOUT (54 BYTES)               *
      *----------------------------------------------------------------*
       01  EMP-RECORD.
           05  EMP-ID              PIC 9(05).
           05  EMP-NAME            PIC X(20).
           05  EMP-DEPT            PIC X(10).
           05  EMP-SALARY          PIC 9(07)V99.
           05  EMP-HIRE-DATE.
               10  EMP-HIRE-YYYY   PIC 9(04).
               10  EMP-HIRE-MM     PIC 9(02).
               10  EMP-HIRE-DD     PIC 9(02).
           05  EMP-AGE             PIC 9(02).
