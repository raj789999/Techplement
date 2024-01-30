export default function generateTableOfContents(readmeContent) {
  const headingRegex = /^(#{2,3})\s+(.+)/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(readmeContent)) !== null) {
    const level = match[1].length;
    const text = match[2].replaceAll("`", "").replaceAll("/", "");
    headings.push({ level, text });
  }

  // Generate a nested structure for the table of contents
  const tableOfContents = [];
  let currentTopLevel = null;
  let currentSubheadings = null;

  headings.forEach((heading) => {
    if (heading.level === 2) {
      // Top-level heading
      currentTopLevel = { text: heading.text, subheadings: [] };
      tableOfContents.push(currentTopLevel);
      currentSubheadings = currentTopLevel.subheadings;
    } else if (currentTopLevel && heading.level === 3) {
      // Subheading
      currentSubheadings.push({ text: heading.text });
    }
  });

  return generateTocHtml(tableOfContents);
}

// Helper function to generate HTML for the table of contents
export function generateTocHtml(toc) {
  const generateAnchor = (text) => text.toLowerCase().replace(/\s/g, "-");

  let html = "<ul>";

  toc.forEach((item) => {
    html += `<li><a href="#${generateAnchor(item.text)}">${item.text}</a>`;

    if (item.subheadings && item.subheadings.length > 0) {
      html += generateTocHtml(item.subheadings);
    }

    html += "</li>";
  });

  html += "</ul>";
  return html;
}