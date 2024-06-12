// 获取文件夹下所有视频的总时长
// 使用前需安装一个获取媒体信息的库：brew install ffmpeg

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// 使用你的文件夹路径替换下面的路径
const myPath = '';

// 获取单个视频的时长
function getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, function (err, metadata) {
            if (err) {
                reject(err);
            } else {
                resolve(metadata.format.duration);
            }
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