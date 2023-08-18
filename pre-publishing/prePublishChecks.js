import { blockChecks } from './prePublishingArray'

// Set notice to false by default
let noticeDisplayed = false

// Function to lock post saving and generate a notification
function lockPostSaving() {
  if (!noticeDisplayed) {
    wp.data.dispatch('core/editor').lockPostSaving()
    wp.data.dispatch('core/editor').lockPostAutosaving()
    wp.data.dispatch('core/editor').disablePublishSidebar()
    wp.data
      .dispatch('core/notices')
      .createErrorNotice(
        'There has been an error, publishing has been disabled. Please see the publishing checklist in the right-hand sidebar for more information on how to fix.',
        {
          id: 'publishing-lock-notice',
          isDismissible: false,
          speak: true,
        },
      )
    noticeDisplayed = true
  }
}

// Function to unlock post saving and remove the notification
function unlockPostSaving() {
  if (noticeDisplayed) {
    wp.data.dispatch('core/editor').unlockPostSaving()
    wp.data.dispatch('core/editor').unlockPostAutosaving()
    wp.data.dispatch('core/editor').enablePublishSidebar()
    wp.data.dispatch('core/notices').removeNotice('publishing-lock-notice')
    noticeDisplayed = false
  }
}

// Subscribe to changes to update the editor in real-time
wp.data.subscribe(function () {
  const editor = wp.data.select('core/editor')
  const blocks = editor.getBlocks()

  // Check if editor has blocks
  if (blocks.length > 0) {
    const prePublishingChecks = blockChecks.map((check) => check.condition(blocks))

    if (prePublishingChecks.some((condition) => condition)) {
      setTimeout(lockPostSaving, 0)
    } else {
      setTimeout(unlockPostSaving, 0)
    }
  }
})
