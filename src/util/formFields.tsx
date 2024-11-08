import { IncusProfile } from "types/profile";
import { IncusInstance } from "types/instance";
import { OptionHTMLAttributes } from "react";
import { IncusConfigPair } from "types/config";
import { IncusProject } from "types/project";
import { IncusStorageVolume } from "types/storage";

export const getUnhandledKeyValues = (
  item:
    | IncusConfigPair
    | IncusInstance
    | IncusProfile
    | IncusProject
    | IncusStorageVolume,
  handledKeys: Set<string>,
) => {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => !handledKeys.has(key)),
  );
};

const collapsedViewMaxWidth = 1420;
export const figureCollapsedScreen = (): boolean =>
  window.innerWidth <= collapsedViewMaxWidth;

export const optionRenderer = (
  value?: unknown,
  optionList?: OptionHTMLAttributes<HTMLOptionElement>[],
): string => {
  const match = optionList?.find((item) => item.value === value);
  if (match?.label && value !== "") {
    return match.label;
  }

  return "";
};
