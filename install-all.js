const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function installDependencies(directory) {
  const packageJsonPath = path.join(directory, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    console.log(`Installing dependencies in ${directory}`);
    execSync("npm install", { cwd: directory, stdio: "inherit" });
  }

  const subdirectories = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  subdirectories.forEach((subdirectory) => {
    const fullPath = path.join(directory, subdirectory);
    installDependencies(fullPath);
  });
}

installDependencies(__dirname);