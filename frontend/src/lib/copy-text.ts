function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "0"
  textarea.style.left = "0"
  textarea.style.width = "1px"
  textarea.style.height = "1px"
  textarea.style.padding = "0"
  textarea.style.border = "none"
  textarea.style.outline = "none"
  textarea.style.boxShadow = "none"
  textarea.style.background = "transparent"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)

  const selection = document.getSelection()
  const previousRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  let copied = false
  try {
    copied = document.execCommand("copy")
  } catch {
    copied = false
  }

  document.body.removeChild(textarea)

  if (previousRange && selection) {
    selection.removeAllRanges()
    selection.addRange(previousRange)
  }

  return copied
}

/** Works on HTTPS, localhost, and plain HTTP (e.g. bare IP). */
export async function copyText(text: string): Promise<void> {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function" &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Fall through to execCommand for HTTP / IP hosts.
    }
  }

  if (!copyWithExecCommand(text)) {
    throw new Error("Clipboard copy failed")
  }
}
