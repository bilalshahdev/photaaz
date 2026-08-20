"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Edit3, Plus, Trash2 } from "lucide-react";
import { deletePlatformBlogPost, savePlatformBlogPost } from "@/actions/platform-blog-actions";
import { AdminEmptyState, AdminRecordCard, AdminRecordGrid, AdminStatusPill } from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminConfirmDialog, AdminIconButton, AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, LocalizedKeywordInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ManagedPlatformBlogArticle } from "@/services/platform/platform-blog-data";
import type { LocalizedString } from "@/services/platform/platform-data";

type Draft = ManagedPlatformBlogArticle;

function localized(locales: AdminLocaleOption[], en = "") {
  return Object.fromEntries(locales.map((locale) => [locale.code, locale.code === "en" ? en : ""]));
}

function emptyDraft(locales: AdminLocaleOption[], order: number): Draft {
  return {
    slug: "",
    title: localized(locales, "New article"),
    excerpt: localized(locales),
    coverImage: "",
    publishedAt: new Date().toISOString(),
    readTime: localized(locales, "5 min read"),
    keywords: Object.fromEntries(locales.map((locale) => [locale.code, []])),
    sections: [{ heading: localized(locales, "Section heading"), body: Object.fromEntries(locales.map((locale) => [locale.code, []])) }],
    enabled: false,
    featured: false,
    displayOrder: order
  };
}

function text(value: LocalizedString) {
  return typeof value === "string" ? value : value.en ?? Object.values(value)[0] ?? "";
}

function localizedRecord(value: LocalizedString): Record<string, string> {
  return typeof value === "string" ? { en: value } : value;
}

function localizedListRecord(value: string[] | Record<string, string[]>): Record<string, string[]> {
  return Array.isArray(value) ? { en: value } : value;
}

function bodyAsText(body: string[] | Record<string, string[]>): LocalizedString {
  if (Array.isArray(body)) return body.join("\n\n");
  return Object.fromEntries(Object.entries(body).map(([locale, paragraphs]) => [locale, paragraphs.join("\n\n")]));
}

function textAsBody(value: LocalizedString): Record<string, string[]> {
  const record = typeof value === "string" ? { en: value } : value;
  return Object.fromEntries(Object.entries(record).map(([locale, content]) => [locale, content.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)]));
}

export function PlatformBlogManager({ initialArticles, locales }: { initialArticles: ManagedPlatformBlogArticle[]; locales: AdminLocaleOption[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Draft | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    if (!draft) return;
    startTransition(async () => {
      try {
        await savePlatformBlogPost({
          ...draft,
          title: localizedRecord(draft.title),
          excerpt: localizedRecord(draft.excerpt),
          readTime: localizedRecord(draft.readTime),
          keywords: localizedListRecord(draft.keywords),
          sections: draft.sections.map((section) => ({
            heading: localizedRecord(section.heading),
            body: localizedListRecord(section.body)
          })),
          publishedAt: draft.publishedAt.slice(0, 10)
        });
        toast.success("Platform blog post saved.");
        setDraft(null);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save the blog post.");
      }
    });
  }

  function remove() {
    if (!deleteTarget?.id) return;
    startTransition(async () => {
      try {
        await deletePlatformBlogPost(deleteTarget.id!);
        toast.success("Platform blog post deleted.");
        setDeleteTarget(null);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not delete the blog post.");
      }
    });
  }

  return (
    <>
      <AdminPanel title="Platform Articles" icon={BookOpen} actions={<AdminAddButton onClick={() => setDraft(emptyDraft(locales, initialArticles.length + 1))}>Add article</AdminAddButton>}>
        {initialArticles.length ? (
          <AdminRecordGrid>
            {initialArticles.map((article) => (
              <AdminRecordCard key={article.slug}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">/{article.slug}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-950">{text(article.title)}</h3>
                  </div>
                  <AdminStatusPill active={article.enabled} activeLabel="Published" inactiveLabel="Draft" />
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{text(article.excerpt)}</p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-xs text-slate-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <AdminIconButton icon={Edit3} label="Edit article" tooltip="Edit article" onClick={() => setDraft(structuredClone(article))} />
                    <AdminIconButton icon={Trash2} label="Delete article" tooltip={article.id ? "Delete article" : "Save an article once before deleting imported content"} tone="danger" disabled={!article.id} onClick={() => setDeleteTarget(article)} />
                  </div>
                </div>
              </AdminRecordCard>
            ))}
          </AdminRecordGrid>
        ) : <AdminEmptyState title="No platform articles" body="Add the first article for the main Photaaz blog." />}
      </AdminPanel>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
          {draft ? <>
            <DialogHeader><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Main-site blog</p><DialogTitle>{draft.id ? "Edit article" : "Add article"}</DialogTitle></DialogHeader>
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label className="mb-2 block">Slug</Label><Input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div>
                <div><Label className="mb-2 block">Publish date</Label><Input type="date" value={draft.publishedAt.slice(0, 10)} onChange={(event) => setDraft({ ...draft, publishedAt: event.target.value })} /></div>
              </div>
              <LocalizedInput label="Title" value={draft.title} locales={locales} onChange={(title) => setDraft({ ...draft, title })} />
              <LocalizedTextarea label="Excerpt" value={draft.excerpt} locales={locales} onChange={(excerpt) => setDraft({ ...draft, excerpt })} />
              <LocalizedInput label="Read time" value={draft.readTime} locales={locales} onChange={(readTime) => setDraft({ ...draft, readTime })} />
              <div><Label className="mb-2 block">Cover image URL</Label><Input value={draft.coverImage} onChange={(event) => setDraft({ ...draft, coverImage: event.target.value })} placeholder="https://..." /></div>
              <LocalizedKeywordInput label="SEO keywords" value={draft.keywords} locales={locales} onChange={(keywords) => setDraft({ ...draft, keywords })} />
              <div className="grid gap-4 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between"><h3 className="font-semibold">Article sections</h3><Button type="button" variant="outline" onClick={() => setDraft({ ...draft, sections: [...draft.sections, { heading: localized(locales, "New section"), body: Object.fromEntries(locales.map((locale) => [locale.code, []])) }] })}><Plus className="size-4" />Add section</Button></div>
                {draft.sections.map((section, index) => (
                  <div key={index} className="grid gap-4 border border-slate-200 p-4">
                    <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-slate-500">Section {index + 1}</span><Button type="button" variant="ghost" className="text-red-600" onClick={() => setDraft({ ...draft, sections: draft.sections.filter((_, itemIndex) => itemIndex !== index) })}>Remove</Button></div>
                    <LocalizedInput label="Heading" value={section.heading} locales={locales} onChange={(heading) => setDraft({ ...draft, sections: draft.sections.map((item, itemIndex) => itemIndex === index ? { ...item, heading } : item) })} />
                    <LocalizedTextarea label="Body paragraphs (separate with a blank line)" value={bodyAsText(section.body)} locales={locales} onChange={(body) => setDraft({ ...draft, sections: draft.sections.map((item, itemIndex) => itemIndex === index ? { ...item, body: textAsBody(body) } : item) })} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-6">
                <Label className="flex items-center gap-2"><Checkbox checked={draft.enabled} onCheckedChange={(checked) => setDraft({ ...draft, enabled: checked === true })} />Published</Label>
                <Label className="flex items-center gap-2"><Checkbox checked={draft.featured} onCheckedChange={(checked) => setDraft({ ...draft, featured: checked === true })} />Featured</Label>
              </div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button><Button type="button" onClick={save} disabled={isPending}>{isPending ? "Saving…" : "Save article"}</Button></DialogFooter>
          </> : null}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title={`Delete ${deleteTarget ? text(deleteTarget.title) : "article"}?`} body="This permanently removes the article from the main Photaaz blog, feed, and sitemap." pending={isPending} onConfirm={remove} />
    </>
  );
}
