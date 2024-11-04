import { useEffect, useRef } from "react";
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Common = () => <div>Welcome Home</div>;

export default Common;
