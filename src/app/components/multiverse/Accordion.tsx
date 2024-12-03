'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';
import { HiChevronRight } from 'react-icons/hi';

import Text from './Text';
import { cn } from './../../lib/utilities';

import './Accordion.css';

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('[&[data-state=open]]:border-b', className)}
    {...props}
  />
));

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]>svg]:rotate-90',
        className
      )}
      {...props}
    >
      {children}
      <HiChevronRight className="h-6 w-6 shrink-0 text-icon transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="accordion-content overflow-hidden"
    {...props}
  >
    <div className={cn('pb-6 pt-2', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

type Props = {
  /** Text or element to display as trigger for the accordion. */
  text: React.ReactNode;
  /** Text or element to display inside the accordion */
  content: React.ReactNode;
};

export default function Accordion({ text, content }: Props) {
  return (
    <AccordionPrimitive.Root type="single" collapsible>
      <AccordionItem value="item">
        <AccordionTrigger>
          {typeof text === 'string' ? (
            <Text size="body" weight="medium">
              {text}
            </Text>
          ) : (
            text
          )}
        </AccordionTrigger>
        <AccordionContent>
          {typeof content === 'string' ? (
            <Text size="body">{content}</Text>
          ) : (
            content
          )}
        </AccordionContent>
      </AccordionItem>
    </AccordionPrimitive.Root>
  );
}
