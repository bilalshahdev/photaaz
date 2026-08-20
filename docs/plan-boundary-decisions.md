# Photaaz plan-boundary decisions

These rules remove ambiguity from boundary tests and match the current data model.

- **Blogs:** drafts, pending, approved and rejected posts all count. They consume tenant storage and dashboard capacity. Deleting a post frees one slot; editing never consumes another slot.
- **Category requests:** every submitted request counts, including approved and rejected requests. This is a moderation-work entitlement, not concurrent storage. Super admin can change plan limits when a customer needs more.
- **Photos:** the overall tenant-photo limit is checked first, then the destination category limit, then the destination gallery limit. The returned message identifies the first failed boundary. Moving an existing photo excludes that photo from destination counts.
- **Categories:** only root categories count against `categories.total`; children count against `subcategories.perCategory`. Linking an existing category/subcategory is idempotent and does not consume another slot.
- **Themes:** Basic themes are always ordered first. `premiumThemes.limit` exposes the first N eligible Premium/Special themes in catalog order; it is not a count of historical theme switches. Disabled themes cannot be newly selected, while an already-applied disabled theme remains rendered.
- **Hero images:** existing stored references survive downgrade. A tenant above the new limit can remove or retain existing heroes but cannot add another until below the effective limit. Public/dashboard presentation follows effective-plan rules without deleting stored records.
- **Downgrade:** records remain stored. Creation follows the effective lower plan; public queries limit visible collections rather than deleting excess content. Editing, reordering and deleting retained records remains available.
- **Unlimited:** `null` means unlimited. Zero means the capability cannot create any record.

For every numeric boundary, automated policy tests prove L−1 succeeds, L is rejected for a new creation, exact resulting count L is allowed for batch/link operations, L+1 is rejected, and unlimited accepts large controlled fixture counts.
