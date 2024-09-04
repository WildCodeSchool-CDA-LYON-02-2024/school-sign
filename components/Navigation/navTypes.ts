import { IconProps } from "@radix-ui/react-icons/dist/types";
import { JSX } from "react";

export interface NavLink {
  name: string;
  icon: (props: IconProps) => JSX.Element;
  variant: "default" | "ghost";
}

export interface NavProps {
  links: NavLink[];
}
