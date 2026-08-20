from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "photaaz-production-readiness-runbook.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#102A43")
TEAL = colors.HexColor("#0F766E")
PALE = colors.HexColor("#EAF7F5")
LIGHT = colors.HexColor("#F4F7FA")
RED = colors.HexColor("#B42318")
GREY = colors.HexColor("#52606D")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleX", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=27, leading=31, textColor=NAVY, alignment=TA_CENTER, spaceAfter=14))
styles.add(ParagraphStyle(name="Sub", parent=styles["Normal"], fontSize=12, leading=17, textColor=GREY, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="H1X", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=NAVY, spaceBefore=6, spaceAfter=10))
styles.add(ParagraphStyle(name="H2X", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=TEAL, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyX", parent=styles["BodyText"], fontSize=9.2, leading=13, textColor=colors.HexColor("#243B53"), spaceAfter=5))
styles.add(ParagraphStyle(name="SmallX", parent=styles["BodyText"], fontSize=7.6, leading=10, textColor=colors.HexColor("#334E68")))
styles.add(ParagraphStyle(name="Callout", parent=styles["BodyText"], fontSize=9.5, leading=14, leftIndent=10, rightIndent=10, borderColor=RED, borderWidth=1, borderPadding=9, backColor=colors.HexColor("#FFF1F0"), textColor=colors.HexColor("#7A271A"), spaceBefore=5, spaceAfter=10))

def P(text, style="BodyX"):
    return Paragraph(text, styles[style])

def bullets(items):
    out=[]
    for x in items:
        out.append(Paragraph("- " + x, ParagraphStyle(name="b"+str(len(out))+str(id(items)), parent=styles["BodyX"], leftIndent=10, firstLineIndent=-7, spaceAfter=3)))
    return out

def table(headers, rows, widths=None, font=7.5):
    data=[[P(f"<b>{h}</b>", "SmallX") for h in headers]] + [[P(str(c), "SmallX") for c in r] for r in rows]
    t=Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("GRID",(0,0),(-1,-1),0.35,colors.HexColor("#BCCCDC")),
        ("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,LIGHT]),
    ]))
    return t

def footer(canvas, doc):
    canvas.saveState(); canvas.setStrokeColor(colors.HexColor("#D9E2EC")); canvas.line(18*mm,13*mm,192*mm,13*mm)
    canvas.setFont("Helvetica",7.5); canvas.setFillColor(GREY)
    canvas.drawString(18*mm,8*mm,"PHOTAAZ - Production Readiness and Package QA Runbook")
    canvas.drawRightString(192*mm,8*mm,f"Page {doc.page}"); canvas.restoreState()

doc=SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
S=[]
S += [Spacer(1,28*mm), P("PHOTAAZ", "TitleX"), P("Production Readiness and Package QA Runbook", "TitleX"), Spacer(1,5*mm), P("Step-by-step staging validation, billing tests, legal readiness, and launch checklist", "Sub"), Spacer(1,12*mm)]
S.append(table(["Document", "Value"], [["Version","1.0 - 3 August 2026"],["Source of truth","Current bs-photos-hub application code and plan seed configuration"],["Audience","Founder, QA tester, developer, and launch operator"],["Status","Pre-production working checklist - not legal advice"]], [42*mm,125*mm]))
S += [Spacer(1,12*mm), P("Release rule", "H2X"), P("Do not launch merely because the pages look complete. Launch only when security isolation, payment lifecycle, media storage, package boundaries, legal disclosures, backups, and rollback have all passed with recorded evidence.", "Callout"), PageBreak()]

S += [P("1. Executive answer: is the app complete?", "H1X"), P("Feature coverage is substantial, but the platform should not yet be treated as production-complete solely from UI completion. A production SaaS marketplace for photographers also needs enforceable authorization, reliable billing state, durable media storage, operational controls, and legal documents matched to the actual data flow."), P("Current stop-ship items", "H2X")]
S += bullets(["Server-side super-admin authentication and role authorization must be proven. A client-side localStorage gate is not a security boundary.","Every customer read and mutation must prove that the signed-in user owns or is authorized for the requested tenant. A tenant slug alone is insufficient.","Onboarding and checkout must not create or upgrade arbitrary tenants supplied by the browser.","Production media must use configured Cloudinary storage; local server-disk fallback is unsafe on most deployments.","Unknown public tenant slugs must return a real not-found response rather than demo content.","Automated tests are limited; high-risk flows require recorded staging evidence before launch."])
S += [P("Meaning of completion", "H2X"), P("The app is launch-ready only after every critical case in this document is marked PASS, all severity-1 and severity-2 defects are closed, a database restore has been rehearsed, and a controlled production smoke test succeeds."), PageBreak()]

S += [P("2. Package source-of-truth matrix", "H1X")]
rows=[
 ["Price","$0","$19 monthly / $190 annual","$49 monthly / $490 annual","$1,490 one time"],
 ["Blogs","3","10","50","Unlimited"],["Total photos","50","300","5,000","Unlimited"],["Hero images","1","3","5","Unlimited"],
 ["Photos/category","20","50","500","Unlimited"],["Parent categories","3","10","20","Unlimited"],["Subcategories/parent","3","5","10","Unlimited"],
 ["Galleries","3","10","50","Unlimited"],["Photos/gallery","20","50","500","Unlimited"],["Premium themes","0","2","5","Unlimited"],
 ["Category requests","0","5","20","Unlimited"],["Custom domain","No","Yes","Yes","Yes"],["Page header images","No","Yes","Yes","Yes"],
 ["Theme components","No","Yes","Yes","Yes"],["Watermarks","No","No","Yes","Yes"],["Advanced customization","No","No","No","Yes"],
 ["Any-language localization","No","No","No","Yes"],["Grace period","0 days","7 days","14 days","0 days / lifetime"],
]
S.append(table(["Feature","Free","Plus","Pro","Ownership"], rows, [42*mm,27*mm,35*mm,35*mm,34*mm]))
S += [Spacer(1,5*mm), P("Theme access note", "H2X"), P("Lumen is the basic Free theme. Archive, Noir, Contact Sheet, and Monogram are premium. Atelier and Horizon are special themes intended for Pro and Ownership. Current access also applies a numeric theme limit and catalog ordering; therefore test the actual visible and selectable list for Plus and Pro. Pro may expose only the first five non-basic eligible entries, so confirm that this matches the intended product policy."), PageBreak()]

S += [P("3. Test environment and evidence", "H1X"), P("Use production-like staging", "H2X")]
S += bullets(["Separate staging PostgreSQL/Supabase database with a restorable snapshot.","Paddle Sandbox with sandbox price IDs and webhook endpoint.","Separate Cloudinary cloud or environment-specific folder.","Resend test sender/domain and a controlled inbox.","HTTPS staging hostname with production-like root-domain routing.","No production credentials or customer data in staging."])
S += [P("Create these isolated personas", "H2X"), table(["Persona","Plan/state","Purpose"],[["qa-admin","Super admin","Admin authorization and content management"],["qa-free","Free","All Free boundaries"],["qa-plus","Plus active","Plus limits and billing"],["qa-pro","Pro active","Pro and watermark behavior"],["qa-owner","Ownership","Unlimited/lifetime behavior"],["qa-grace","Plus and Pro overdue","Grace windows"],["qa-expired","Expired paid plan","Safe Free downgrade"],["qa-attacker","Ordinary user","Cross-tenant negative tests"]],[35*mm,45*mm,90*mm])]
S += [P("Evidence record", "H2X"), table(["Test ID","Build","Expected","Actual","Status","Evidence/bug"],[["PKG-F-01","commit SHA","50th upload succeeds","","","screenshot + log"],["SEC-TEN-01","commit SHA","Tenant B denied","","","HTTP response"],["BILL-WH-01","commit SHA","Valid event applied once","","","event ID + DB row"]],[24*mm,27*mm,37*mm,32*mm,20*mm,35*mm]), PageBreak()]

S += [P("4. Exact boundary-testing method", "H1X"), P("Apply this sequence to every numeric limit", "H2X")]
S += bullets(["Seed or prepare the account at limit minus one. For large Pro limits, use a controlled fixture; do not manually upload thousands of files.","Perform the last allowed action through the real UI. It must succeed.","Repeat the same action once more. It must fail with a clear upgrade message.","Bypass the UI and submit the underlying request directly. The server must still reject it.","At the limit, verify edit, reorder, and delete remain usable.","Delete one counted record and retry. The action should succeed.","Upgrade the plan and retry without signing out. Entitlement should refresh safely.","Downgrade with excess content. Records must remain stored, while creation and public visibility follow the effective lower plan."])
S += [P("Counting questions that must be decided", "H2X"), table(["Area","Current behavior to verify","Product decision"],[["Blogs","All tenant blog records appear to count, including drafts","Confirm drafts should count"],["Category requests","All submitted records may count regardless of status","Decide whether rejected requests free capacity"],["Photos","Total and per-category checks both apply","Document which error takes priority"],["Themes","Tier plus numeric count plus ordering","Confirm exactly which themes each plan receives"],["Downgrade","Data retained but effective-plan presentation limited","Specify selection/order of visible retained content"]],[37*mm,65*mm,68*mm]), PageBreak()]

for title, items in [
("5. Free package execution", ["Create blogs 1-3; Blog 4 must fail. Delete one; replacement must succeed.","Upload total photos 1-50; Photo 51 must fail. In a leaf category, Photo 20 succeeds and 21 fails.","Create three parent categories; the fourth fails. Create three children under one parent; the fourth fails.","Create three galleries; the fourth fails. Add 20 photos to one gallery; the twenty-first fails, including assignment of an existing photo.","Confirm Lumen works and every premium/special theme is rejected server-side.","Confirm custom domain, category request, page-header image, theme components, and watermark are unavailable."]),
("6. Plus package execution", ["Repeat all boundaries at 10 blogs, 300 photos, 3 hero images, 50 photos/category, 10 parents, 5 children/parent, 10 galleries, and 50 photos/gallery.","Submit category requests 1-5; request 6 fails.","Confirm custom domain, page-header images, and theme components work.","Confirm watermark remains unavailable.","Verify exactly two premium themes plus the basic theme; special themes remain denied.","Test monthly and annual checkout, seven-day grace, cancellation, expiry, and renewal restoration."]),
("7. Pro package execution", ["Use fixtures to test 50 blogs, 5,000 photos, 5 hero images, 500 photos/category, 20 parents, 10 children/parent, 50 galleries, and 500 photos/gallery.","Submit category requests 1-20; request 21 fails.","Confirm custom domains, page-header images, theme components, and watermark all work.","Test watermark position, opacity, size, text, background, public delivery, disable/restore, and tenant isolation.","Verify five non-basic themes according to the actual catalog order and confirm intended special-theme access.","Test monthly and annual checkout, fourteen-day grace, expiry, and renewal."]),
("8. Ownership execution", ["Treat null numeric limits as unlimited, never as zero.","Create data beyond Pro limits and confirm no package-limit rejection.","Confirm all coded themes, custom domain, watermark, advanced customization, and any-language localization.","Validate the $1,490 lifetime transaction and ensure no recurring end date is accidentally introduced.","Confirm two months of free maintenance is an operational benefit, not an access-expiration date.","Replay the transaction webhook and confirm no duplicate entitlement or payment record."])]:
    S += [P(title,"H1X")]+bullets(items)+[PageBreak()]

S += [P("9. Billing, webhook, and lifecycle sequence", "H1X")]
S += bullets(["Test Plus and Pro monthly and annual checkout; test Ownership lifetime checkout.","Test success, failure, abandonment, duplicate event, delayed event, update, cancellation, past-due, resume, and expiry.","A valid Paddle signature succeeds; missing, invalid, or body-tampered signatures return 401.","The transaction must upgrade only the authenticated/authorized tenant and store correct customer, subscription/transaction, price, status, and dates.","Duplicate webhook delivery must be idempotent."])
S += [P("Lifecycle expectations", "H2X"), table(["State","Effective access"],[ ["No subscription","Free"],["ACTIVE / TRIALING","Paid plan"],["PAST_DUE with valid period or grace","Paid plan with warning"],["Plus overdue days 1-7","Plus during grace"],["Plus overdue day 8+","Expired, effective Free"],["Pro overdue days 1-14","Pro during grace"],["Pro overdue day 15+","Expired, effective Free"],["CANCELED / EXPIRED and unusable","Effective Free"],["Ownership","Lifetime; no recurring expiry expected"]],[52*mm,115*mm])]
S += [P("Downgrade preservation test", "H2X"), P("Before expiry create more content than Free permits and enable paid settings. After expiry, database counts must remain unchanged; excess content and paid settings must be locked or hidden, not deleted. Renewing must restore them with stable ordering. Verify expiry and grace notifications/email occur once."), PageBreak()]

S += [P("10. Security release gate", "H1X")]
S += bullets(["Unauthenticated visitors cannot call dashboard or admin mutations.","User A cannot read, edit, delete, upload to, bill, or configure User B's tenant by changing a slug or record ID.","Admin pages and server actions require a real authenticated admin role; localStorage manipulation has no effect.","Onboarding cannot upsert arbitrary users or tenants without an authenticated session.","Checkout cannot accept an untrusted tenant slug or attach a purchase to another customer.","Webhook and cron endpoints reject missing/invalid secrets.","Upload validation checks actual content, MIME, dimensions, and size server-side.","Rate limits cover sign-in, signup, contact, support, inquiries, upload, and sensitive mutations.","Secrets never appear in client bundles, logs, errors, or source control.","Unknown tenant slugs return 404, and suspended tenants follow a deliberate policy."])
S += [P("Release condition", "Callout"), P("Any cross-tenant access, admin bypass, payment misattribution, secret exposure, or webhook forgery is an automatic NO-GO regardless of other test results."), PageBreak()]

S += [P("11. Legal and compliance - required for launch", "H1X"), P("For this kind of SaaS, legal pages are not optional decoration. They set the contract with photographers and site visitors, disclose data use, clarify photo ownership, and support payment-provider requirements. Have a qualified lawyer adapt them to your operating country and customer markets."), P("Minimum public documents", "H2X")]
legal_rows=[
["Privacy Policy","What data is collected; account/profile data; uploaded media metadata; inquiries; payment identifiers; cookies; purposes; legal bases where applicable; processors; international transfers; retention; security; user rights; contact; children; changes."],
["Terms of Service","Eligibility; account duties; plans and limits; acceptable use; billing; renewals; cancellations; suspension; intellectual property; service availability; warranties; liability; indemnity; termination; governing law; dispute process."],
["Refund and Cancellation Policy","Monthly/annual/lifetime refund rules; cancellation timing; access through paid term; grace period; downgrade behavior; chargebacks; Paddle merchant-of-record wording if applicable."],
["Cookie Policy and consent","Necessary vs analytics/marketing cookies; vendors; durations; controls; consent banner where required; withdrawal of consent."],
["Acceptable Use Policy","Illegal, abusive, hateful, exploitative, infringing, malware, spam, impersonation, scraping, and prohibited photo content; enforcement and reporting."],
["Copyright/IP policy","Photographer retains ownership; grants Photaaz a limited hosting/display license; user warrants rights and model/property releases; infringement/takedown and repeat-infringer process."],
["Data Processing Addendum","Needed for business customers where Photaaz processes visitor/customer data on their behalf; subprocessors, security, deletion, transfers, breach support."],
["Subprocessor list","Cloud/database, media, payments, email, hosting, monitoring, analytics; purpose and location where known; update procedure."],
]
S.append(table(["Document","What it must cover"],legal_rows,[43*mm,127*mm]))
S += [PageBreak(), P("12. Legal product controls and proof", "H1X")]
S += bullets(["Display Terms and Privacy links before signup and in every public footer.","Use an unticked acceptance checkbox with linked documents; record user ID, timestamp, policy version, locale, and IP where lawful.","When material terms change, notify users and collect renewed acceptance when required.","Provide privacy-request handling: access/export, correction, deletion, objection/opt-out, and identity verification.","Define retention for inactive accounts, support tickets, inquiries, logs, media, backups, and payment records.","Create account deletion that explains billing cancellation, media deletion timing, backup retention, and irreversible effects.","Publish a copyright/takedown contact and internal response workflow.","Obtain explicit marketing-email consent separately from operational email.","Do not claim perfect security, guaranteed uptime, or legal compliance that operations cannot prove.","Review whether age restriction, VAT/sales-tax disclosures, accessibility statement, and jurisdiction-specific notices apply."])
S += [P("Photography-specific clauses", "H2X")]
S += bullets(["Users must own or have permission to upload and publicly display every image.","Users remain responsible for model releases, property releases, trademarks, music, and sensitive content.","Photaaz receives only the limited license required to store, transform, watermark, back up, and display content.","State whether deleted originals persist temporarily in backups or CDN caches.","Explain public gallery indexing, custom-domain exposure, download controls, and that visible watermarks do not prevent copying.","Define reporting and removal procedures for unauthorized images and privacy complaints."])
S += [P("Legal QA cases", "H2X"), table(["ID","Test","Expected"],[["LEG-01","Open every legal link on desktop/mobile and all locales","Correct document/version; no 404"],["LEG-02","Sign up without accepting Terms/Privacy","Blocked"],["LEG-03","Accept and inspect DB audit record","Version and timestamp stored"],["LEG-04","Withdraw optional cookie consent","Non-essential tracking stops"],["LEG-05","Request export/deletion","Verified workflow completes within policy"],["LEG-06","Submit copyright notice","Case recorded and routed"],["LEG-07","Cancel paid plan","UI matches published cancellation/refund policy"]],[22*mm,73*mm,75*mm]), PageBreak()]

S += [P("13. Product, media, SEO, and localization checks", "H1X")]
S += bullets(["Test all marketing, theme, blog, legal, auth, onboarding, dashboard, admin, and public tenant routes on desktop, tablet, and mobile.","Test English, Urdu, Spanish, Arabic, Turkish, Hindi, Portuguese, German, and French; verify Urdu/Arabic RTL layouts and localized metadata.","Confirm main-site blogs are created, translated, published, scheduled, edited, and removed from the super-admin blog module.","Verify only approved/published tenant photos, galleries, and blogs appear publicly.","Test JPG, PNG, WebP, corrupt files, invalid MIME, exact size limit, over-limit, Unicode names, and extreme dimensions.","Production must never silently store uploads on ephemeral local disk.","Verify robots.txt, sitemap.xml, feed.xml, manifest, canonical URLs, alternate locales, Open Graph, Twitter cards, and structured data.","Run accessibility keyboard, focus, contrast, label, alt-text, error, zoom, and screen-reader smoke checks.","Run performance smoke and Lighthouse on homepage, themes, blog, tenant home, gallery, and tenant blog."])
S += [PageBreak(), P("14. Deployment sequence", "H1X")]
steps=["Freeze features and record the release commit.","Back up staging and rehearse restore.","Close every security stop-ship item.","Run install, Prisma generation, lint, type-check, production build, and smoke tests.","Complete Free, Plus, Pro, and Ownership boundary suites.","Complete Paddle checkout, webhook, cancellation, grace, expiry, downgrade, and renewal suites.","Complete cross-tenant and admin authorization tests.","Complete legal-document review and acceptance/audit controls.","Complete all-language, RTL, responsive, accessibility, SEO, media, email, and failure-mode checks.","Provision production database and apply reviewed migrations; do not use ad-hoc schema push as the production migration strategy.","Configure production Cloudinary, Paddle, email, root domain, secrets, cron protection, monitoring, and backups.","Deploy privately and run the production smoke suite.","Create one controlled Free tenant and perform one controlled real payment.","Confirm webhook, entitlement, email, logs, analytics, domain routing, SSL, sitemap, and rollback readiness.","Obtain named engineering, product, security, legal, and operations sign-off; then announce launch."]
for i,x in enumerate(steps,1): S.append(P(f"<b>{i}.</b> {x}"))
S += [PageBreak(), P("15. Final go/no-go sign-off", "H1X")]
checks=["Production build passes","Reviewed database migrations applied","Free boundaries pass","Plus boundaries pass","Pro boundaries pass","Ownership lifetime behavior passes","Checkout and webhook idempotency pass","Cancellation, grace, expiry, downgrade, and renewal pass","Customer ownership enforced server-side","Admin role enforced server-side","Cross-tenant negative suite passes","Cloudinary has no production local fallback","Backups and restore rehearsal pass","Terms, Privacy, Refund, Cookie, Acceptable Use, and Copyright policies published","Consent and policy-version evidence recorded","Privacy request and account deletion workflows tested","All locales and RTL checked","Responsive and accessibility checks pass","SEO and public metadata pass","Monitoring, alerts, runbook, and rollback owner confirmed","Controlled production smoke and payment pass"]
S.append(table(["Gate","Owner","Status","Evidence"],[[c,"","PASS / FAIL",""] for c in checks],[82*mm,27*mm,28*mm,33*mm]))
S += [Spacer(1,7*mm), P("Final decision", "H2X"), table(["Decision","Name","Date","Notes"],[["GO / NO-GO","","",""]],[38*mm,40*mm,35*mm,57*mm]), Spacer(1,8*mm), P("Legal note", "H2X"), P("This runbook is a technical and operational checklist, not legal advice. Applicable obligations depend on company location, customer markets, payment structure, analytics, marketing, age of users, and the categories of personal data processed. Use counsel to finalize the legal text before launch."))

doc.build(S, onFirstPage=footer, onLaterPages=footer)
print(OUT)
