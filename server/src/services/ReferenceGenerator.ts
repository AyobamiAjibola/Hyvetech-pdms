import { v4 as uuidv4 } from 'uuid';

export class ReferenceGenerator {
  static generate() {
    return `${uuidv4().slice(0, 8)}`;
    // return uuidv4();
  }
}
