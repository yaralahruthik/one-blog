import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { FILLER_WORDS } from './filler_words';

// Precompile regex patterns for performance
const fillerWordPatterns = FILLER_WORDS.map(({ phrase, striked }) => {
  // Escape regex special chars in phrase
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Word boundary regex (case-insensitive, global)
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  return { phrase, striked, regex };
});

const FillerWordHighlight = Extension.create({
  name: 'fillerWordHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('fillerWordHighlight'),

        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: Decoration[] = [];

            if (!fillerWordPatterns.length) return DecorationSet.empty;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const text = node.text ?? '';

              fillerWordPatterns.forEach(({ phrase, striked, regex }) => {
                let match;

                while ((match = regex.exec(text)) !== null) {
                  const matchStart = pos + match.index;

                  // For each striked part, find its position inside the matched phrase
                  striked.forEach((strikedText) => {
                    const innerIndex = phrase
                      .toLowerCase()
                      .indexOf(strikedText.toLowerCase());

                    if (innerIndex !== -1) {
                      const strikedStart = matchStart + innerIndex;
                      const strikedEnd = strikedStart + strikedText.length;

                      decorations.push(
                        Decoration.inline(strikedStart, strikedEnd, {
                          class: 'obw-filler-word',
                        }),
                      );
                    }
                  });
                }
              });
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default FillerWordHighlight;
