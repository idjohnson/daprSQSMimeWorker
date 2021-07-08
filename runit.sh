#!/bin/bash
set -x
docker build -f Dockerfile -t nodesqswatcher .
docker tag nodesqswatcher:latest harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.18
docker push harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.18

sed -i 's/image:\(.*\):\([^:]*\)/image:\1:1.18/' sqswatcher.dep.yaml
kubectl apply -f sqswatcher.dep.yaml
