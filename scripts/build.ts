import * as fs from "fs-extra";
import * as path from "path";
import config from "../vite.config";
import { build, InlineConfig, defineConfig, UserConfig } from "vite";
const buildAll = async () => {

    await build(defineConfig(config as UserConfig) as InlineConfig);

    const srcDir = path.resolve(__dirname, "../src/");
    fs.readdirSync(srcDir)
        .filter((name) => {
            const componentDir = path.resolve(srcDir, name);
            const isDir = fs.lstatSync(componentDir).isDirectory();
            console.log("文件名", name, componentDir, isDir)
            return isDir && fs.readdirSync(componentDir).includes("entry.ts");
        })
        .forEach(async (name) => {
            const outDir = path.resolve(config.build.outDir, name);
            const custom = {
                lib: {
                    entry: path.resolve(srcDir, name),
                    name,
                    fileName: name,
                    formats: [`esm`, `es`, `umd`],
                },
                outDir,
            };

            Object.assign(config.build, custom);
            await build(defineConfig(config as UserConfig) as InlineConfig);

            fs.outputFile(
                path.resolve(outDir, `package.json`),
                `{
          "name": "duxin-design/${name}",
          "main": "index.umd.js",
          "module": "index.umd.js",
        }`,
                `utf-8`
            );
        });
};

buildAll();
