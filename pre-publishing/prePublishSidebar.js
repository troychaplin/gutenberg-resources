import { PluginDocumentSettingPanel } from "@wordpress/edit-post";
import { registerPlugin } from "@wordpress/plugins";
import { useSelect } from "@wordpress/data";
import { Dashicon, ButtonGroup, Button } from "@wordpress/components";
import { blockChecks } from "./prePublishingArray";

function CustomPanel() {
  const blocks = useSelect((select) => select("core/editor").getBlocks());
  const errorMessages = blockChecks
    .filter((error) => error.condition(blocks))
    .map((error) => error.message);

  const handleExternalLinkClick = () => {
    window.open("https://addsupporturlhere.ca", "_blank");
  };

  return (
    <PluginDocumentSettingPanel
      name="page-errors"
      title="Page Errors"
      className="page-errors"
    >
      {errorMessages.length > 0 && (
        <p>
          Below are a list of errors in the content area. You will not be able
          to publish or udpate the page until they have all been resolved.
        </p>
      )}
      <ul>
        {errorMessages.length > 0 &&
          errorMessages.map((message, index) => (
            <li key={index} style={{ display: `flex`, gap: "4px" }}>
              <Dashicon icon="no" style={{ color: "#eb1010" }} /> {message}
            </li>
          ))}
        {errorMessages.length === 0 && (
          <li style={{ display: `flex`, gap: "4px" }}>
            <Dashicon icon="yes" style={{ color: "#44c265" }} /> There are
            currently no issues with your content blocks and you are free to
            publish this page.
          </li>
        )}
      </ul>

      {errorMessages.length > 0 && (
        <ButtonGroup>
          <Button onClick={handleExternalLinkClick} variant="secondary">
            Get support now!
          </Button>
        </ButtonGroup>
      )}
    </PluginDocumentSettingPanel>
  );
}

// Add a menu item to open the custom panel
registerPlugin("custom-panel", {
  render: CustomPanel,
});
