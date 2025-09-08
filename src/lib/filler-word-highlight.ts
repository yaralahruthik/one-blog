import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export type FillerWordHighlightOptions = {
  fillerWords: string[];
};

const FillerWordHighlight = Extension.create<FillerWordHighlightOptions>({
  name: 'fillerWordHighlight',

  addOptions() {
    return {
      fillerWords: ['um', 'uh', 'like', 'basically', 'actually', 'literally'],
    };
  },

  addProseMirrorPlugins() {
    const { fillerWords } = this.options;

    return [
      new Plugin({
        key: new PluginKey('fillerWordHighlight'),

        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: Decoration[] = [];

            if (!fillerWords.length) return DecorationSet.empty;

            const regex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              let match;
              while ((match = regex.exec(node.text ?? '')) !== null) {
                decorations.push(
                  Decoration.inline(
                    pos + match.index,
                    pos + match.index + match[0].length,
                    { class: 'filler-word' },
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
