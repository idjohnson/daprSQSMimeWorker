#!/bin/bash
set -x
docker build -f Dockerfile -t nodesqswatcher .
docker tag nodesqswatcher:latest harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.12
docker push harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.12

sed -i 's/image:\(.*\):\([^:]*\)/image:\1:1.12/' sqswatcher.dep.yaml
kubectl apply -f sqswatcher.dep.yaml
