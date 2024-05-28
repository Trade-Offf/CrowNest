const fs = require("fs");
const path = require("path");


const directory = "待修改网课文件夹路径"; // 填入文件夹路径
const oldStr = "(更多教程 todo1024.com)"; // 填入需要替换的字符串
const newStr = "";  // 填入替换后的字符串


fs.readdir(directory, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    // 填入需要替换的字符串
    if (file.includes(oldStr)) {
      const newFilename = file.replace(oldStr, newStr);
      fs.rename(
        path.join(directory, file),
        path.join(directory, newFilename),
        (err) => {
          if (err) throw err;
          console.log(`Renamed file ${file} to ${newFilename}`);
        }
      );
    }
  });
});
