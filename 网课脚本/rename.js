const fs = require("fs");
const path = require("path");

const directory = ""; // 填入文件夹路径
const oldStr = "【 微信号：itcodeba 】【海量课程 www.todo1024.com】"; // 填入需要替换的字符串
const newStr = "";  // 填入替换后的字符串

function renameFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          // 如果是文件夹，递归遍历
          renameFilesInDirectory(filePath);
        } else if (stats.isFile()) {
          // 如果是文件，检查是否需要重命名
          if (file.includes(oldStr)) {
            const newFilename = file.replace(oldStr, newStr);
            fs.rename(filePath, path.join(directory, newFilename), (err) => {
              if (err) throw err;
              console.log(`Renamed file ${file} to ${newFilename}`);
            });
          }
        }
      });
    });
  });
}

renameFilesInDirectory(directory);