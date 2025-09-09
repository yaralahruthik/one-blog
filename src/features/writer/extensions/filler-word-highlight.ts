import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import fillerWordsData from '@/data/filler_words_striked.json';

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

            if (!fillerWordsData.length) return DecorationSet.empty;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const text = node.text ?? '';

              // check each phrase pattern
              fillerWordsData.forEach(({ phrase, striked }) => {
                let searchStart = 0;
                let index: number;

                while (
                  (index = text
                    .toLowerCase()
                    .indexOf(phrase.toLowerCase(), searchStart)) !== -1
                ) {
                  // check word boundaries to ensure whole phrase match
                  const beforeChar = index > 0 ? text[index - 1] : ' ';
                  const afterChar =
                    index + phrase.length < text.length
                      ? text[index + phrase.length]
                      : ' ';

                  // verify this is a whole phrase match
                  const isWholePhrase =
                    !/\w/.test(beforeChar) && !/\w/.test(afterChar);

                  if (isWholePhrase) {
                    const matchStart = pos + index;

                    // for each striked part, find its position within the matched phrase
                    striked.forEach((strikedText) => {
                      const strikedIndex = phrase
                        .toLowerCase()
                        .indexOf(strikedText.toLowerCase());

                      if (strikedIndex !== -1) {
                        const strikedStart = matchStart + strikedIndex;
                        const strikedEnd = strikedStart + strikedText.length;

                        decorations.push(
                          Decoration.inline(strikedStart, strikedEnd, {
                            class: 'obw-filler-word',
                          }),
                        );
                      }
                    });
                  }

                  searchStart = index + 1; // continue searching from next position
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
