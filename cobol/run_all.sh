#!/usr/bin/env bash
# Compile every program in src/ with GnuCOBOL and run it against
# data/input/employees.dat, writing results to data/output/.
set -euo pipefail
cd "$(dirname "$0")"

PROGRAMS="EMPLIST SALSTATS DEPTSUM SORTNAME PAYRAISE HIGHPAID TAXCALC SENIORTY VALIDATE CSVEXPRT"

mkdir -p bin data/output
for p in $PROGRAMS; do
  cobc -x -std=default -I copybooks -o "bin/$p" "src/$p.cbl"
done
for p in $PROGRAMS; do
  "./bin/$p"
done
