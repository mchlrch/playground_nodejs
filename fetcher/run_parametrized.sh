#!/bin/sh

# usage:
#     run_parametrized.sh < sample.args

# to run all *.args from shell (or crontab):
#    find . -name "*.args" -exec sh -c "./run_parametrized.sh < {}" \;

# SCRIPT_HOME=$(dirname -- $(readlink -fn -- "$0"))
# https://stackoverflow.com/questions/5256823/pwd-command-with-shell-script

read -r URL
read -r LOGFILE

npm start -s $URL >> $LOGFILE
