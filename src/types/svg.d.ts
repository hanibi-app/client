declare module '*.svg' {
  import * as React from 'react';

  const content: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default content;
}
