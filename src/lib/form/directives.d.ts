declare module "solid-js" {
  namespace JSX {
    interface Directives {
      validate?: ((element: HTMLInputElement) => Promise<string | false> | string | false)[];
      formSubmit?: (form: HTMLFormElement) => void;
    }
  }
}

export { };
