export default function loreBuilder(story, lore, input) {
  if (lore === undefined || lore === []) {
    return null;
  }
  // reverse story
  const reversedStory = story.reverse();
  // Filter lore for active items only and sort by highest priority
  const activeLore = lore
    .filter((l) => l.settings.active)
    .sort((a, b) => b.settings.priority - a.settings.priority);

  // Prepare an array to store lore content where keywords are matched
  let matchingLoreContent = [];

  // Process each lore
  activeLore.forEach((l) => {
    // Get the range to check in the story
    const range = Math.min(l.settings.range, reversedStory.length);

    // Check if any of the keywords are in the range of the reversed story or in the input text
    const keywordsInStoryOrInput = l.keywords.some((keyword) => {
      // Check if the keyword is in regex format
      const isRegex = /^\/.*\/[gmiyus]*$/.test(keyword);

      // If it's a regex, remove the slashes and create a RegExp object
      const regex = isRegex
        ? new RegExp(
            keyword.slice(1, keyword.lastIndexOf("/")),
            keyword.slice(keyword.lastIndexOf("/") + 1)
          )
        : null;

      // Use the RegExp object for comparison if it exists, otherwise do a normal comparison
      return (
        reversedStory
          .slice(0, range)
          .some((s) =>
            isRegex
              ? regex.test(s.text)
              : s.text.toLowerCase().includes(keyword.toLowerCase())
          ) ||
        (input &&
          (isRegex
            ? regex.test(input)
            : input.toLowerCase().includes(keyword.toLowerCase())))
      );
    });

    // If keywords are in the story or input, add the lore content to the matchingLoreContent array
    if (keywordsInStoryOrInput) {
      matchingLoreContent.push(l.content);
    }
  });

  // Return the array of matching lore content
  return matchingLoreContent;
}
