import type { AppLocale } from "./locales";

type LocaleText = Record<AppLocale, string>;

const text = (values: LocaleText) => values;

const platformLiterals: Record<string, LocaleText> = {
  Free: text({ en: "Free", ur: "مفت", es: "Gratis", ar: "مجاني", tr: "Ücretsiz", hi: "मुफ्त", pt: "Grátis", de: "Kostenlos", fr: "Gratuit" }),
  Plus: text({ en: "Plus", ur: "پلس", es: "Plus", ar: "بلس", tr: "Plus", hi: "प्लस", pt: "Plus", de: "Plus", fr: "Plus" }),
  Pro: text({ en: "Pro", ur: "پرو", es: "Pro", ar: "احترافي", tr: "Pro", hi: "प्रो", pt: "Pro", de: "Pro", fr: "Pro" }),
  Ownership: text({ en: "Ownership", ur: "ملکیت", es: "Propiedad", ar: "الملكية", tr: "Sahiplik", hi: "स्वामित्व", pt: "Propriedade", de: "Eigentum", fr: "Propriété" }),
  "Permanent ownership": text({ en: "Permanent ownership", ur: "مستقل ملکیت", es: "Propiedad permanente", ar: "ملكية دائمة", tr: "Kalıcı sahiplik", hi: "स्थायी स्वामित्व", pt: "Propriedade permanente", de: "Dauerhafte Eigentümerschaft", fr: "Propriété permanente" }),
  month: text({ en: "month", ur: "ماہ", es: "mes", ar: "شهر", tr: "ay", hi: "माह", pt: "mês", de: "Monat", fr: "mois" }),
  year: text({ en: "year", ur: "سال", es: "año", ar: "سنة", tr: "yıl", hi: "साल", pt: "ano", de: "Jahr", fr: "an" }),
  "one time": text({ en: "one time", ur: "ایک بار", es: "pago único", ar: "مرة واحدة", tr: "tek sefer", hi: "एक बार", pt: "uma vez", de: "einmalig", fr: "une fois" }),
  Social: text({ en: "Social", ur: "سوشل", es: "Social", ar: "التواصل", tr: "Sosyal", hi: "सोशल", pt: "Social", de: "Social", fr: "Social" }),
  Legal: text({ en: "Legal", ur: "قانونی", es: "Legal", ar: "قانوني", tr: "Yasal", hi: "कानूनी", pt: "Legal", de: "Rechtliches", fr: "Mentions légales" }),
  "Made by": text({ en: "Made by", ur: "بنایا گیا", es: "Hecho por", ar: "صنع بواسطة", tr: "Yapan", hi: "द्वारा निर्मित", pt: "Feito por", de: "Erstellt von", fr: "Créé par" }),
  Copyright: text({ en: "Copyright", ur: "کاپی رائٹ", es: "Copyright", ar: "حقوق النشر", tr: "Telif hakkı", hi: "कॉपीराइट", pt: "Copyright", de: "Copyright", fr: "Copyright" }),
  "All rights reserved": text({ en: "All rights reserved", ur: "تمام حقوق محفوظ ہیں", es: "Todos los derechos reservados", ar: "جميع الحقوق محفوظة", tr: "Tüm hakları saklıdır", hi: "सभी अधिकार सुरक्षित", pt: "Todos os direitos reservados", de: "Alle Rechte vorbehalten", fr: "Tous droits réservés" }),
  "Privacy Policy": text({ en: "Privacy Policy", ur: "پرائیویسی پالیسی", es: "Política de privacidad", ar: "سياسة الخصوصية", tr: "Gizlilik Politikası", hi: "गोपनीयता नीति", pt: "Política de privacidade", de: "Datenschutzerklärung", fr: "Politique de confidentialité" }),
  Terms: text({ en: "Terms", ur: "شرائط", es: "Términos", ar: "الشروط", tr: "Şartlar", hi: "शर्तें", pt: "Termos", de: "Bedingungen", fr: "Conditions" }),
  "Refund Policy": text({ en: "Refund Policy", ur: "ریفنڈ پالیسی", es: "Política de reembolso", ar: "سياسة الاسترداد", tr: "İade Politikası", hi: "रिफंड नीति", pt: "Política de reembolso", de: "Rückerstattungsrichtlinie", fr: "Politique de remboursement" }),
  "Cookie Policy": text({ en: "Cookie Policy", ur: "کوکی پالیسی", es: "Política de cookies", ar: "سياسة ملفات تعريف الارتباط", tr: "Çerez Politikası", hi: "कुकी नीति", pt: "Política de cookies", de: "Cookie-Richtlinie", fr: "Politique relative aux cookies" }),
  "Acceptable Use": text({ en: "Acceptable Use", ur: "قابل قبول استعمال", es: "Uso aceptable", ar: "الاستخدام المقبول", tr: "Kabul edilebilir kullanım", hi: "स्वीकार्य उपयोग", pt: "Uso aceitável", de: "Zulässige Nutzung", fr: "Utilisation acceptable" }),
  "Total photos": text({ en: "Total photos", ur: "کل تصاویر", es: "Fotos totales", ar: "إجمالي الصور", tr: "Toplam fotoğraf", hi: "कुल फोटो", pt: "Total de fotos", de: "Fotos insgesamt", fr: "Photos totales" }),
  "Hero images": text({ en: "Hero images", ur: "ہیرو تصاویر", es: "Imágenes hero", ar: "صور الواجهة", tr: "Hero görselleri", hi: "हीरो इमेज", pt: "Imagens hero", de: "Hero-Bilder", fr: "Images héro" }),
  "Page header images": text({ en: "Page header images", ur: "صفحہ ہیڈر تصاویر", es: "Imágenes de cabecera", ar: "صور ترويسة الصفحات", tr: "Sayfa başlığı görselleri", hi: "पेज हेडर इमेज", pt: "Imagens de cabeçalho", de: "Seitenkopf-Bilder", fr: "Images d'en-tête" }),
  "Photos per category": text({ en: "Photos per category", ur: "ہر کیٹیگری میں تصاویر", es: "Fotos por categoría", ar: "صور لكل تصنيف", tr: "Kategori başına fotoğraf", hi: "प्रति श्रेणी फोटो", pt: "Fotos por categoria", de: "Fotos pro Kategorie", fr: "Photos par catégorie" }),
  Categories: text({ en: "Categories", ur: "کیٹیگریز", es: "Categorías", ar: "التصنيفات", tr: "Kategoriler", hi: "श्रेणियां", pt: "Categorias", de: "Kategorien", fr: "Catégories" }),
  "Subcategories per category": text({ en: "Subcategories per category", ur: "ہر کیٹیگری میں ذیلی کیٹیگریز", es: "Subcategorías por categoría", ar: "تصنيفات فرعية لكل تصنيف", tr: "Kategori başına alt kategori", hi: "प्रति श्रेणी उपश्रेणियां", pt: "Subcategorias por categoria", de: "Unterkategorien pro Kategorie", fr: "Sous-catégories par catégorie" }),
  Galleries: text({ en: "Galleries", ur: "گیلریز", es: "Galerías", ar: "المعارض", tr: "Galeriler", hi: "गैलरी", pt: "Galerias", de: "Galerien", fr: "Galeries" }),
  "Photos per gallery": text({ en: "Photos per gallery", ur: "ہر گیلری میں تصاویر", es: "Fotos por galería", ar: "صور لكل معرض", tr: "Galeri başına fotoğraf", hi: "प्रति गैलरी फोटो", pt: "Fotos por galeria", de: "Fotos pro Galerie", fr: "Photos par galerie" }),
  Blogs: text({ en: "Blogs", ur: "بلاگز", es: "Blogs", ar: "المدونات", tr: "Bloglar", hi: "ब्लॉग", pt: "Blogs", de: "Blogs", fr: "Blogs" }),
  "Premium themes": text({ en: "Premium themes", ur: "پریمیم تھیمز", es: "Temas premium", ar: "قوالب مميزة", tr: "Premium temalar", hi: "प्रीमियम थीम", pt: "Temas premium", de: "Premium-Themes", fr: "Thèmes premium" }),
  "All premium themes": text({ en: "All premium themes", ur: "تمام پریمیم تھیمز", es: "Todos los temas premium", ar: "كل القوالب المميزة", tr: "Tüm premium temalar", hi: "सभी प्रीमियम थीम", pt: "Todos os temas premium", de: "Alle Premium-Themes", fr: "Tous les thèmes premium" }),
  "Custom domain": text({ en: "Custom domain", ur: "کسٹم ڈومین", es: "Dominio personalizado", ar: "نطاق مخصص", tr: "Özel alan adı", hi: "कस्टम डोमेन", pt: "Domínio personalizado", de: "Eigene Domain", fr: "Domaine personnalisé" }),
  "Custom theme components": text({ en: "Custom theme components", ur: "کسٹم تھیم کمپوننٹس", es: "Componentes de tema personalizados", ar: "مكونات قالب مخصصة", tr: "Özel tema bileşenleri", hi: "कस्टम थीम कंपोनेंट", pt: "Componentes de tema personalizados", de: "Eigene Theme-Komponenten", fr: "Composants de thème personnalisés" }),
  "Admin dashboard": text({ en: "Admin dashboard", ur: "ایڈمن ڈیش بورڈ", es: "Panel de administración", ar: "لوحة التحكم", tr: "Yönetim paneli", hi: "एडमिन डैशबोर्ड", pt: "Painel administrativo", de: "Admin-Dashboard", fr: "Tableau de bord admin" }),
  "Responsive design": text({ en: "Responsive design", ur: "ریسپانسیو ڈیزائن", es: "Diseño adaptable", ar: "تصميم متجاوب", tr: "Duyarlı tasarım", hi: "रिस्पॉन्सिव डिजाइन", pt: "Design responsivo", de: "Responsives Design", fr: "Design responsive" }),
  "Category requests": text({ en: "Category requests", ur: "کیٹیگری درخواستیں", es: "Solicitudes de categorías", ar: "طلبات التصنيفات", tr: "Kategori talepleri", hi: "श्रेणी अनुरोध", pt: "Pedidos de categoria", de: "Kategorieanfragen", fr: "Demandes de catégories" }),
  "Unlimited photos": text({ en: "Unlimited photos", ur: "لامحدود تصاویر", es: "Fotos ilimitadas", ar: "صور غير محدودة", tr: "Sınırsız fotoğraf", hi: "असीमित फोटो", pt: "Fotos ilimitadas", de: "Unbegrenzte Fotos", fr: "Photos illimitées" }),
  "Unlimited hero images": text({ en: "Unlimited hero images", ur: "لامحدود ہیرو تصاویر", es: "Imágenes hero ilimitadas", ar: "صور واجهة غير محدودة", tr: "Sınırsız hero görseli", hi: "असीमित हीरो इमेज", pt: "Imagens hero ilimitadas", de: "Unbegrenzte Hero-Bilder", fr: "Images héro illimitées" }),
  "Unlimited photos per category": text({ en: "Unlimited photos per category", ur: "ہر کیٹیگری میں لامحدود تصاویر", es: "Fotos ilimitadas por categoría", ar: "صور غير محدودة لكل تصنيف", tr: "Kategori başına sınırsız fotoğraf", hi: "प्रति श्रेणी असीमित फोटो", pt: "Fotos ilimitadas por categoria", de: "Unbegrenzte Fotos pro Kategorie", fr: "Photos illimitées par catégorie" }),
  "Unlimited categories": text({ en: "Unlimited categories", ur: "لامحدود کیٹیگریز", es: "Categorías ilimitadas", ar: "تصنيفات غير محدودة", tr: "Sınırsız kategori", hi: "असीमित श्रेणियां", pt: "Categorias ilimitadas", de: "Unbegrenzte Kategorien", fr: "Catégories illimitées" }),
  "Unlimited subcategories": text({ en: "Unlimited subcategories", ur: "لامحدود ذیلی کیٹیگریز", es: "Subcategorías ilimitadas", ar: "تصنيفات فرعية غير محدودة", tr: "Sınırsız alt kategori", hi: "असीमित उपश्रेणियां", pt: "Subcategorias ilimitadas", de: "Unbegrenzte Unterkategorien", fr: "Sous-catégories illimitées" }),
  "Unlimited galleries": text({ en: "Unlimited galleries", ur: "لامحدود گیلریز", es: "Galerías ilimitadas", ar: "معارض غير محدودة", tr: "Sınırsız galeri", hi: "असीमित गैलरी", pt: "Galerias ilimitadas", de: "Unbegrenzte Galerien", fr: "Galeries illimitées" }),
  "Unlimited photos per gallery": text({ en: "Unlimited photos per gallery", ur: "ہر گیلری میں لامحدود تصاویر", es: "Fotos ilimitadas por galería", ar: "صور غير محدودة لكل معرض", tr: "Galeri başına sınırsız fotoğraf", hi: "प्रति गैलरी असीमित फोटो", pt: "Fotos ilimitadas por galeria", de: "Unbegrenzte Fotos pro Galerie", fr: "Photos illimitées par galerie" }),
  "Unlimited blogs": text({ en: "Unlimited blogs", ur: "لامحدود بلاگز", es: "Blogs ilimitados", ar: "مدونات غير محدودة", tr: "Sınırsız blog", hi: "असीमित ब्लॉग", pt: "Blogs ilimitados", de: "Unbegrenzte Blogs", fr: "Blogs illimités" }),
  "Any language": text({ en: "Any language", ur: "کوئی بھی زبان", es: "Cualquier idioma", ar: "أي لغة", tr: "Her dil", hi: "कोई भी भाषा", pt: "Qualquer idioma", de: "Jede Sprache", fr: "Toute langue" }),
  "Free maintenance": text({ en: "Free maintenance", ur: "مفت مینٹیننس", es: "Mantenimiento gratuito", ar: "صيانة مجانية", tr: "Ücretsiz bakım", hi: "मुफ्त रखरखाव", pt: "Manutenção gratuita", de: "Kostenlose Wartung", fr: "Maintenance gratuite" }),
  "More customization": text({ en: "More customization", ur: "مزید کسٹمائزیشن", es: "Más personalización", ar: "تخصيص أكثر", tr: "Daha fazla özelleştirme", hi: "अधिक कस्टमाइजेशन", pt: "Mais personalização", de: "Mehr Anpassung", fr: "Plus de personnalisation" }),
  Gallery: text({ en: "Gallery", ur: "گیلری", es: "Galería", ar: "المعرض", tr: "Galeri", hi: "गैलरी", pt: "Galeria", de: "Galerie", fr: "Galerie" }),
  Blog: text({ en: "Blog", ur: "بلاگ", es: "Blog", ar: "المدونة", tr: "Blog", hi: "ब्लॉग", pt: "Blog", de: "Blog", fr: "Blog" }),
  About: text({ en: "About", ur: "تعارف", es: "Acerca de", ar: "من نحن", tr: "Hakkında", hi: "परिचय", pt: "Sobre", de: "Über uns", fr: "À propos" }),
  Contact: text({ en: "Contact", ur: "رابطہ", es: "Contacto", ar: "اتصل بنا", tr: "İletişim", hi: "संपर्क", pt: "Contato", de: "Kontakt", fr: "Contact" }),
  Pages: text({ en: "Pages", ur: "صفحات", es: "Páginas", ar: "الصفحات", tr: "Sayfalar", hi: "पृष्ठ", pt: "Páginas", de: "Seiten", fr: "Pages" }),
  "Available on request": text({ en: "Available on request", ur: "درخواست پر دستیاب", es: "Disponible bajo petición", ar: "متاح عند الطلب", tr: "Talep üzerine sunulur", hi: "अनुरोध पर उपलब्ध", pt: "Disponível mediante solicitação", de: "Auf Anfrage verfügbar", fr: "Disponible sur demande" }),
  "Social links can be added from Settings.": text({ en: "Social links can be added from Settings.", ur: "سوشل لنکس سیٹنگز سے شامل کیے جا سکتے ہیں۔", es: "Los enlaces sociales se pueden añadir desde Configuración.", ar: "يمكن إضافة روابط التواصل من الإعدادات.", tr: "Sosyal bağlantılar Ayarlar'dan eklenebilir.", hi: "सोशल लिंक सेटिंग्स से जोड़े जा सकते हैं।", pt: "Os links sociais podem ser adicionados nas Configurações.", de: "Social-Media-Links können in den Einstellungen hinzugefügt werden.", fr: "Les liens sociaux peuvent être ajoutés dans les paramètres." }),
  "Published with Photaaz": text({ en: "Published with Photaaz", ur: "Photaaz کے ساتھ شائع شدہ", es: "Publicado con Photaaz", ar: "نُشر باستخدام Photaaz", tr: "Photaaz ile yayınlandı", hi: "Photaaz के साथ प्रकाशित", pt: "Publicado com Photaaz", de: "Mit Photaaz veröffentlicht", fr: "Publié avec Photaaz" }),
  "more features": text({ en: "more features", ur: "مزید فیچرز", es: "funciones más", ar: "ميزات إضافية", tr: "özellik daha", hi: "और सुविधाएं", pt: "mais recursos", de: "weitere Funktionen", fr: "fonctionnalités de plus" })
};

export function translatePlatformLiteral(value: string | null | undefined, locale: AppLocale): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  const direct = platformLiterals[trimmed];
  if (direct) {
    return direct[locale] ?? direct.en;
  }

  const withCount = trimmed.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (withCount) {
    const label = translatePlatformLiteral(withCount[1], locale);
    return `${label} (${withCount[2]})`;
  }

  const withColon = trimmed.match(/^(.+?):\s*(.+)$/);
  if (withColon) {
    const label = translatePlatformLiteral(withColon[1], locale);
    return `${label}: ${withColon[2]}`;
  }

  return value;
}

export function translateMoreFeatures(count: number, locale: AppLocale) {
  return `+ ${count} ${translatePlatformLiteral("more features", locale)}`;
}
