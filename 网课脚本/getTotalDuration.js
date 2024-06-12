const fs = require('fs');
const path = require('path');
const MP4Box = require('mp4box');

const myPath = ''; // 视频文件夹路径，待修改

// 获取单个视频的时长
function getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const mp4boxFile = MP4Box.createFile();
        let bytesRead = 0;

        mp4boxFile.onReady = function (info) {
            resolve(info.duration / info.timescale);
        };

        fileStream.on('data', function (chunk) {
            const arrayBuffer = new Uint8Array(chunk).buffer;
            arrayBuffer.fileStart = bytesRead;
            bytesRead += chunk.length;
            mp4boxFile.appendBuffer(arrayBuffer);
        });

        fileStream.on('end', function () {
            mp4boxFile.flush();
        });
    });
}

// 获取文件夹下所有视频文件的总时长
async function getTotalDuration(dir) {
    let totalDuration = 0;
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dir, files[i]);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            totalDuration += await getTotalDuration(filePath);
        } else if (stat.isFile() && path.extname(filePath) === '.mp4') {
            totalDuration += await getVideoDuration(filePath);
        }
    }
    return totalDuration;
}

function formatDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    console.log(`视频时长总计：${hours}小时${minutes}分钟${seconds}秒`);
}

getTotalDuration(myPath).then((totalDuration) => formatDuration(totalDuration));