import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { LocalizedString, LocalizedStringList } from "@/services/platform/platform-data";

type LocalizedStringArray = string[] | Record<string, string[]>;

export type PlatformBlogArticle = {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  coverImage: string;
  publishedAt: string;
  readTime: LocalizedString;
  keywords: LocalizedStringList;
  sections: Array<{
    heading: LocalizedString;
    body: LocalizedStringArray;
  }>;
};

export const platformBlogArticles: PlatformBlogArticle[] = [
  {
    slug: "photography-portfolio-homepage",
    title: {
      en: "What a photography portfolio homepage should show first",
      ur: "فوٹوگرافی پورٹ فولیو ہوم پیج پر پہلے کیا دکھانا چاہیے",
      es: "Qué debe mostrar primero la página de inicio de un portafolio fotográfico",
      ar: "ما الذي يجب أن تعرضه صفحة بورتفوليو التصوير أولاً",
      tr: "Bir fotoğraf portfolyosu ana sayfası önce ne göstermeli",
      hi: "फोटोग्राफी पोर्टफोलियो होमपेज पर सबसे पहले क्या दिखना चाहिए",
      pt: "O que a página inicial de um portfólio de fotografia deve mostrar primeiro",
      de: "Was eine Fotografie-Portfolio-Startseite zuerst zeigen sollte",
      fr: "Ce qu’une page d’accueil de portfolio photo doit montrer en premier"
    },
    excerpt: {
      en: "A practical homepage structure for photographers who want visitors to understand their style quickly.",
      ur: "فوٹوگرافرز کے لیے ایک عملی ہوم پیج ڈھانچہ تاکہ وزیٹرز جلدی آپ کا انداز سمجھ سکیں۔",
      es: "Una estructura práctica para fotógrafos que quieren que los visitantes entiendan rápido su estilo.",
      ar: "هيكل عملي للصفحة الرئيسية يساعد الزوار على فهم أسلوب المصور بسرعة.",
      tr: "Ziyaretçilerin tarzınızı hızlıca anlaması için pratik bir ana sayfa yapısı.",
      hi: "ऐसी व्यावहारिक होमपेज संरचना जिससे विज़िटर आपका स्टाइल जल्दी समझ सकें।",
      pt: "Uma estrutura prática para fotógrafos que querem que visitantes entendam seu estilo rapidamente.",
      de: "Eine praktische Startseitenstruktur, damit Besucher den Stil eines Fotografen schnell verstehen.",
      fr: "Une structure pratique pour aider les visiteurs à comprendre rapidement le style du photographe."
    },
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=90",
    publishedAt: "2026-07-01",
    readTime: {
      en: "4 min read",
      ur: "4 منٹ پڑھائی",
      es: "4 min de lectura",
      ar: "قراءة 4 دقائق",
      tr: "4 dk okuma",
      hi: "4 मिनट पढ़ें",
      pt: "4 min de leitura",
      de: "4 Min. Lesezeit",
      fr: "4 min de lecture"
    },
    keywords: {
      en: ["photography portfolio", "portfolio homepage", "photographer website", "gallery layout"],
      ur: ["فوٹوگرافی پورٹ فولیو", "پورٹ فولیو ہوم پیج", "فوٹوگرافر ویب سائٹ", "گیلری لے آؤٹ"],
      es: ["portafolio fotográfico", "inicio de portafolio", "sitio para fotógrafos", "diseño de galería"],
      ar: ["بورتفوليو تصوير", "صفحة بداية البورتفوليو", "موقع مصور", "تصميم معرض"],
      tr: ["fotoğraf portfolyosu", "portfolyo ana sayfası", "fotoğrafçı web sitesi", "galeri düzeni"],
      hi: ["फोटोग्राफी पोर्टफोलियो", "पोर्टफोलियो होमपेज", "फोटोग्राफर वेबसाइट", "गैलरी लेआउट"],
      pt: ["portfólio de fotografia", "página inicial de portfólio", "site para fotógrafos", "layout de galeria"],
      de: ["Fotografie Portfolio", "Portfolio Startseite", "Fotografen Website", "Galerie Layout"],
      fr: ["portfolio photo", "page d’accueil portfolio", "site photographe", "mise en page galerie"]
    },
    sections: [
      {
        heading: {
          en: "Start with the strongest visual signal",
          ur: "سب سے مضبوط بصری تاثر سے شروع کریں",
          es: "Empieza con la señal visual más fuerte",
          ar: "ابدأ بأقوى إشارة بصرية",
          tr: "En güçlü görsel sinyalle başlayın",
          hi: "सबसे मजबूत विज़ुअल संकेत से शुरुआत करें",
          pt: "Comece pelo sinal visual mais forte",
          de: "Beginne mit dem stärksten visuellen Signal",
          fr: "Commencez par le signal visuel le plus fort"
        },
        body: {
          en: [
            "A photography website should not make visitors hunt for the photographer's style. The first screen should show a clear image direction, the photographer name, and a simple path into galleries or contact.",
            "This is why Photaaz themes treat the hero, gallery preview, and category structure as connected parts of the same portfolio experience."
          ],
          ur: [
            "فوٹوگرافی ویب سائٹ کو وزیٹرز سے فوٹوگرافر کا انداز تلاش نہیں کروانا چاہیے۔ پہلی اسکرین پر واضح تصویری سمت، فوٹوگرافر کا نام، اور گیلریز یا رابطے تک آسان راستہ ہونا چاہیے۔",
            "اسی لیے Photaaz تھیمز میں ہیرو، گیلری پری ویو، اور کیٹیگری ڈھانچہ ایک ہی پورٹ فولیو تجربے کے جڑے ہوئے حصے ہیں۔"
          ],
          es: [
            "Un sitio de fotografía no debe obligar al visitante a buscar el estilo del fotógrafo. La primera pantalla debe mostrar una dirección visual clara, el nombre y un camino simple hacia galerías o contacto.",
            "Por eso los temas de Photaaz conectan el hero, la vista previa de galerías y la estructura de categorías dentro de una misma experiencia."
          ],
          ar: [
            "لا ينبغي لموقع التصوير أن يجعل الزائر يبحث عن أسلوب المصور. يجب أن تعرض الشاشة الأولى اتجاهاً بصرياً واضحاً واسم المصور ومساراً بسيطاً إلى المعارض أو التواصل.",
            "لهذا تتعامل قوالب Photaaz مع البطل ومعاينة المعرض وبنية التصنيفات كأجزاء متصلة من تجربة بورتفوليو واحدة."
          ],
          tr: [
            "Bir fotoğraf sitesi ziyaretçiyi fotoğrafçının tarzını aramak zorunda bırakmamalıdır. İlk ekran net bir görsel yön, fotoğrafçı adı ve galeri ya da iletişime basit bir yol göstermelidir.",
            "Bu yüzden Photaaz temaları hero alanını, galeri önizlemesini ve kategori yapısını aynı portfolyo deneyiminin parçaları olarak ele alır."
          ],
          hi: [
            "फोटोग्राफी वेबसाइट में विज़िटर को फोटोग्राफर का स्टाइल खोजने पर मजबूर नहीं करना चाहिए। पहली स्क्रीन में साफ विज़ुअल दिशा, नाम और गैलरी या संपर्क तक आसान रास्ता होना चाहिए।",
            "इसीलिए Photaaz थीम्स हीरो, गैलरी प्रीव्यू और कैटेगरी संरचना को एक ही पोर्टफोलियो अनुभव के जुड़े हिस्से मानती हैं।"
          ],
          pt: [
            "Um site de fotografia não deve fazer o visitante procurar o estilo do fotógrafo. A primeira tela deve mostrar uma direção visual clara, o nome e um caminho simples para galerias ou contato.",
            "Por isso os temas Photaaz tratam o hero, a prévia de galerias e a estrutura de categorias como partes da mesma experiência de portfólio."
          ],
          de: [
            "Eine Fotografie-Website sollte Besucher nicht nach dem Stil suchen lassen. Der erste Bildschirm braucht eine klare visuelle Richtung, den Namen und einen einfachen Weg zu Galerien oder Kontakt.",
            "Deshalb verbinden Photaaz-Themes Hero, Galerie-Vorschau und Kategorien zu einer gemeinsamen Portfolio-Erfahrung."
          ],
          fr: [
            "Un site photo ne doit pas obliger le visiteur à chercher le style du photographe. Le premier écran doit montrer une direction visuelle claire, le nom et un accès simple aux galeries ou au contact.",
            "C’est pourquoi les thèmes Photaaz relient le hero, l’aperçu des galeries et la structure des catégories dans une même expérience."
          ]
        }
      },
      {
        heading: {
          en: "Keep the first actions simple",
          ur: "ابتدائی ایکشنز سادہ رکھیں",
          es: "Mantén simples las primeras acciones",
          ar: "اجعل الإجراءات الأولى بسيطة",
          tr: "İlk eylemleri basit tutun",
          hi: "शुरुआती एक्शन सरल रखें",
          pt: "Mantenha as primeiras ações simples",
          de: "Halte die ersten Aktionen einfach",
          fr: "Gardez les premières actions simples"
        },
        body: {
          en: [
            "Most visitors need one of three routes: view work, understand the photographer, or send an inquiry. A clean nav and a focused contact section help more than a crowded homepage.",
            "For newer photographers, categories are useful. For established studios, galleries and featured stories usually work better."
          ],
          ur: [
            "زیادہ تر وزیٹرز کو تین راستوں میں سے ایک چاہیے ہوتا ہے: کام دیکھنا، فوٹوگرافر کو سمجھنا، یا انکوائری بھیجنا۔ صاف نیویگیشن اور فوکسڈ رابطہ سیکشن ایک بھری ہوئی ہوم پیج سے بہتر کام کرتے ہیں۔",
            "نئے فوٹوگرافرز کے لیے کیٹیگریز مددگار ہوتی ہیں۔ قائم شدہ اسٹوڈیوز کے لیے گیلریز اور فیچرڈ اسٹوریز عموماً بہتر کام کرتی ہیں۔"
          ],
          es: [
            "La mayoría de visitantes necesita una de tres rutas: ver el trabajo, entender al fotógrafo o enviar una consulta. Una navegación limpia y una sección de contacto enfocada ayudan más que una página saturada.",
            "Para fotógrafos nuevos, las categorías ayudan. Para estudios establecidos, las galerías y las historias destacadas suelen funcionar mejor."
          ],
          ar: [
            "غالباً يحتاج الزائر إلى واحد من ثلاثة مسارات: مشاهدة الأعمال، فهم المصور، أو إرسال استفسار. التنقل الواضح وقسم التواصل المركز أفضل من صفحة مزدحمة.",
            "للمصورين الجدد تكون التصنيفات مفيدة. أما الاستوديوهات القائمة فتعمل معها المعارض والقصص المميزة غالباً بشكل أفضل."
          ],
          tr: [
            "Çoğu ziyaretçi üç yoldan birini ister: işi görmek, fotoğrafçıyı tanımak veya soru göndermek. Temiz navigasyon ve odaklı iletişim alanı kalabalık bir ana sayfadan daha iyi çalışır.",
            "Yeni fotoğrafçılar için kategoriler faydalıdır. Yerleşik stüdyolar için galeriler ve öne çıkan hikayeler genellikle daha iyi sonuç verir."
          ],
          hi: [
            "अधिकतर विज़िटर तीन में से एक रास्ता चाहते हैं: काम देखना, फोटोग्राफर को समझना या पूछताछ भेजना। साफ नेविगेशन और केंद्रित संपर्क सेक्शन भीड़भाड़ वाले होमपेज से बेहतर हैं।",
            "नए फोटोग्राफरों के लिए कैटेगरी उपयोगी हैं। स्थापित स्टूडियो के लिए गैलरी और फीचर्ड स्टोरीज़ अक्सर बेहतर काम करती हैं।"
          ],
          pt: [
            "A maioria dos visitantes precisa de uma destas rotas: ver o trabalho, entender o fotógrafo ou enviar uma consulta. Uma navegação limpa e contato focado ajudam mais do que uma página cheia.",
            "Para fotógrafos novos, categorias ajudam. Para estúdios estabelecidos, galerias e histórias em destaque costumam funcionar melhor."
          ],
          de: [
            "Die meisten Besucher brauchen einen von drei Wegen: Arbeiten ansehen, den Fotografen verstehen oder eine Anfrage senden. Klare Navigation und ein fokussierter Kontaktbereich helfen mehr als eine überladene Startseite.",
            "Für neue Fotografen sind Kategorien hilfreich. Für etablierte Studios funktionieren Galerien und ausgewählte Geschichten oft besser."
          ],
          fr: [
            "La plupart des visiteurs veulent l’un de trois chemins : voir le travail, comprendre le photographe ou envoyer une demande. Une navigation claire et un contact ciblé valent mieux qu’une page chargée.",
            "Pour les nouveaux photographes, les catégories aident. Pour les studios établis, les galeries et les histoires sélectionnées fonctionnent souvent mieux."
          ]
        }
      }
    ]
  },
  {
    slug: "categories-vs-galleries",
    title: {
      en: "Categories and galleries are not the same thing",
      ur: "کیٹیگریز اور گیلریز ایک جیسی چیز نہیں ہیں",
      es: "Categorías y galerías no son lo mismo",
      ar: "التصنيفات والمعارض ليست الشيء نفسه",
      tr: "Kategoriler ve galeriler aynı şey değildir",
      hi: "कैटेगरी और गैलरी एक जैसी चीज़ नहीं हैं",
      pt: "Categorias e galerias não são a mesma coisa",
      de: "Kategorien und Galerien sind nicht dasselbe",
      fr: "Catégories et galeries ne sont pas la même chose"
    },
    excerpt: {
      en: "Use categories to organize photos by type, and galleries to curate complete stories or albums.",
      ur: "تصاویر کو قسم کے حساب سے منظم کرنے کے لیے کیٹیگریز استعمال کریں، اور مکمل کہانیاں یا البمز بنانے کے لیے گیلریز۔",
      es: "Usa categorías para ordenar fotos por tipo y galerías para curar historias o álbumes completos.",
      ar: "استخدم التصنيفات لتنظيم الصور حسب النوع، والمعارض لتنسيق قصص أو ألبومات كاملة.",
      tr: "Fotoğrafları türüne göre düzenlemek için kategorileri, tam hikaye veya albüm oluşturmak için galerileri kullanın.",
      hi: "फोटो को प्रकार के अनुसार व्यवस्थित करने के लिए कैटेगरी और पूरी कहानियों या एल्बम के लिए गैलरी इस्तेमाल करें।",
      pt: "Use categorias para organizar fotos por tipo e galerias para montar histórias ou álbuns completos.",
      de: "Nutze Kategorien zur Ordnung nach Art und Galerien für kuratierte Geschichten oder Alben.",
      fr: "Utilisez les catégories pour organiser les photos par type et les galeries pour composer des histoires ou albums complets."
    },
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=90",
    publishedAt: "2026-06-28",
    readTime: {
      en: "5 min read",
      ur: "5 منٹ پڑھائی",
      es: "5 min de lectura",
      ar: "قراءة 5 دقائق",
      tr: "5 dk okuma",
      hi: "5 मिनट पढ़ें",
      pt: "5 min de leitura",
      de: "5 Min. Lesezeit",
      fr: "5 min de lecture"
    },
    keywords: {
      en: ["photo categories", "photo galleries", "portfolio taxonomy", "photographer albums"],
      ur: ["فوٹو کیٹیگریز", "فوٹو گیلریز", "پورٹ فولیو درجہ بندی", "فوٹوگرافر البمز"],
      es: ["categorías de fotos", "galerías de fotos", "taxonomía de portafolio", "álbumes de fotógrafo"],
      ar: ["تصنيفات الصور", "معارض الصور", "تصنيف البورتفوليو", "ألبومات المصور"],
      tr: ["fotoğraf kategorileri", "fotoğraf galerileri", "portfolyo taksonomisi", "fotoğrafçı albümleri"],
      hi: ["फोटो कैटेगरी", "फोटो गैलरी", "पोर्टफोलियो वर्गीकरण", "फोटोग्राफर एल्बम"],
      pt: ["categorias de fotos", "galerias de fotos", "taxonomia de portfólio", "álbuns de fotógrafo"],
      de: ["Fotokategorien", "Fotogalerien", "Portfolio Taxonomie", "Fotografen Alben"],
      fr: ["catégories photo", "galeries photo", "taxonomie portfolio", "albums photographe"]
    },
    sections: [
      {
        heading: {
          en: "Categories describe what the photo is",
          ur: "کیٹیگریز بتاتی ہیں کہ تصویر کس قسم کی ہے",
          es: "Las categorías describen qué es la foto",
          ar: "التصنيفات تصف نوع الصورة",
          tr: "Kategoriler fotoğrafın ne olduğunu anlatır",
          hi: "कैटेगरी बताती है कि फोटो किस प्रकार की है",
          pt: "Categorias descrevem o que a foto é",
          de: "Kategorien beschreiben, was das Foto ist",
          fr: "Les catégories décrivent ce qu’est la photo"
        },
        body: {
          en: [
            "A category is the taxonomy of the work: weddings, wildlife, portraits, travel, or products. Subcategories make sense only when the parent category needs more detail.",
            "This keeps uploads clean because a photographer can select the right category or subcategory when adding a photo."
          ],
          ur: [
            "کیٹیگری کام کی درجہ بندی ہے: ویڈنگز، وائلڈ لائف، پورٹریٹس، ٹریول، یا پروڈکٹس۔ سب کیٹیگریز تب ہی معنی رکھتی ہیں جب پیرنٹ کیٹیگری کو مزید تفصیل چاہیے ہو۔",
            "اس سے اپ لوڈز صاف رہتے ہیں کیونکہ فوٹوگرافر تصویر شامل کرتے وقت درست کیٹیگری یا سب کیٹیگری منتخب کر سکتا ہے۔"
          ],
          es: [
            "Una categoría es la taxonomía del trabajo: bodas, vida salvaje, retratos, viajes o productos. Las subcategorías tienen sentido cuando la categoría principal necesita más detalle.",
            "Así las cargas quedan limpias, porque el fotógrafo selecciona la categoría o subcategoría correcta al añadir una foto."
          ],
          ar: [
            "التصنيف هو طريقة ترتيب العمل: حفلات زفاف، حياة برية، بورتريه، سفر أو منتجات. تكون التصنيفات الفرعية مفيدة عندما يحتاج التصنيف الرئيسي إلى مزيد من التفصيل.",
            "هذا يحافظ على نظافة الرفع لأن المصور يختار التصنيف أو التصنيف الفرعي الصحيح عند إضافة صورة."
          ],
          tr: [
            "Kategori işin sınıflandırmasıdır: düğün, vahşi yaşam, portre, seyahat veya ürün. Alt kategoriler yalnızca ana kategori daha fazla ayrıntı istediğinde anlamlıdır.",
            "Bu, yüklemeleri temiz tutar çünkü fotoğrafçı fotoğraf eklerken doğru kategori veya alt kategoriyi seçebilir."
          ],
          hi: [
            "कैटेगरी काम का वर्गीकरण है: वेडिंग, वाइल्डलाइफ, पोर्ट्रेट, ट्रैवल या प्रोडक्ट। सबकैटेगरी तभी जरूरी है जब मुख्य कैटेगरी को ज्यादा विवरण चाहिए।",
            "इससे अपलोड साफ रहते हैं क्योंकि फोटोग्राफर फोटो जोड़ते समय सही कैटेगरी या सबकैटेगरी चुन सकता है।"
          ],
          pt: [
            "Uma categoria é a taxonomia do trabalho: casamentos, vida selvagem, retratos, viagens ou produtos. Subcategorias fazem sentido quando a categoria principal precisa de mais detalhe.",
            "Isso mantém uploads organizados porque o fotógrafo escolhe a categoria ou subcategoria correta ao adicionar uma foto."
          ],
          de: [
            "Eine Kategorie ist die Einordnung der Arbeit: Hochzeiten, Wildlife, Porträts, Reisen oder Produkte. Unterkategorien ergeben Sinn, wenn die Hauptkategorie mehr Detail braucht.",
            "So bleiben Uploads sauber, weil der Fotograf beim Hinzufügen eines Fotos die passende Kategorie oder Unterkategorie auswählt."
          ],
          fr: [
            "Une catégorie décrit la taxonomie du travail : mariages, wildlife, portraits, voyage ou produits. Les sous-catégories sont utiles lorsque la catégorie parente a besoin de détail.",
            "Cela garde les uploads propres, car le photographe choisit la bonne catégorie ou sous-catégorie en ajoutant une photo."
          ]
        }
      },
      {
        heading: {
          en: "Galleries are curated experiences",
          ur: "گیلریز منتخب کیا ہوا تجربہ ہوتی ہیں",
          es: "Las galerías son experiencias curadas",
          ar: "المعارض تجارب منسقة",
          tr: "Galeriler küratörlü deneyimlerdir",
          hi: "गैलरी क्यूरेटेड अनुभव होती हैं",
          pt: "Galerias são experiências curadas",
          de: "Galerien sind kuratierte Erlebnisse",
          fr: "Les galeries sont des expériences sélectionnées"
        },
        body: {
          en: [
            "A gallery can mix photos from one or more categories to tell a complete visual story. A wedding album, a travel series, or a client campaign can all be galleries.",
            "Separating both concepts makes the public site easier to browse and the dashboard easier to manage."
          ],
          ur: [
            "ایک گیلری ایک یا زیادہ کیٹیگریز کی تصاویر ملا کر مکمل بصری کہانی بنا سکتی ہے۔ ویڈنگ البم، ٹریول سیریز، یا کلائنٹ کمپین سب گیلریز ہو سکتی ہیں۔",
            "دونوں چیزوں کو الگ رکھنے سے پبلک سائٹ براؤز کرنا آسان اور ڈیش بورڈ مینیج کرنا صاف رہتا ہے۔"
          ],
          es: [
            "Una galería puede mezclar fotos de una o más categorías para contar una historia visual completa. Un álbum de boda, una serie de viaje o una campaña pueden ser galerías.",
            "Separar ambos conceptos facilita la navegación pública y hace que el panel sea más claro."
          ],
          ar: [
            "يمكن للمعرض أن يجمع صوراً من تصنيف واحد أو أكثر ليحكي قصة بصرية كاملة. ألبوم زفاف أو سلسلة سفر أو حملة عميل يمكن أن تكون معرضاً.",
            "فصل المفهومين يجعل الموقع العام أسهل للتصفح ولوحة التحكم أسهل للإدارة."
          ],
          tr: [
            "Bir galeri, tam bir görsel hikaye anlatmak için bir veya daha fazla kategoriden fotoğrafları birleştirebilir. Düğün albümü, seyahat serisi veya müşteri kampanyası galeri olabilir.",
            "İki kavramı ayırmak, genel siteyi gezmeyi ve paneli yönetmeyi kolaylaştırır."
          ],
          hi: [
            "एक गैलरी एक या अधिक कैटेगरी की फोटो मिलाकर पूरी विज़ुअल कहानी बना सकती है। वेडिंग एल्बम, ट्रैवल सीरीज़ या क्लाइंट कैंपेन गैलरी हो सकते हैं।",
            "दोनों चीजों को अलग रखने से पब्लिक साइट ब्राउज़ करना और डैशबोर्ड संभालना आसान रहता है।"
          ],
          pt: [
            "Uma galeria pode misturar fotos de uma ou mais categorias para contar uma história visual completa. Álbum de casamento, série de viagem ou campanha de cliente podem ser galerias.",
            "Separar os conceitos torna o site público mais fácil de navegar e o painel mais simples de gerenciar."
          ],
          de: [
            "Eine Galerie kann Fotos aus einer oder mehreren Kategorien mischen, um eine vollständige visuelle Geschichte zu erzählen. Hochzeitsalbum, Reiseserie oder Kundenkampagne können Galerien sein.",
            "Die Trennung beider Konzepte macht die öffentliche Seite leichter zu durchsuchen und das Dashboard leichter zu verwalten."
          ],
          fr: [
            "Une galerie peut mélanger des photos de plusieurs catégories pour raconter une histoire visuelle complète. Album de mariage, série voyage ou campagne client peuvent être des galeries.",
            "Séparer les deux concepts rend le site public plus simple à parcourir et le tableau de bord plus clair."
          ]
        }
      }
    ]
  },
  {
    slug: "seo-for-photographers",
    title: {
      en: "SEO basics every photographer website should handle",
      ur: "ہر فوٹوگرافر ویب سائٹ کے لیے بنیادی SEO",
      es: "Conceptos básicos de SEO para todo sitio de fotógrafo",
      ar: "أساسيات SEO التي يحتاجها كل موقع تصوير",
      tr: "Her fotoğrafçı sitesinin ele alması gereken SEO temelleri",
      hi: "हर फोटोग्राफर वेबसाइट के लिए जरूरी SEO आधार",
      pt: "Fundamentos de SEO para todo site de fotógrafo",
      de: "SEO-Grundlagen für jede Fotografen-Website",
      fr: "Bases SEO pour tout site de photographe"
    },
    excerpt: {
      en: "Titles, descriptions, image context, structured data, and fast pages matter before advanced SEO tactics.",
      ur: "ایڈوانس SEO سے پہلے ٹائٹلز، ڈسکرپشنز، تصویر کا سیاق، اسٹرکچرڈ ڈیٹا، اور تیز صفحات اہم ہیں۔",
      es: "Títulos, descripciones, contexto de imagen, datos estructurados y páginas rápidas importan antes que tácticas avanzadas.",
      ar: "العناوين والأوصاف وسياق الصور والبيانات المنظمة والصفحات السريعة تأتي قبل تكتيكات SEO المتقدمة.",
      tr: "Başlıklar, açıklamalar, görsel bağlam, yapılandırılmış veri ve hızlı sayfalar gelişmiş SEO taktiklerinden önce gelir.",
      hi: "एडवांस SEO से पहले टाइटल, डिस्क्रिप्शन, इमेज संदर्भ, स्ट्रक्चर्ड डेटा और तेज पेज महत्वपूर्ण हैं।",
      pt: "Títulos, descrições, contexto das imagens, dados estruturados e páginas rápidas vêm antes de táticas avançadas.",
      de: "Titel, Beschreibungen, Bildkontext, strukturierte Daten und schnelle Seiten zählen vor fortgeschrittenen SEO-Taktiken.",
      fr: "Titres, descriptions, contexte d’image, données structurées et pages rapides comptent avant les tactiques SEO avancées."
    },
    coverImage: DEFAULT_OG_IMAGE,
    publishedAt: "2026-06-22",
    readTime: {
      en: "6 min read",
      ur: "6 منٹ پڑھائی",
      es: "6 min de lectura",
      ar: "قراءة 6 دقائق",
      tr: "6 dk okuma",
      hi: "6 मिनट पढ़ें",
      pt: "6 min de leitura",
      de: "6 Min. Lesezeit",
      fr: "6 min de lecture"
    },
    keywords: {
      en: ["photographer SEO", "portfolio SEO", "image SEO", "structured data"],
      ur: ["فوٹوگرافر SEO", "پورٹ فولیو SEO", "امیج SEO", "اسٹرکچرڈ ڈیٹا"],
      es: ["SEO para fotógrafos", "SEO de portafolio", "SEO de imágenes", "datos estructurados"],
      ar: ["SEO للمصورين", "SEO للبورتفوليو", "SEO للصور", "بيانات منظمة"],
      tr: ["fotoğrafçı SEO", "portfolyo SEO", "görsel SEO", "yapılandırılmış veri"],
      hi: ["फोटोग्राफर SEO", "पोर्टफोलियो SEO", "इमेज SEO", "स्ट्रक्चर्ड डेटा"],
      pt: ["SEO para fotógrafos", "SEO de portfólio", "SEO de imagem", "dados estruturados"],
      de: ["Fotografen SEO", "Portfolio SEO", "Bild SEO", "strukturierte Daten"],
      fr: ["SEO photographe", "SEO portfolio", "SEO image", "données structurées"]
    },
    sections: [
      {
        heading: {
          en: "Make every public page understandable",
          ur: "ہر پبلک پیج کو قابلِ فہم بنائیں",
          es: "Haz que cada página pública sea comprensible",
          ar: "اجعل كل صفحة عامة مفهومة",
          tr: "Her herkese açık sayfayı anlaşılır yapın",
          hi: "हर सार्वजनिक पेज को समझने योग्य बनाएं",
          pt: "Torne cada página pública compreensível",
          de: "Mache jede öffentliche Seite verständlich",
          fr: "Rendez chaque page publique compréhensible"
        },
        body: {
          en: [
            "A search engine should understand the page purpose from the title, description, URL, headings, and image context. A visitor should understand it even faster.",
            "Portfolio sites need canonical URLs, Open Graph previews, image alt text, and stable page structure for gallery, category, blog, and about pages."
          ],
          ur: [
            "سرچ انجن کو ٹائٹل، ڈسکرپشن، URL، ہیڈنگز، اور تصویر کے سیاق سے پیج کا مقصد سمجھ آنا چاہیے۔ وزیٹر کو یہ اس سے بھی جلدی سمجھ آنا چاہیے۔",
            "پورٹ فولیو سائٹس کو گیلری، کیٹیگری، بلاگ، اور اباؤٹ پیجز کے لیے canonical URLs، Open Graph previews، image alt text، اور مستحکم پیج اسٹرکچر چاہیے۔"
          ],
          es: [
            "Un buscador debe entender el propósito de la página por el título, descripción, URL, encabezados y contexto de imagen. El visitante debe entenderlo aún más rápido.",
            "Los portafolios necesitan URL canónicas, vistas Open Graph, texto alt de imágenes y estructura estable para galería, categoría, blog y acerca de."
          ],
          ar: [
            "يجب أن يفهم محرك البحث غرض الصفحة من العنوان والوصف والرابط والعناوين وسياق الصور. ويجب أن يفهمه الزائر أسرع من ذلك.",
            "تحتاج مواقع البورتفوليو إلى روابط canonical، ومعاينات Open Graph، ونص بديل للصور، وبنية ثابتة لصفحات المعارض والتصنيفات والمدونة والتعريف."
          ],
          tr: [
            "Arama motoru sayfanın amacını başlık, açıklama, URL, başlıklar ve görsel bağlamdan anlamalıdır. Ziyaretçi bunu daha da hızlı anlamalıdır.",
            "Portfolyo siteleri galeri, kategori, blog ve hakkında sayfaları için canonical URL, Open Graph önizlemesi, görsel alt metni ve tutarlı yapı ister."
          ],
          hi: [
            "सर्च इंजन को टाइटल, डिस्क्रिप्शन, URL, हेडिंग और इमेज संदर्भ से पेज का उद्देश्य समझ आना चाहिए। विज़िटर को यह और भी जल्दी समझना चाहिए।",
            "पोर्टफोलियो साइट्स को गैलरी, कैटेगरी, ब्लॉग और अबाउट पेजों के लिए canonical URLs, Open Graph previews, image alt text और स्थिर संरचना चाहिए।"
          ],
          pt: [
            "Um mecanismo de busca deve entender o objetivo da página pelo título, descrição, URL, títulos e contexto das imagens. O visitante deve entender ainda mais rápido.",
            "Sites de portfólio precisam de URLs canônicas, previews Open Graph, alt text de imagens e estrutura estável para galeria, categoria, blog e sobre."
          ],
          de: [
            "Eine Suchmaschine sollte den Zweck der Seite aus Titel, Beschreibung, URL, Überschriften und Bildkontext verstehen. Besucher sollten es noch schneller verstehen.",
            "Portfolio-Seiten brauchen kanonische URLs, Open-Graph-Vorschauen, Bild-Alt-Texte und stabile Seitenstruktur für Galerie, Kategorie, Blog und Über-uns."
          ],
          fr: [
            "Un moteur de recherche doit comprendre l’objectif de la page par le titre, la description, l’URL, les titres et le contexte des images. Le visiteur doit le comprendre plus vite.",
            "Les portfolios ont besoin d’URL canoniques, d’aperçus Open Graph, de textes alternatifs et d’une structure stable pour galerie, catégorie, blog et à propos."
          ]
        }
      },
      {
        heading: {
          en: "Speed is also SEO",
          ur: "رفتار بھی SEO ہے",
          es: "La velocidad también es SEO",
          ar: "السرعة أيضاً جزء من SEO",
          tr: "Hız da SEO’dur",
          hi: "स्पीड भी SEO है",
          pt: "Velocidade também é SEO",
          de: "Geschwindigkeit ist auch SEO",
          fr: "La vitesse fait aussi partie du SEO"
        },
        body: {
          en: [
            "Large photos are the main performance risk in photography websites. Upload limits, image optimization, responsive sizes, and caching are not optional details.",
            "A fast portfolio feels more premium and gives visitors less friction before they reach the contact section."
          ],
          ur: [
            "بڑی تصاویر فوٹوگرافی ویب سائٹس میں کارکردگی کا سب سے بڑا خطرہ ہیں۔ اپ لوڈ لمٹس، امیج آپٹمائزیشن، ریسپانسیو سائزز، اور کیشنگ اختیاری تفصیلات نہیں ہیں۔",
            "تیز پورٹ فولیو زیادہ پریمیم محسوس ہوتا ہے اور وزیٹرز کو رابطہ سیکشن تک پہنچنے سے پہلے کم رکاوٹ دیتا ہے۔"
          ],
          es: [
            "Las fotos pesadas son el principal riesgo de rendimiento en sitios de fotografía. Límites de carga, optimización, tamaños responsivos y caché no son detalles opcionales.",
            "Un portafolio rápido se siente más premium y reduce la fricción antes de que el visitante llegue al contacto."
          ],
          ar: [
            "الصور الكبيرة هي أكبر خطر على أداء مواقع التصوير. حدود الرفع، تحسين الصور، الأحجام المتجاوبة والتخزين المؤقت ليست تفاصيل اختيارية.",
            "البورتفوليو السريع يبدو أكثر تميزاً ويقلل الاحتكاك قبل أن يصل الزائر إلى قسم التواصل."
          ],
          tr: [
            "Büyük fotoğraflar fotoğraf sitelerinde en büyük performans riskidir. Yükleme limitleri, görsel optimizasyonu, responsive boyutlar ve önbellek isteğe bağlı ayrıntılar değildir.",
            "Hızlı portfolyo daha premium hissettirir ve ziyaretçiyi iletişim alanına ulaşmadan önce daha az zorlar."
          ],
          hi: [
            "बड़ी तस्वीरें फोटोग्राफी वेबसाइटों में सबसे बड़ा परफॉर्मेंस जोखिम हैं। अपलोड लिमिट, इमेज ऑप्टिमाइजेशन, responsive sizes और caching वैकल्पिक बातें नहीं हैं।",
            "तेज़ पोर्टफोलियो ज्यादा प्रीमियम महसूस होता है और संपर्क सेक्शन तक पहुंचने से पहले विज़िटर की रुकावट कम करता है।"
          ],
          pt: [
            "Fotos grandes são o maior risco de performance em sites de fotografia. Limites de upload, otimização, tamanhos responsivos e cache não são opcionais.",
            "Um portfólio rápido parece mais premium e cria menos atrito antes do visitante chegar ao contato."
          ],
          de: [
            "Große Fotos sind das größte Performance-Risiko bei Fotografie-Websites. Upload-Limits, Bildoptimierung, responsive Größen und Caching sind keine optionalen Details.",
            "Ein schnelles Portfolio wirkt hochwertiger und erzeugt weniger Reibung, bevor Besucher den Kontaktbereich erreichen."
          ],
          fr: [
            "Les grandes photos sont le principal risque de performance sur les sites photo. Limites d’upload, optimisation, tailles responsives et cache ne sont pas optionnels.",
            "Un portfolio rapide paraît plus premium et réduit la friction avant que le visiteur atteigne le contact."
          ]
        }
      }
    ]
  }
];

export function getPlatformBlogArticles() {
  return platformBlogArticles;
}

export function getPlatformBlogArticle(slug: string) {
  return platformBlogArticles.find((article) => article.slug === slug) ?? null;
}
