import Markdown from 'react-markdown';
import { createElement } from 'react';
import { assetPath } from './paths';
import { articleHeadings, plainText, headingSlug } from './markdown';

export default function MarkdownBody({ content }) {
  const headingIds = new Map(articleHeadings(content).map(({ line, id }) => [line, id]));
  const heading = (tag) => function Heading({ node, children }) {
    return createElement(tag, { id: headingIds.get(node.position?.start.line) || headingSlug(plainText(node)) }, children);
  };
  return (
    <Markdown skipHtml components={{
      h2: heading('h2'), h3: heading('h3'),
      pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
      img: ({ src, alt, title }) => <img src={assetPath(src || '')} alt={alt || ''} title={title} loading="lazy" decoding="async" />,
    }}>{content}</Markdown>
  );
}
