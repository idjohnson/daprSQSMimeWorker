# Dapr SQS based MIME Parser

## setup

This was tested with node 10.22.1

```
nvm install 10.22.1
nvm use 10.22.1
```

## local test

you can use `npm run unit-tests` to check the parsing.

```
$ npm install
$ npm run unit-tests

> daprsqsevents@1.0.0 unit-tests /home/builder/Workspaces/daprSQSMimeWorker
> mocha --exit test/unit.js

sqs event consumer app listening on port 8080!


Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises
Warning: .end() was called twice. This is not supported in superagent
--0000000000007bec9d05c5b55cea
Content-Type: text/plain; charset="UTF-8"

testing REQ4321

--0000000000007bec9d05c5b55cea
Content-Type: text/html; charset="UTF-8"

<div dir="ltr">testing REQ4321</div>

--0000000000007bec9d05c5b55cea--

[ { name: '', email: 'feedback@talkaboutthe.website' } ]
testing REQ4321

text/plain
element...
text/plain
testing REQ4321

HERE IS PLAIN
MATCHED
4321
element...
text/html
<div dir="ltr">testing REQ4321</div>

MATCHED
4321
[ { name: 'Isaac Johnson', email: 'isaac.johnson@gmail.com' } ]
superagent: double callback bug
mimefile created
create error: Command failed: touch part0 && rm -f part* &&  munpack -f -t mimefile
/bin/sh: 1: munpack: not found

  ✔ succeeds silently! (302ms)

  1 passing (304ms)

```


## Deployment

You will want to update the two kubernetes YAML files :

- sqsbinding.yaml (for your AWS keys)
- sqswatcher.dep.yaml (for your container registry and registry secret in the namespace)

Then update `runit.sh` to also reference that container registry.

I was updating this rather frequently so i wrote a 1-2 punch deployment:

```
builder@DESKTOP-JBA79RT:~/Workspaces/daprSQSMimeWorker$ ./updaterunit.sh 
firstver: 1.12
secondver: 1.13
builder@DESKTOP-JBA79RT:~/Workspaces/daprSQSMimeWorker$ git diff runit.sh
diff --git a/runit.sh b/runit.sh
index e69fa11..fe7a3c9 100755
--- a/runit.sh
+++ b/runit.sh
@@ -1,8 +1,8 @@
 #!/bin/bash
 set -x
 docker build -f Dockerfile -t nodesqswatcher .
-docker tag nodesqswatcher:latest harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.12
-docker push harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.12
+docker tag nodesqswatcher:latest harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.13
+docker push harbor.freshbrewed.science/freshbrewedprivate/nodesqswatcher:1.13
 
-sed -i 's/image:\(.*\):\([^:]*\)/image:\1:1.12/' sqswatcher.dep.yaml
+sed -i 's/image:\(.*\):\([^:]*\)/image:\1:1.13/' sqswatcher.dep.yaml
 kubectl apply -f sqswatcher.dep.yaml
 


## Contributing

Please fork and create a PR back.