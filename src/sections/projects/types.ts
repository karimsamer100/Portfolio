/** A project chapter's animated visual. `copy` is the text column, `visual` the other column. */
export interface Chapter {
  mount(copy: HTMLElement, visual: HTMLElement): void;
  update(p: number): void;
  /** Put the visual before the copy column (desktop) — used by MNIST. */
  visualFirst?: boolean;
}
