import { Request } from 'express';

export default async function authorizeRoute(req: Request) {
  // const ability = new Ability();
  // const path = req.path;
  //
  // let authorized;
  //
  // endpoints.forEach((value) => {
  //   console.log(value.path);
  // });
  //
  // ability.update(Can.defineRulesFor(req));
  //
  // const superAdmin = (value: boolean) => value;
  //
  // const garageAdmin = (value: boolean) => value;
  //
  // const garageTechnician = (value: boolean) => value;
  //
  // const rideShareAdmin = (value: boolean) => value;
  // const rideShareDriver = (value: boolean) => value;
  //
  // const customer = (value: boolean) => value;
  //
  // const guest = (value: boolean) => value;
  //
  // switch (path) {
  //   case "appointments":
  //   case "/sign-out":
  //   case path.match("/docs/{1}.*")?.input:
  //   case path.match("/images/{1}.*")?.input:
  //   case path.match("/videos/{1}.*")?.input:
  //   case "/users":
  //   case path.match("/users/(\\d+)")?.input:
  //   case "/technicians":
  //   case path.match("/technicians/(\\d+)")?.input:
  //   case "/jobs":
  //   case path.match("/jobs/(\\d+)/driver-assign")?.input:
  //   case path.match("/jobs/(\\d+)/customer-assign")?.input:
  //   case path.match("/jobs/(\\d+)")?.input:
  //   case "/partners":
  //   case path.match("/partners/(\\d+)")?.input:
  //   case path.match("/partners/(\\d+)/jobs")?.input:
  //   case "/boostrap":
  //   case "/states":
  //   case path.match("/ride-share/(\\d+)/driver")?.input:
  //   case "/appointments":
  //   case path.match("/appointments/(\\d+)")?.input:
  //   case path.match("/vehicle/(\\d+)/customer-subs")?.input:
  //   case path.match("/vehicle/(\\d+)/driver-subs")?.input:
  //   case path.match("/appointments/(\\d+)/reschedule")?.input:
  //   case path.match("/appointments/(\\d+)/cancel")?.input:
  //   case "/customers":
  //   case path.match("/customers/(\\d+)/vehicles")?.input:
  //   case path.match("/customer/(\\d+)")?.input:
  //   case path.match("/customers/(\\d+)/appointments")?.input:
  //   case path.match("/customers/(\\d+)/transactions")?.input:
  //   case "/timeslots":
  //   case "/technicians/sign-in":
  //     authorized = superAdmin(ability.can("manage", "all"));
  //     authorized = garageAdmin(ability.can("manage", "technician"));
  //     authorized = garageTechnician(ability.can("read", "technician"));
  //     authorized = rideShareAdmin(ability.can("manage", "driver"));
  //     authorized = rideShareDriver(ability.can("read", "driver"));
  //     authorized = customer(ability.can("read", "booking"));
  //     authorized = guest(ability.can("read", "guest"));
  //     break;
  //   case "partners":
  //   default:
  //     authorized = false;
  // }

  return true;
}
