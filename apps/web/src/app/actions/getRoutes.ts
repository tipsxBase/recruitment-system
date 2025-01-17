import path from "path";
import { globby } from "globby";

export const getRoutes = async () => {
  const routeDir = path.join(process.cwd(), "src/app");
  console.log(process.cwd());
  const maybeRoutes = await globby(
    ["**/page.js", "**/page.tsx", "!layout.tsx"],
    {
      cwd: routeDir,
    }
  );
  console.log("maybeRoutes", maybeRoutes);
  for (const filepath of maybeRoutes) {
    const routePath = await parseFilepathToRoute(filepath);
    console.log(filepath, routePath);
  }
};

const routeGroupExpression = /\(.*?\)/;
const dynamicRouteExpression = /\[(.*?)\]/;
const parseFilepathToRoute = async (filepath: string) => {
  if (filepath === "page.tsx") {
    return { path: "/" };
  }
  const pathDir = path.dirname(filepath);
  const dirFragments = pathDir.split("/");
  const routesPath: string[] = [];
  let parentPath = "";
  for (const fragment of dirFragments) {
    if (routeGroupExpression.test(fragment)) {
      // 路由组，不记入路由信息
    } else if (dynamicRouteExpression.test(fragment)) {
      const match = fragment.match(dynamicRouteExpression);
      parentPath = `/${routesPath.join("/")}`;
      // 动态路由，记入路由信息
      routesPath.push(`:${match[1]}`);
    } else {
      // 普通路由，记录路由信息
      routesPath.push(fragment);
    }
  }
  return { path: `/${routesPath.join("/")}`, parent: parentPath };
};
