'use strict';

export function requireSelector(parent: HTMLElement | DocumentFragment, selector: string ): HTMLElement {
    const element = parent.querySelector(selector);

    if(!(element instanceof HTMLElement)) {
        throw new Error();
    }

    return element;
}
