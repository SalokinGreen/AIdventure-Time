export default function checkLocation(str) {
  // if string includes 'Location: XXX\n' get the location
  if (str.includes("Location: ")) {
    const location = str.split("Location: ")[1].split("\n")[0];
    return location;
  } else {
    return null;
  }
}
