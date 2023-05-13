// Formate input string to specific type
export default function formatInput(type, str) {
  if (str === false) return false;
  // commands
  const commands = [
    "i",
    "inventory",
    "n",
    "north",
    "e",
    "east",
    "s",
    "south",
    "w",
    "west",
    "h",
    "help",
  ];
  // remove double spaces
  str = str.replace(/\s\s+/g, "");

  if (type === "action") {
    if (commands.includes(str)) return str + ".";
    // Replace "I" with "you"
    str = str.replace(/\bi\b/g, "you");
    // Replace "my" with "your"
    str = str.replace(/\bmy\b/g, "your");
    // Replace "me" with "you"
    str = str.replace(/\bme\b/g, "you");
    // Replace "am" with "are"
    str = str.replace(/\bam\b/g, "are");
    // Replace "I'm" with "you're"
    str = str.replace(/\bI'm\b/g, "you're");
    // Replace "I've" with "you've"
    str = str.replace(/\bI've\b/g, "you've");
    // Replace "I'll" with "you'll"
    str = str.replace(/\bI'll\b/g, "you'll");
    // Replace "I'd" with "you'd"
    str = str.replace(/\bI'd\b/g, "you'd");

    // make the first letter lowercase
    str = str.charAt(0).toLowerCase() + str.slice(1);
    // replace any punctiation at the end of the string that isn't a period
    if (
      str.charAt(str.length - 1) !== "." &&
      str.charAt(str.length - 1) !== '"'
    ) {
      str += ".";
    }
    // add a period at the end if there isn't one
    if (str.charAt(str.length - 1) !== ".") {
      str = str + ".";
    }
    if (str.slice(0, 3) !== "you" || str.slice(0, 3) !== "You") {
      str = "You " + str;
    }
    // If first letter is lowercase, make it uppercase
    if (str.charAt(0) === str.charAt(0).toLowerCase()) {
      str = str.charAt(0).toUpperCase() + str.slice(1);
    }
  } else if (type === "talk") {
    // make the first letter uppercase
    str = str.charAt(0).toUpperCase() + str.slice(1);
    // if string doesn't end with '!', '?', or '.' add a period
    if (
      str.charAt(str.length - 1) !== "!" &&
      str.charAt(str.length - 1) !== "?" &&
      str.charAt(str.length - 1) !== "." &&
      str.charAt(str.length - 1) !== '"'
    ) {
      str = str + ".";
    }
    // if string doesn't start with 'say', 'yell', or 'ask'
    if (
      str.slice(0, 3) !== "say" &&
      str.slice(0, 4) !== "yell" &&
      str.slice(0, 3) !== "ask"
    ) {
      // if string contains a question mark
      if (str.includes("?")) {
        str = 'You ask, "' + str + '"';
      } else if (str.includes("!")) {
        str = 'You yell, "' + str + '"';
      } else {
        str = 'You say, "' + str + '"';
      }
    }
    // if "'" is in the string, replace it with """
    // if (str.includes("'")) {
    //   str = str.replace("'", '"');
    // }
    // if '""' is in the string, replace it with '"'
    if (str.includes('""')) {
      str = str.replace('""', '"');
    }
    // if '".' is in the string, replace it with '.'
    if (str.includes('".')) {
      str = str.replace('".', ".");
    }
    // if '"?' is in the string, replace it with '?'
    if (str.includes('"?')) {
      str = str.replace('"?', "?");
    }
    // if '"!' is in the string, replace it with '!'
    if (str.includes('"!')) {
      str = str.replace('"!', "!");
    }
  }
  return str;
}
