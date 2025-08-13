import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from "@tabler/icons-react";
import {
  AudioWaveform,
  CircleParking,
  Command,
  GalleryVerticalEnd,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
};

export const getMenuData = (code: string) => {
  switch (code) {
    case "perm-dashboard":
      return {
        icon: IconLayoutDashboard,
        path: "/dashboard",
      };
    case "perm-system": {
      return {
        icon: IconSettings,
      };
    }
    case "perm-user-manage": {
      return {
        path: "/users",
      };
    }
    case "perm-dept-manage": {
      return {
        path: "/departments",
      };
    }
    case "perm-role-manage": {
      return {
        path: "/roles",
      };
    }
    case "perm-org-manage": {
      return {
        path: "/organizations",
      };
    }
    case "perm-recruitment": {
      return {
        icon: IconChecklist,
      };
    }
    case "perm-post-manage": {
      return {
        path: "/posts",
      };
    }
    case "perm-candidate-manage": {
      return {
        path: "/candidates",
      };
    }
    case "perm-interview-manage": {
      return {
        path: "/interviews",
      };
    }
    case "perm-analytics": {
      return {
        icon: IconBrowserCheck,
        path: "/analytics",
      };
    }
    case "perm-todo-manage": {
      return {
        icon: IconChecklist,
        path: "/todos",
      };
    }
  }
};
