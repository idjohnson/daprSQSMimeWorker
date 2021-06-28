const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
const fs = require('fs');
const app = express();
app.use(bodyParser.json())

const port = 8080

app.post('/mysqsforsns', (req, res) => {
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

app.listen(port, () => console.log(`sqs event consumer app listening on port ${port}!`))

module.exports = app;