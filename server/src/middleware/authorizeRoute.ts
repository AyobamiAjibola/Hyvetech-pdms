import { Ability } from "@casl/ability";
import Can from "../utils/Can";
import { Request } from "express";

export default async function authorizeRoute(req: Request) {
  const ability = new Ability();

  ability.update(Can.defineRulesFor(req));

  let authorized;

  const path = req.path;

  switch (path) {
    case path.match("/docs/{1}.*")?.input:
    case path.match("/images/{1}.*")?.input:
    case path.match("/videos/{1}.*")?.input:
      authorized = authorized =
        ability.can("manage", "all") ||
        ability.can("create", "booking") ||
        ability.can("read", "booking") ||
        ability.can("update", "booking") ||
        ability.can("create", "customer") ||
        ability.can("read", "customer");
      break;
    case "/dashboard":
    case "/appointments":
    case path.match("/appointments/(\\d+)")?.input:
    case "/customers":
    case path.match("/customers/(\\d+)/vehicles")?.input:
    case path.match("/customers/(\\d+)/appointments")?.input:
    case path.match("/customers/(\\d+)/transactions")?.input:
      authorized = ability.can("manage", "all");
      break;
    default:
      authorized = false;
  }

  return authorized;
}
