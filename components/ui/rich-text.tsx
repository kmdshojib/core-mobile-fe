import { Fragment } from 'react';
import { Text, View } from 'react-native';

type RichTextProps = {
  html: string;
  className?: string;
};

type InlinePart = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

type Block =
  | { type: 'paragraph'; html: string }
  | { type: 'list'; ordered: boolean; items: string[] };

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const cleanHtml = (value: string) =>
  value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/\sclass="[^"]*"/gi, '')
    .replace(/\sclass='[^']*'/gi, '')
    .replace(/<hr[^>]*>/gi, '<p></p>');

const stripTags = (value: string) => decodeEntities(value.replace(/<[^>]+>/g, '')).trim();

const parseInline = (html: string): InlinePart[] => {
  const parts: InlinePart[] = [];
  const tagRegex = /<\/?(strong|b|em|i|u)\b[^>]*>|<br\s*\/?>|<[^>]+>/gi;
  const stack: string[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  const pushText = (text: string) => {
    const decoded = decodeEntities(text.replace(/\s+/g, ' '));
    if (!decoded.trim()) return;

    parts.push({
      text: decoded,
      bold: stack.includes('strong') || stack.includes('b'),
      italic: stack.includes('em') || stack.includes('i'),
      underline: stack.includes('u'),
    });
  };

  while ((match = tagRegex.exec(html))) {
    pushText(html.slice(cursor, match.index));

    const tag = match[0].toLowerCase();
    if (tag.startsWith('<br')) {
      parts.push({ text: '\n' });
    } else if (tag.startsWith('</')) {
      const tagName = tag.replace(/[</>\s]/g, '');
      const index = stack.lastIndexOf(tagName);
      if (index >= 0) stack.splice(index, 1);
    } else {
      const tagName = tag.match(/^<(\w+)/)?.[1];
      if (tagName && ['strong', 'b', 'em', 'i', 'u'].includes(tagName)) {
        stack.push(tagName);
      }
    }

    cursor = match.index + match[0].length;
  }

  pushText(html.slice(cursor));
  return parts;
};

const parseBlocks = (html: string): Block[] => {
  const cleaned = cleanHtml(html)
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '</p><p>')
    .trim();
  const blocks: Block[] = [];
  const blockRegex = /<(p|div|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let cursor = 0;
  let match: RegExpExecArray | null;

  const addParagraph = (fragment: string) => {
    const text = stripTags(fragment);
    if (text) blocks.push({ type: 'paragraph', html: fragment });
  };

  while ((match = blockRegex.exec(cleaned))) {
    addParagraph(cleaned.slice(cursor, match.index));

    const tag = match[1].toLowerCase();
    const body = match[2];

    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
        .map((item) => item[1])
        .filter((item) => stripTags(item));

      if (items.length > 0) {
        blocks.push({ type: 'list', ordered: tag === 'ol', items });
      }
    } else {
      addParagraph(body);
    }

    cursor = match.index + match[0].length;
  }

  addParagraph(cleaned.slice(cursor));

  if (blocks.length === 0 && stripTags(cleaned)) {
    blocks.push({ type: 'paragraph', html: cleaned });
  }

  return blocks;
};

function InlineRichText({ html, className = '' }: RichTextProps) {
  const parts = parseInline(cleanHtml(html));

  return (
    <Text className={className}>
      {parts.map((part, index) => (
        <Text
          key={`${part.text}-${index}`}
          className={`${part.bold ? 'font-bold' : ''} ${part.italic ? 'italic' : ''} ${part.underline ? 'underline' : ''}`}>
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

export function RichText({ html, className = '' }: RichTextProps) {
  const blocks = parseBlocks(html);

  return (
    <View className={className}>
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <View key={`list-${index}`} className="gap-2">
              {block.items.map((item, itemIndex) => (
                <View key={`${item}-${itemIndex}`} className="flex-row gap-2">
                  <Text className="mt-0.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {block.ordered ? `${itemIndex + 1}.` : '•'}
                  </Text>
                  <InlineRichText
                    html={item}
                    className="flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300"
                  />
                </View>
              ))}
            </View>
          );
        }

        return (
          <Fragment key={`paragraph-${index}`}>
            <InlineRichText
              html={block.html}
              className="text-sm leading-7 text-slate-700 dark:text-slate-300"
            />
          </Fragment>
        );
      })}
    </View>
  );
}

export function RichInlineText({ html, className = '' }: RichTextProps) {
  return <InlineRichText html={html} className={className} />;
}
