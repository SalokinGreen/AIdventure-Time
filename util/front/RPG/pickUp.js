import checkForKeys from "../checkForKeys";

export default function pickUp(input, keys) {
  if (checkForKeys(input, keys)) {
    const newInput = "\n> " + input + "\n----\n" + "Name:";

    return newInput;
  } else {
    return false;
  }
}
