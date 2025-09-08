import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const fillerWords = ['umm', 'uh', 'like', 'basically', 'actually', 'literally'];
const regex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');

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

            if (!fillerWords.length || !regex) return DecorationSet.empty;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              let match;
              while ((match = regex.exec(node.text ?? '')) !== null) {
                decorations.push(
                  Decoration.inline(
                    pos + match.index,
                    pos + match.index + match[0].length,
                    { class: 'obw-filler-word' },
                  ),
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default FillerWordHighlight;
