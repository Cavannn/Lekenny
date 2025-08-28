// src/lynx-augment.d.ts
import '@lynx-js/react'; // load module so we can augment it

declare module '@lynx-js/react' {
  namespace JSX {
    // This merges with the existing IntrinsicElements
    interface IntrinsicElements {
      // Lynx input element (so TS stops complaining)
      input: {
        value?: string;
        placeholder?: string;
        placeholderColor?: String;
        bindinput?: (e: { detail?: { value?: string } }) => void;
        class?: string;
        className?: string;
        style?: Record<string, any>;
        [k: string]: any;
      };

      // If you still use it somewhere:
      'text-input': {
        value?: string;
        placeholder?: string;
        placeholderColor?: String;
        bindinput?: (e: { detail?: { value?: string } }) => void;
        class?: string;
        className?: string;
        style?: Record<string, any>;
        [k: string]: any;
      };

      // (Optional) If TS also complains about these, add them too:
      view?: any;
      text?: any;
      image?: any;
    }
  }
}
