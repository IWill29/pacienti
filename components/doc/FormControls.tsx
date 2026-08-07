"use client";

import { useLayoutEffect, useRef } from "react";
type DocCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function DocCheckbox({
  id,
  label,
  checked,
  onChange,
  disabled,
}: DocCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex max-w-full cursor-pointer items-start gap-1.5 text-[13px] leading-snug text-zinc-900"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-zinc-400 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="min-w-0 break-words">{label}</span>
    </label>
  );
}

type DocRadioProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function DocRadio({
  id,
  name,
  label,
  value,
  checked,
  onChange,
  disabled,
}: DocRadioProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex max-w-full cursor-pointer items-start gap-1.5 text-[13px] leading-snug text-zinc-900"
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 border-zinc-400 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="min-w-0 break-words">{label}</span>
    </label>
  );
}

type DocInlineInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function DocInlineInput({
  id,
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled,
}: DocInlineInputProps) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`doc-inline-input max-w-full ${className}`}
    />
  );
}

type DocTextAreaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
};

export function DocTextArea({
  id,
  value,
  onChange,
  rows = 4,
  disabled,
}: DocTextAreaProps) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="doc-textarea w-full"
    />
  );
}

type DocLineNoteProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

function DocLineNote({
  id,
  value,
  onChange,
  placeholder = "Piezīme",
  disabled,
}: DocLineNoteProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      value={value}
      rows={2}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="doc-line-note doc-textarea min-h-[3.25rem] resize-none"
    />
  );
}

type DocLineProps = {
  label: string;
  children?: React.ReactNode;
  noteId?: string;
  noteValue?: string;
  onNoteChange?: (value: string) => void;
  notePlaceholder?: string;
};

export function DocLine({
  label,
  children,
  noteId,
  noteValue = "",
  onNoteChange,
  notePlaceholder = "Piezīme",
}: DocLineProps) {
  const hasNote = noteId != null && onNoteChange != null;
  const hasOptions =
    children != null &&
    !(typeof children === "boolean") &&
    (Array.isArray(children) ? children.length > 0 : true);

  return (
    <div
      className={
        hasNote
          ? hasOptions
            ? "doc-line doc-line--with-note"
            : "doc-line doc-line--with-note doc-line--note-only"
          : "doc-line"
      }
    >
      <span className="doc-label shrink-0">{label}</span>
      {hasOptions ? (
        <div className="doc-line-options flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          {children}
        </div>
      ) : null}
      {hasNote ? (
        <DocLineNote
          id={noteId}
          value={noteValue}
          onChange={onNoteChange}
          placeholder={notePlaceholder}
        />
      ) : null}
    </div>
  );
}

type DocFieldBlockProps = {
  label: string;
  children: React.ReactNode;
};

export function DocFieldBlock({ label, children }: DocFieldBlockProps) {
  return (
    <div className="doc-field-block">
      <div className="doc-label mb-1">{label}</div>
      {children}
    </div>
  );
}

type DocSectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function DocSectionTitle({ children, className = "" }: DocSectionTitleProps) {
  return <h2 className={`doc-section-title ${className}`.trim()}>{children}</h2>;
}
