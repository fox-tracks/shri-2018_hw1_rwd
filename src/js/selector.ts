'use strict';

export function requireSelector2 <TElement extends HTMLElement>(parent: HTMLElement | DocumentFragment, selector: string ): TElement {
    const element: TElement | null = parent.querySelector<TElement>(selector);

    if(element === null) {
        throw new Error();
    }

    return element;
}

export function requireSelector (parent: HTMLElement | DocumentFragment, selector: string ): HTMLElement {
 return requireSelector2 <HTMLElement>(parent, selector);
}