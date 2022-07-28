export interface Modal {
  hide(): void;

  show(onChosen: Function): void;
}
