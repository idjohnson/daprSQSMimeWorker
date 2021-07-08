#!/bin/bash
set -x
docker build -f Dockerfile -t nodesqswatcher .
docker tag nodesqswatcher:latest harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.13
docker push harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.13

sed -i 's/image:\(.*\):\([^:]*\)/image:\1:1.13/' sqswatcher.dep.yaml
kubectl apply -f sqswatcher.dep.yaml
