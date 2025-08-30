function mdToHtml(md) {
  if (!md) return "";
  md = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  md = md.replace(
    /```([\s\S]*?)```/g,
    (_, code) => "<pre><code>" + code + "</code></pre>"
  );
  md = md.replace(/`([^`]+)`/g, "<code>$1</code>");
  md = md.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
  md = md.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
  md = md.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  md = md.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  md = md.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  md = md.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  md = md.replace(/^>\s?(.*$)/gim, "<blockquote>$1</blockquote>");
  md = md.replace(/(^|\n)\s*[-\*]\s+(.*)/gim, "$1<li>$2</li>");
  md = md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  md = md.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>");
  md = md.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );
  md = md
    .split(/\n\n+/)
    .map((p) =>
      /^<h|^<ul|^<pre|^<blockquote/.test(p.trim())
        ? p
        : "<p>" + p.replace(/\n/g, "<br>") + "</p>"
    )
    .join("");
  return md;
}
