function checkForKeys(string, keys) {
    return keys.some((key) => {
      // Check if the keyword is in regex format
      const isRegex = /^\/.*\/[gmiyus]*$/.test(key);
  
      // If it's a regex, remove the slashes and create a RegExp object
      if (isRegex) {
        const regex = new RegExp(
          key.slice(1, key.lastIndexOf("/")),
          key.slice(key.lastIndexOf("/") + 1)
        );
        return regex.test(string);
      } else {
        return string.toLowerCase().includes(key.toLowerCase());
      }
    });
  }
  
  export default checkForKeys;
  