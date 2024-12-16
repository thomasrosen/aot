// most parts from here are copied from project-fluent (mozilla)
// but some are modified to fit the project

import {
  MarkupParser,
  createParseMarkup,
} from "@/lib/client/fluent/createParseMarkup";
import voidElementTags from "@/lib/client/fluent/voidElementTags";
import { FluentBundle, FluentVariable } from "@fluent/bundle";
import React, {
  Fragment,
  ReactElement,
  ReactNode,
  cloneElement,
  createElement,
  isValidElement,
} from "react";

// Match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
const reMarkup = /<|&#?\w+;/;

export function getElement({
  parseMarkup = createParseMarkup(),
  bundle,
  sourceElement,
  id,
  args,
}: {
  parseMarkup?: MarkupParser;
  bundle?: FluentBundle | null;
  sourceElement?: ReactNode | null;
  id: string;
  args: {
    vars?: Record<string, FluentVariable>;
    elems?: Record<string, ReactElement>;
    attrs?: Record<string, boolean>;
  };
}): ReactElement {
  // if sourceElement is not a ReactElement, make it an element
  // basically convert reactnode to react element
  if (!isValidElement(sourceElement)) {
    sourceElement = createElement(Fragment, null, sourceElement);
  }

  if (!bundle) {
    return createElement(Fragment, null, sourceElement);
  }

  // this.getBundle makes the bundle.hasMessage check which ensures that
  // bundle.getMessage returns an existing message.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const msg = bundle.getMessage(id)!;

  let errors: Array<Error> = [];

  let localizedProps: Record<string, string> | undefined;
  // The default is to forbid all message attributes. If the attrs prop exists
  // on the Localized instance, only set message attributes which have been
  // explicitly allowed by the developer.
  if (args.attrs && msg.attributes) {
    localizedProps = {};
    errors = [];
    for (const [name, allowed] of Object.entries(args.attrs)) {
      if (allowed && name in msg.attributes) {
        localizedProps[name] = bundle.formatPattern(
          msg.attributes[name],
          args.vars,
          errors
        );
      }
    }
    // for (let error of errors) {
    //   this.reportError(error);
    // }
  }

  // If the component to render is a known void element, explicitly dismiss the
  // message value and do not pass it to cloneElement in order to avoid the
  // "void element tags must neither have `children` nor use
  // `dangerouslySetInnerHTML`" error.
  if (
    typeof sourceElement.type === "string" &&
    sourceElement.type in voidElementTags
  ) {
    return cloneElement(sourceElement, localizedProps);
  }

  // If the message has a null value, we're only interested in its attributes.
  // Do not pass the null value to cloneElement as it would nuke all children
  // of the wrapped component.
  if (msg.value === null) {
    return cloneElement(sourceElement, localizedProps);
  }

  errors = [];
  const messageValue = bundle.formatPattern(msg.value, args.vars, errors);
  // for (let error of errors) {
  //   this.reportError(error);
  // }

  // If the message value doesn't contain any markup nor any HTML entities,
  // insert it as the only child of the component to render.
  if (!reMarkup.test(messageValue) || parseMarkup === null) {
    return cloneElement(sourceElement, localizedProps, messageValue);
  }

  let elemsLower: Map<string, ReactElement>;
  if (args.elems) {
    elemsLower = new Map();
    for (const [name, elem] of Object.entries(args.elems)) {
      // Ignore elems which are not valid React elements.
      if (!isValidElement(elem)) {
        continue;
      }
      elemsLower.set(name.toLowerCase(), elem);
    }
  }

  function mapElements({ nodeName, textContent, childNodes }: Node): ReactNode {
    if (nodeName === "#text") {
      return textContent;
    }

    const childName = nodeName.toLowerCase();
    const sourceChild = elemsLower?.get(childName);

    // If the child is not expected just take its textContent.
    if (!sourceChild) {
      return textContent;
    }

    // If the element passed in the elems prop is a known void element,
    // explicitly dismiss any textContent which might have accidentally been
    // defined in the translation to prevent the "void element tags must not
    // have children" error.
    if (
      typeof sourceChild.type === "string" &&
      sourceChild.type in voidElementTags
    ) {
      return sourceChild;
    }

    if (childNodes.length > 0) {
      return cloneElement(
        sourceChild,
        undefined,
        [...childNodes].map(mapElementsWithKey)
      );
    }

    return cloneElement(sourceChild, undefined, textContent);
  }
  function mapElementsWithKey(node: Node, index: number): ReactNode {
    return createElement(React.Fragment, { key: index }, mapElements(node));
  }

  // If the message contains markup, parse it and try to match the children
  // found in the translation with the args passed to this function.
  const translatedChildren = parseMarkup(messageValue).map(mapElementsWithKey);
  return cloneElement(sourceElement, localizedProps, ...translatedChildren);
}
