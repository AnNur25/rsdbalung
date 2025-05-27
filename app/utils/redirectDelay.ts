import { useNavigate } from "react-router";

export default function redirectDelay(urlPath: string, delay: number): void {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate(urlPath);
  }, delay);
}
