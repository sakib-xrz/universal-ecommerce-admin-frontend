import { useMediaQuery } from "react-responsive";

export default function useDesktop() {
  return useMediaQuery({ minWidth: 1280 });
}
