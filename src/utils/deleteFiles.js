import fs from "fs";
import path from "path";

export const deleteFiles = () => {
  const uploadsDir = path.join(process.cwd(), "/uploads");

  fs.readdir(uploadsDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(uploadsDir, file), (err) => {
        if (err) throw err;
      });
    }
  });
};
