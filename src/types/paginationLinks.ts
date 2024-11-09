import type { JSONAPILinkObject } from "./linkObject"

export type JSONAPIPaginationLinks = {
  first?: JSONAPILinkObject;
  last?: JSONAPILinkObject;
  prev?: JSONAPILinkObject;
  next?: JSONAPILinkObject;
}