import { Component, ParseJsx } from "fyord";
import styles from "./snippet.module.scss";

const enum StyleNames {
    Editor = 'editor',
    EditorButtons = 'editor__buttons',
    EditorButton = 'editor__button',
    EditorButtonClose = 'editor__button--close',
    EditorButtonMinimize = 'editor__button--minimize',
    EditorButtonExpand = 'editor__button--expand',
  }

export class SnippetComponent extends Component {
    constructor(private code: string) {
        super();
    }

    Html = async () => {
        return <div class={styles.editor}>
            <div class={styles[StyleNames.EditorButtons]}>
                <div class={`${styles[StyleNames.EditorButton]} ${styles[StyleNames.EditorButtonClose]}`}></div>
                <div class={`${styles[StyleNames.EditorButton]} ${styles[StyleNames.EditorButtonMinimize]}`}></div>
                <div class={`${styles[StyleNames.EditorButton]} ${styles[StyleNames.EditorButtonExpand]}`}></div>
            </div>
            <pre>{this.code}</pre>
      </div>;
    }
}
