const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
var MIME = require('@ronomon/mime');
const fs = require('fs');
const https = require('https')
const app = express();
app.use(bodyParser.json())

const port = 8080

//file system based MIME decoding
app.post('/mysqsforsnsOLD', (req, res) => {
    console.log(req.body);

    fs.writeFile('mimefile', JSON.stringify(req.body.Message), function (err) {
        if (err) return console.log(err);
        console.log('mimefile created');

        exec("touch part0 && rm -f part* && cat mimefile | jq -r '' | jq -r .content > mimefileraw && munpack -f -t mimefileraw", (error, stdout, stderr) => {
            if (error) {
                console.log(`create error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`create stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            
            const data = fs.readFileSync('part1', {encoding:'utf8', flag:'r'});
            const data2 = fs.readFileSync('part2', {encoding:'utf8', flag:'r'});

            console.log(`data: ${data}`);
            console.log(`data2: ${data2}`);
        });
        //const execSync = require('child_process').execSync;
        //code = execSync('munpack -f -t mimemessage.txt');
      });
    res.status(200).send()
})

// using @ronomon/mime
app.post('/mysqsforsns', (req, res) => {

    var mymsg = JSON.parse(req.body.Message);
    //console.log(mymsg.content);

    ///var mime = new MIME.Message(buffer);

    var buf = Buffer.from(mymsg.content, 'utf8')
    var mime = new MIME.Message(buf);
    /*
    console.log(mime.body.toString());
    console.log(mime.to);
    console.log(mime.from[0].name.toString());
    console.log(mime.from[0].email.toString());
    console.log(mime.parts[0].body.toString());
    console.log(mime.parts[0].contentType.value);
    */
    const re = /REQ(\d+)/i;
    mime.parts.forEach(element => {
        console.log("element...");
        console.log(element.contentType.value);
        console.log(element.body.toString());
        if (element.contentType.value == "text/plain") {
            console.log("HERE IS PLAIN")
        }
        var str = element.body.toString();
        if (re.test(str)) {
            
            console.log("MATCHED")
            var found = str.match(re);
            console.log(found[1]);

            // due to all the complicated messages we may get, just base64 it and send that as the payload
            let strbuff = Buffer.from(str, 'utf8')
            let b64data = strbuff.toString('base64')

            const data = JSON.stringify({
                fromname: mime.from[0].name.toString(),
                fromemail: mime.from[0].email.toString(),
                workitem: found[1],
                comment: b64data
              });

              console.log("str--------")
              console.log(str)
              console.log("b64data--------")
              console.log(b64data)

              const options = {
                hostname: 'dev.azure.com',
                port: 443,
                path: '/princessking/_apis/public/distributedtask/webhooks/emailbasedUpdates?api-version=6.0-preview',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': data.length
                }
              }

              const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)
              
                res.on('data', d => {
                  process.stdout.write(d)
                })
              })
              
              req.on('error', error => {
                console.error(error)
              })
              
              req.write(data)
              req.end()
        }
    });
    res.status(200).send()
})

app.listen(port, () => console.log(`sqs event consumer app listening on port ${port}!`))

module.exports = app;