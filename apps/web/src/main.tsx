import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { authStore } from "@/stores/auth";
import { ReactQueryProvider } from "@/lib/react-query";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 应用启动时立即初始化认证状态
const initializeApp = async () => {
  try {
    // 在应用启动时就初始化用户状态
    await authStore.getState().initialLoader();
  } catch (error) {
    // 用户未登录是正常情况，不需要特别处理
    console.log("User not authenticated on app start");
  }

  // 渲染应用
  const rootElement = document.getElementById("app");
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <ReactQueryProvider>
          <RouterProvider router={router} />
        </ReactQueryProvider>
      </StrictMode>
    );
  }
};

// 启动应用
initializeApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
