"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import NextImage from "next/image";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Check,
  ChevronDown,
  Code as CodeIcon,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Save,
  Search,
  Strikethrough,
  Undo2,
  X
} from "lucide-react";
import { createCustomerBlogPost, updateCustomerBlogPost } from "@/actions/customer-blog-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SelectField } from "@/components/forms/form-controls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DirectUploadForm } from "@/components/forms/direct-upload-form";

type BlogCategoryOption = {
  id: string;
  label: string;
};

type BlogPhotoOption = {
  id: string;
  title: string;
  image: string;
};

type CustomerBlogEditorProps = {
  tenantSlug: string;
  blogCategories: BlogCategoryOption[];
  relatedCategories: BlogCategoryOption[];
  photos: BlogPhotoOption[];
  blog?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    contentHtml: string;
    blogCategoryId?: string | null;
    relatedCategoryId?: string | null;
    featuredImage?: string | null;
    tags: string[];
  };
};

export function CustomerBlogEditor({ tenantSlug, blogCategories, relatedCategories, photos, blog }: CustomerBlogEditorProps) {
  const [contentHtml, setContentHtml] = useState(blog?.contentHtml ?? "<p>Write the story behind this shoot...</p>");
  const [dialogType, setDialogType] = useState<"link" | null>(null);
  const [dialogValue, setDialogValue] = useState("");
  const initialPhotoId = blog?.featuredImage ? photos.find((photo) => photo.image === blog.featuredImage)?.id ?? "" : "";
  const [selectedPhotoId, setSelectedPhotoId] = useState(initialPhotoId);
  const [coverSearch, setCoverSearch] = useState("");
  const [keywords, setKeywords] = useState<string[]>(blog?.tags ?? []);
  const selectedPhoto = photos.find((photo) => photo.id === selectedPhotoId);
  const filteredPhotos = photos.filter((photo) => photo.title.toLowerCase().includes(coverSearch.toLowerCase().trim()));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        code: false,
        heading: false
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Code.configure({
        HTMLAttributes: { class: "rounded bg-muted px-1 py-0.5" }
      })
    ],
    content: contentHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[26rem] w-full px-5 py-6 text-slate-800 outline-none"
      }
    },
    onUpdate: ({ editor }) => setContentHtml(editor.getHTML())
  });

  function handleInsert() {
    if (!editor || !dialogValue.trim()) return;

    if (dialogType === "link") {
      editor.chain().focus().extendMarkRange("link").setLink({ href: dialogValue.trim() }).run();
    }

    setDialogType(null);
    setDialogValue("");
  }

  return (
    <DirectUploadForm action={blog ? updateCustomerBlogPost : createCustomerBlogPost} className="grid gap-5">
      <input type="hidden" name="tenantSlug" value={tenantSlug} />
      {blog ? <input type="hidden" name="blogId" value={blog.id} /> : null}
      <input type="hidden" name="contentHtml" value={contentHtml} />

      <section className="rounded-lg border border-slate-300 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="blog-title">Title</Label>
            <Input id="blog-title" name="title" required minLength={2} defaultValue={blog?.title} placeholder="Post title" className="h-12 text-lg font-semibold" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input id="blog-slug" name="slug" defaultValue={blog?.slug} placeholder="custom-url-slug" />
            </div>
            <SelectField
              name="blogCategoryId"
              label="Blog category"
              description="Editorial category for this article."
              placeholder="No blog category"
              defaultValue={blog?.blogCategoryId ?? "none"}
              options={[
                { label: "No blog category", value: "none" },
                ...blogCategories.map((category) => ({ label: category.label, value: category.id }))
              ]}
            />
          </div>
          <SelectField
            name="relatedCategoryId"
            label="Related photo category"
            description="Optional. Use this only when the story belongs to a photo category or subcategory."
            placeholder="No related photo category"
            defaultValue={blog?.relatedCategoryId ?? "none"}
            options={[
              { label: "No related photo category", value: "none" },
              ...relatedCategories.map((category) => ({ label: category.label, value: category.id }))
            ]}
          />
          <div className="grid gap-2">
            <Label htmlFor="blog-excerpt">Excerpt</Label>
            <Textarea id="blog-excerpt" name="excerpt" defaultValue={blog?.excerpt} placeholder="Short excerpt for cards and search previews..." className="min-h-28" />
          </div>
          <KeywordInput keywords={keywords} setKeywords={setKeywords} />
        </div>
      </section>

      <section className="rounded-lg border border-slate-300 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Cover Image</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Choose the blog cover.</h2>
          </div>
        </div>

        <input type="hidden" name="featuredPhotoId" value={selectedPhotoId} />
        <input type="hidden" name="tags" value={keywords.join(",")} />

        {photos.length ? (
          <div className="mt-5 grid gap-2">
            <Label>Choose from uploaded photos</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="h-11 justify-between gap-3 bg-background px-3 font-normal">
                  <span className="flex min-w-0 items-center gap-3">
                    {selectedPhoto ? (
                      <span className="relative size-7 overflow-hidden rounded bg-slate-100">
                        <NextImage src={selectedPhoto.image} alt={selectedPhoto.title} fill sizes="28px" className="object-cover" />
                      </span>
                    ) : null}
                    <span className={cn("truncate", selectedPhoto ? "text-foreground" : "text-muted-foreground")}>
                      {selectedPhoto?.title ?? "Search uploaded photos"}
                    </span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                collisionPadding={12}
                className="w-[var(--radix-dropdown-menu-trigger-width)] p-2"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={coverSearch}
                    onChange={(event) => setCoverSearch(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    placeholder="Search photos..."
                    className="h-9 pl-9"
                  />
                </div>
                <div className="mt-2 max-h-64 overflow-y-auto pr-1">
                  {selectedPhotoId ? (
                    <DropdownMenuItem
                      onSelect={() => {
                        setSelectedPhotoId("");
                        setCoverSearch("");
                      }}
                    >
                      Clear selected photo
                    </DropdownMenuItem>
                  ) : null}
                  {filteredPhotos.length ? (
                    filteredPhotos.map((photo) => (
                      <DropdownMenuItem
                        key={photo.id}
                        className="gap-3"
                        onSelect={() => {
                          setSelectedPhotoId(photo.id);
                          setCoverSearch("");
                        }}
                      >
                        <span className="relative size-10 shrink-0 overflow-hidden rounded bg-slate-100">
                          <NextImage src={photo.image} alt={photo.title} fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{photo.title}</span>
                        {selectedPhotoId === photo.id ? <Check className="size-4 shrink-0 text-teal-700" aria-hidden="true" /> : null}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">No matching photos.</p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <p className="mt-5 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No approved photos yet. Upload a cover image below or add photos to your library first.
          </p>
        )}

        <div className="mt-5 grid gap-2">
          <Label htmlFor="blog-cover-file">Or upload a new cover image</Label>
          <Input id="blog-cover-file" name="featuredImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-upload-area="blogs" data-upload-label="featured" />
          <p className="text-xs leading-5 text-slate-500">
            If you upload a new cover, it will be used instead of the selected library photo.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        {editor ? <BlogToolbar editor={editor} dialogType={dialogType} dialogValue={dialogValue} setDialogType={setDialogType} setDialogValue={setDialogValue} onInsert={handleInsert} /> : null}
        <div className="border-t border-slate-200 bg-white [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-teal-700 [&_.ProseMirror_blockquote]:bg-teal-50 [&_.ProseMirror_blockquote]:px-4 [&_.ProseMirror_blockquote]:py-2 [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-md [&_.ProseMirror_li]:ml-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_p]:leading-7 [&_.ProseMirror_ul]:list-disc">
          <EditorContent editor={editor} />
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button type="submit" className="h-11 px-5 shadow-lg shadow-slate-950/10">
          <Save className="size-4" aria-hidden="true" />
          {blog ? "Save and submit for review" : "Create and submit for review"}
        </Button>
      </div>
    </DirectUploadForm>
  );
}

function KeywordInput({
  keywords,
  setKeywords
}: {
  keywords: string[];
  setKeywords: Dispatch<SetStateAction<string[]>>;
}) {
  const [value, setValue] = useState("");

  function addKeyword(rawValue: string) {
    const nextKeyword = rawValue.trim().replace(/\s+/g, " ");

    if (!nextKeyword) {
      return;
    }

    setKeywords((current) => {
      const exists = current.some((keyword) => keyword.toLowerCase() === nextKeyword.toLowerCase());
      return exists ? current : [...current, nextKeyword];
    });
    setValue("");
  }

  function removeKeyword(target: string) {
    setKeywords((current) => current.filter((keyword) => keyword !== target));
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="blog-keywords">Keywords</Label>
      <div className="rounded-md border border-input bg-background p-2">
        {keywords.length ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-2 rounded-md border border-teal-700/20 bg-teal-50 px-2.5 py-1 text-sm font-medium text-teal-900"
              >
                {keyword}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-5 p-0 text-teal-900 hover:bg-teal-100"
                  aria-label={`Remove ${keyword}`}
                  onClick={() => removeKeyword(keyword)}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </Button>
              </span>
            ))}
          </div>
        ) : null}
        <Input
          id="blog-keywords"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addKeyword(value);
            }

            if (event.key === "Backspace" && !value) {
              setKeywords((current) => current.slice(0, -1));
            }
          }}
          onBlur={() => addKeyword(value)}
          placeholder="Type a keyword and press Enter"
          className="border-0 px-1 shadow-none focus-visible:ring-0"
        />
      </div>
      <p className="text-xs leading-5 text-slate-500">
        Add searchable terms like location, shoot type, style, or service.
      </p>
    </div>
  );
}

type ToolbarProps = {
  editor: NonNullable<ReturnType<typeof useEditor>>;
  dialogType: "link" | null;
  dialogValue: string;
  setDialogType: (type: "link" | null) => void;
  setDialogValue: (value: string) => void;
  onInsert: () => void;
};

function BlogToolbar({ editor, dialogType, dialogValue, setDialogType, setDialogValue, onInsert }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 bg-slate-50 p-2">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <CodeIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="size-4" />
      </ToolbarButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" aria-label="Heading" title="Heading">
            <Heading1 className="size-4" />
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {[1, 2, 3].map((level) => {
            const Icon = level === 1 ? Heading1 : level === 2 ? Heading2 : Heading3;
            return (
              <DropdownMenuItem
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
                className={cn(editor.isActive("heading", { level }) && "bg-muted")}
              >
                <Icon className="mr-2 size-4" />
                Heading {level}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditorDialogButton
        type="link"
        active={editor.isActive("link")}
        dialogType={dialogType}
        dialogValue={dialogValue}
        setDialogType={setDialogType}
        setDialogValue={setDialogValue}
        onInsert={onInsert}
      />

      <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <Eraser className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
}) {
  return (
    <Button type="button" variant="ghost" size="sm" title={label} aria-label={label} className={cn(active && "bg-muted")} {...props}>
      {children}
    </Button>
  );
}

function EditorDialogButton({
  type,
  active,
  dialogType,
  dialogValue,
  setDialogType,
  setDialogValue,
  onInsert
}: {
  type: "link";
  active?: boolean;
  dialogType: "link" | null;
  dialogValue: string;
  setDialogType: (type: "link" | null) => void;
  setDialogValue: (value: string) => void;
  onInsert: () => void;
}) {
  const label = "Insert link";
  const Icon = LinkIcon;

  return (
    <Dialog open={dialogType === type} onOpenChange={(open) => setDialogType(open ? type : null)}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" title={label} aria-label={label} className={cn(active && "bg-muted")} onClick={() => setDialogType(type)}>
          <Icon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="https://example.com"
          value={dialogValue}
          onChange={(event) => setDialogValue(event.target.value)}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setDialogType(null)}>
            Cancel
          </Button>
          <Button type="button" onClick={onInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
