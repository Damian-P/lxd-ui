export const STATUS = "Status";
export const NAME = "Name";
export const TYPE = "Type";
export const DESCRIPTION = "Description";
export const IPV4 = "IPv4";
export const IPV6 = "IPv6";
export const SNAPSHOTS = "Snapshots";
export const ACTIONS = "Actions";
export const LOCATION = "Location";

export const COLUMN_WIDTHS: Record<string, number> = {
  [NAME]: 170,
  [TYPE]: 130,
  [LOCATION]: 160,
  [DESCRIPTION]: 150,
  [IPV4]: 150,
  [IPV6]: 330,
  [SNAPSHOTS]: 110,
  [STATUS]: 160,
  [ACTIONS]: 240,
};

export const SIZE_HIDEABLE_COLUMNS = [
  SNAPSHOTS,
  IPV6,
  IPV4,
  DESCRIPTION,
  LOCATION,
  TYPE,
  STATUS,
];

export const CREATION_SPAN_COLUMNS = [TYPE, LOCATION, DESCRIPTION, IPV4, IPV6, SNAPSHOTS];
