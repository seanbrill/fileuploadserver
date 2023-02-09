const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
    }

    getFileUpload(req,res,'/upload',__dirname + '/uploads/');

});

function getFileUpload(req,res,url,uploadDirectory){
    if (req.url === url) {
        try {
            const fileName = req.headers["file-name"];
            req.on("data", chunk => {
                fs.appendFileSync(uploadDirectory + fileName, chunk)
            })
            res.statusCode = 200;
        } catch (error) {
            res.statusCode = 500;
            res.end(error);
        }
        
    }
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

