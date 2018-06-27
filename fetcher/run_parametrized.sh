#!/bin/sh

# usage: run_parametrized.sh < sample.args 

# SCRIPT_HOME=$(dirname -- $(readlink -fn -- "$0"))
# https://stackoverflow.com/questions/5256823/pwd-command-with-shell-script

read -r URL
read -r LOGFILE

npm start -s $URL >> $LOGFILE
