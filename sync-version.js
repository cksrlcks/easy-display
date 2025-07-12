const fs = require("fs");
const path = require("path");

const rootPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = rootPkg.version;
const packages = ["apps/client", "apps/host"];

packages.forEach((dir) => {
  const pkgPath = path.join(dir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`✔ synced ${dir} to version ${version}`);
});
