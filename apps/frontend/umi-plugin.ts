const { join } = require("path");
import { IApi } from "umi";

export default (api: IApi) => {
  api.modifyTSConfig((prev) => {
    // modify compilerOptions.paths of .umi/tsconfig.json
    const flavorUIPath = join(__dirname, "../../packages/ui/src/*");
    const flavorCorePath = join(__dirname, "../../packages/core/src/*");
    prev.compilerOptions.paths["@flavor/ui/*"] = [flavorUIPath];
    prev.compilerOptions.paths["@flavor/core/*"] = [flavorCorePath];
    return prev;
  });
};
