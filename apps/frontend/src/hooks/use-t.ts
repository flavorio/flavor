import { useMemo } from "react";
import { useIntl } from "umi";

export declare type PrimitiveType =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date;

export function useT() {
  const intl = useIntl();
  const t = useMemo(
    () => (id: string, values?: Record<string, PrimitiveType>) => {
      return intl.formatMessage({ id }, values);
    },
    [],
  );

  return t;
}
