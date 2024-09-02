import {
  BackpackIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";

export default function TabBar() {
  const nav = [
    {
      name: "Home",
      icon: <HomeIcon />,
    },
    {
      name: "Teachers",
      icon: <BackpackIcon />,
    },
    {
      name: "Documents",
      icon: <FileTextIcon />,
    },
    {
      name: "Settings",
      icon: <GearIcon />,
    },
  ];

  return (
    <Menubar className="h-auto border-none shadow-none rounded-none">
      {nav.map((el, index) => (
        <MenubarMenu key={index}>
          <Link href={`/${el.name.toLowerCase()}`}>
            <MenubarTrigger className="flex-col text-muted-foreground cursor-pointer">
              {el.icon}
              <small>{el.name}</small>
            </MenubarTrigger>
          </Link>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
