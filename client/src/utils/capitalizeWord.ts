export default class CapitalizeWord {
  static capitalizeWord(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static capitalize(str: string) {
    return str.split(' ').map(this.capitalizeWord).join(' ');
  }
}
