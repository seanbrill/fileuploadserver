//Client

/*
url -required
file -required
onProgress - optional, callback for handling progress value
onError - optional, callback for handling error
chunksize -optional, defaults to 1000
*/

function uploadFile(url,file, onProgress = (x)=>{console.log('progress: ' + x)}, onError = (e)=>{console.log('error: ' + e)}, chunksize = 1000) {
    return new Promise((Resolve,Reject)=>{
        let fileReader = new FileReader();
        fileReader.onload = async (ev)=>{
            let chunkCount = ev.target.result.byteLength / chunksize;
            let fileName = Number.parseInt(Math.random() * 1000) + '_' + file.name;
            for(let i = 0; i < chunkCount + 1; i++){
                let chunk = ev.target.result.slice(i * chunksize,i * chunksize + chunksize)
                await new Promise((resolve,reject)=>{
                    let request = new XMLHttpRequest();
                    request.open('POST',url);
                    request.setRequestHeader('Content-Type','application/octet-stream');
                    request.setRequestHeader('file-name',fileName);
                    request.send(chunk);
                    request.onload = ()=>{
                        let response = request.response;
                        if(request.status != 200){
                            reject(response.message);
                        }else{
                            resolve();
                        }
                    }
                }).catch((e)=>{
                    onError(e);
                });
            onProgress(Math.round(i * 100/chunkCount,0));
            }
            return Resolve();
        }
    fileReader.readAsArrayBuffer(file);
    });
}

//Server
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
