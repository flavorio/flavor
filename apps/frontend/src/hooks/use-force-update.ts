import { useReducer } from 'react';

type UseForceUpdateRes = [number, React.DispatchWithoutAction] & {
  updateMark: number;
  forceUpdate: React.DispatchWithoutAction;
};

/**
 * Used to force an update of a component:
 * 1. const [updateMark, forceUpdate] = useForceUpdate();
 * 2. const { forceUpdate } = useForceUpdate();
 */
export function useForceUpdate(): UseForceUpdateRes {
  const ret = useReducer((x) => x + 1, 0) as UseForceUpdateRes;
  ret.updateMark = ret[0];
  ret.forceUpdate = ret[1];
  return ret;
}
