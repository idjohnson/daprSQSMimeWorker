#!/bin/bash

# update runit.sh
export firstver=`cat runit.sh | grep ":[0-9].[0-9]*" | head -n1 | sed 's/^.*\://' | tr -d '\n'`
export firstsub=`cat runit.sh | grep ":[0-9].[0-9]*" | head -n1 | sed 's/^.*\.//' | tr -d '\n'`
export firstprime=`echo $firstver | sed 's/\..*//'`

export secondsub=$((firstsub + 1))
export secondver="$firstprime.$secondsub"

echo "firstver: $firstver"
echo "secondver: $secondver"

sed -i "s/$firstver/$secondver/g" runit.sh
