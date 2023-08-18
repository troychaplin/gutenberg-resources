export const blockChecks = [
  {
    name: "coreHeadingLevel",
    condition: (blocks) =>
      blocks.some(
        (block) => block.name === "core/heading" && block.attributes.level === 1
      ),
    message: "Accessibility Error: Heading blocks should not use an H1",
  },
  {
    name: "coreButtons",
    condition: (blocks) => checkButtons(blocks),
    message: "Accessibility Error: Buttons must have content and URL",
  },
  {
    name: "coreTableHeader",
    condition: (blocks) =>
      blocks.some(
        (block) =>
          block.name === "core/table" && block.attributes.head.length === 0
      ),
    message: "Accessibility Error: Tables must have a header section",
  },
];

// Check for attributes for text and url on individual core/button (inner block of core/buttons)
function checkButtons(blocks) {
  const coreButtons = blocks.filter((block) => block.name === "core/buttons");

  // Check all core/button inner blocks in every core/buttons block
  const checkAllButtonBlocks = coreButtons.every((buttonsBlock) => {
    return buttonsBlock.innerBlocks.every(({ name, attributes }) => {
      return !(
        name === "core/button" &&
        (attributes.text === "" || attributes.url === undefined)
      );
    });
  });

  // If no core/buttons exist in editor return false
  if (coreButtons.length === 0 || checkAllButtonBlocks) {
    return false;
  }

  // If no core/buttons block is found, return true (since there are no buttons to check)
  return true;
}
