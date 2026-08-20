export const platformLocales = ["en", "ur", "es", "ar", "tr", "hi", "pt", "de", "fr"] as const;

export type PlatformCopyLocale = (typeof platformLocales)[number];
export type PlatformCopy = Record<PlatformCopyLocale, string>;

export const platformCopyTranslations: Record<string, PlatformCopy> = {
  Free: { en: "Free", ur: "مفت", es: "Gratis", ar: "مجاني", tr: "Ücretsiz", hi: "मुफ्त", pt: "Grátis", de: "Kostenlos", fr: "Gratuit" },
  Plus: { en: "Plus", ur: "پلس", es: "Plus", ar: "بلس", tr: "Plus", hi: "प्लस", pt: "Plus", de: "Plus", fr: "Plus" },
  Pro: { en: "Pro", ur: "پرو", es: "Pro", ar: "احترافي", tr: "Pro", hi: "प्रो", pt: "Pro", de: "Pro", fr: "Pro" },
  Ownership: { en: "Ownership", ur: "ملکیت", es: "Propiedad", ar: "الملكية", tr: "Sahiplik", hi: "स्वामित्व", pt: "Propriedade", de: "Eigentum", fr: "Propriété" },
  "Portfolio SaaS for photographers": {
    en: "Portfolio SaaS for photographers",
    ur: "فوٹوگرافرز کے لیے پورٹ فولیو پلیٹ فارم",
    es: "SaaS de portafolios para fotógrafos",
    ar: "منصة بورتفوليو للمصورين",
    tr: "Fotoğrafçılar için portfolyo SaaS",
    hi: "फोटोग्राफरों के लिए पोर्टफोलियो SaaS",
    pt: "SaaS de portfólio para fotógrafos",
    de: "Portfolio-SaaS für Fotografen",
    fr: "SaaS de portfolio pour photographes"
  },
  "Create a professional photography website in minutes.": {
    en: "Create a professional photography website in minutes.",
    ur: "چند منٹوں میں اپنی پیشہ ور فوٹوگرافی ویب سائٹ بنائیں۔",
    es: "Crea un sitio web profesional de fotografía en minutos.",
    ar: "أنشئ موقع تصوير احترافياً خلال دقائق.",
    tr: "Dakikalar içinde profesyonel bir fotoğraf sitesi oluşturun.",
    hi: "कुछ ही मिनटों में पेशेवर फोटोग्राफी वेबसाइट बनाएं।",
    pt: "Crie um site profissional de fotografia em minutos.",
    de: "Erstelle in Minuten eine professionelle Fotografie-Website.",
    fr: "Créez un site photo professionnel en quelques minutes."
  },
  "Pick a design, upload your photos, and publish a polished portfolio that presents your work beautifully.": {
    en: "Pick a design, upload your photos, and publish a polished portfolio that presents your work beautifully.",
    ur: "ڈیزائن منتخب کریں، اپنی تصاویر اپ لوڈ کریں، اور ایک صاف پورٹ فولیو شائع کریں جو آپ کا کام خوبصورتی سے دکھائے۔",
    es: "Elige un diseño, sube tus fotos y publica un portafolio cuidado que presente tu trabajo con belleza.",
    ar: "اختر تصميماً، ارفع صورك، وانشر بورتفوليو مصقولاً يعرض عملك بجمال.",
    tr: "Bir tasarım seçin, fotoğraflarınızı yükleyin ve işinizi güzelce sunan temiz bir portfolyo yayınlayın.",
    hi: "डिज़ाइन चुनें, अपनी तस्वीरें अपलोड करें और ऐसा पॉलिश्ड पोर्टफोलियो प्रकाशित करें जो आपका काम खूबसूरती से दिखाए।",
    pt: "Escolha um design, envie suas fotos e publique um portfólio refinado que apresente seu trabalho com beleza.",
    de: "Wähle ein Design, lade Fotos hoch und veröffentliche ein sauberes Portfolio, das deine Arbeit schön präsentiert.",
    fr: "Choisissez un design, importez vos photos et publiez un portfolio soigné qui présente votre travail avec élégance."
  },
  "Start free": {
    en: "Start free",
    ur: "مفت شروع کریں",
    es: "Empieza gratis",
    ar: "ابدأ مجاناً",
    tr: "Ücretsiz başla",
    hi: "मुफ्त शुरू करें",
    pt: "Comece grátis",
    de: "Kostenlos starten",
    fr: "Commencer gratuitement"
  },
  "View themes": {
    en: "View themes",
    ur: "تھیمز دیکھیں",
    es: "Ver temas",
    ar: "عرض القوالب",
    tr: "Temaları görüntüle",
    hi: "थीम देखें",
    pt: "Ver temas",
    de: "Themes ansehen",
    fr: "Voir les thèmes"
  },
  "Photaaz - Professional Photography Websites in Minutes": {
    en: "Photaaz - Professional Photography Websites in Minutes",
    ur: "Photaaz - چند منٹوں میں پیشہ ور فوٹوگرافی ویب سائٹس",
    es: "Photaaz - Sitios web profesionales de fotografía en minutos",
    ar: "Photaaz - مواقع تصوير احترافية خلال دقائق",
    tr: "Photaaz - Dakikalar içinde profesyonel fotoğraf siteleri",
    hi: "Photaaz - मिनटों में पेशेवर फोटोग्राफी वेबसाइटें",
    pt: "Photaaz - Sites profissionais de fotografia em minutos",
    de: "Photaaz - Professionelle Fotografie-Websites in Minuten",
    fr: "Photaaz - Sites photo professionnels en quelques minutes"
  },
  "Launch a polished photography portfolio with themes, galleries, blogs, domains, and admin tools built for photographers.": {
    en: "Launch a polished photography portfolio with themes, galleries, blogs, domains, and admin tools built for photographers.",
    ur: "فوٹوگرافرز کے لیے بنائے گئے تھیمز، گیلریز، بلاگز، ڈومین اور ایڈمن ٹولز کے ساتھ صاف پورٹ فولیو لانچ کریں۔",
    es: "Lanza un portafolio fotográfico cuidado con temas, galerías, blogs, dominio y herramientas de administración para fotógrafos.",
    ar: "أطلق بورتفوليو تصوير مصقولاً مع قوالب ومعارض ومدونات ونطاق وأدوات إدارة للمصورين.",
    tr: "Fotoğrafçılar için hazırlanmış temalar, galeriler, bloglar, alan adı ve yönetim araçlarıyla temiz bir portfolyo yayınlayın.",
    hi: "फोटोग्राफरों के लिए बने थीम, गैलरी, ब्लॉग, डोमेन और एडमिन टूल्स के साथ पॉलिश्ड पोर्टफोलियो लॉन्च करें।",
    pt: "Lance um portfólio fotográfico refinado com temas, galerias, blogs, domínio e ferramentas administrativas para fotógrafos.",
    de: "Starte ein hochwertiges Fotografie-Portfolio mit Themes, Galerien, Blogs, Domain und Admin-Tools für Fotografen.",
    fr: "Lancez un portfolio photo soigné avec thèmes, galeries, blogs, domaine et outils d’administration pour photographes."
  },
  "Questions": {
    en: "Questions",
    ur: "سوالات",
    es: "Preguntas",
    ar: "أسئلة",
    tr: "Sorular",
    hi: "सवाल",
    pt: "Perguntas",
    de: "Fragen",
    fr: "Questions frequentes"
  },
  "Need help choosing the right portfolio setup?": {
    en: "Need help choosing the right portfolio setup?",
    ur: "صحیح پورٹ فولیو سیٹ اپ منتخب کرنے میں مدد چاہیے؟",
    es: "¿Necesitas ayuda para elegir la configuración adecuada?",
    ar: "هل تحتاج مساعدة لاختيار إعداد البورتفوليو المناسب؟",
    tr: "Doğru portfolyo kurulumunu seçmek için yardıma mı ihtiyacınız var?",
    hi: "सही पोर्टफोलियो सेटअप चुनने में मदद चाहिए?",
    pt: "Precisa de ajuda para escolher a configuração certa?",
    de: "Brauchst du Hilfe beim passenden Portfolio-Setup?",
    fr: "Besoin d’aide pour choisir la bonne configuration de portfolio ?"
  },
  "Tell us what kind of photography website you want to launch. We will point you toward the best theme, plan, or domain path.": {
    en: "Tell us what kind of photography website you want to launch. We will point you toward the best theme, plan, or domain path.",
    ur: "ہمیں بتائیں آپ کس قسم کی فوٹوگرافی ویب سائٹ لانچ کرنا چاہتے ہیں۔ ہم آپ کو مناسب تھیم، پلان یا ڈومین راستہ بتائیں گے۔",
    es: "Cuéntanos qué tipo de sitio de fotografía quieres lanzar. Te orientaremos hacia el mejor tema, plan o ruta de dominio.",
    ar: "أخبرنا بنوع موقع التصوير الذي تريد إطلاقه. سنرشدك إلى أفضل قالب أو خطة أو مسار نطاق.",
    tr: "Nasıl bir fotoğraf sitesi yayınlamak istediğinizi anlatın. Sizi en uygun tema, plan veya alan adı yoluna yönlendirelim.",
    hi: "हमें बताएं कि आप किस तरह की फोटोग्राफी वेबसाइट लॉन्च करना चाहते हैं। हम आपको सही थीम, प्लान या डोमेन रास्ता बताएंगे।",
    pt: "Conte que tipo de site de fotografia você quer lançar. Vamos indicar o melhor tema, plano ou caminho de domínio.",
    de: "Sag uns, welche Art Fotografie-Website du starten willst. Wir zeigen dir das passende Theme, den Plan oder Domain-Weg.",
    fr: "Dites-nous quel type de site photo vous voulez lancer. Nous vous guiderons vers le meilleur thème, plan ou domaine."
  },
  "Send question": {
    en: "Send question",
    ur: "سوال بھیجیں",
    es: "Enviar pregunta",
    ar: "إرسال السؤال",
    tr: "Soruyu gönder",
    hi: "सवाल भेजें",
    pt: "Enviar pergunta",
    de: "Frage senden",
    fr: "Envoyer la question"
  },
  "Can I publish without uploading all my photos first?": {
    en: "Can I publish without uploading all my photos first?",
    ur: "کیا میں تمام تصاویر اپ لوڈ کیے بغیر شائع کر سکتا ہوں؟",
    es: "¿Puedo publicar sin subir primero todas mis fotos?",
    ar: "هل يمكنني النشر دون رفع كل صوري أولاً؟",
    tr: "Tüm fotoğraflarımı önce yüklemeden yayınlayabilir miyim?",
    hi: "क्या मैं पहले सभी फोटो अपलोड किए बिना प्रकाशित कर सकता हूं?",
    pt: "Posso publicar sem enviar todas as fotos primeiro?",
    de: "Kann ich veröffentlichen, ohne zuerst alle Fotos hochzuladen?",
    fr: "Puis-je publier sans importer toutes mes photos d’abord ?"
  },
  "Yes. You can start with a theme, starter galleries, and placeholders, then add more work from your dashboard later.": {
    en: "Yes. You can start with a theme, starter galleries, and placeholders, then add more work from your dashboard later.",
    ur: "جی ہاں۔ آپ تھیم، ابتدائی گیلریز اور پلیس ہولڈرز سے شروع کر سکتے ہیں، پھر بعد میں ڈیش بورڈ سے مزید کام شامل کر سکتے ہیں۔",
    es: "Sí. Puedes empezar con un tema, galerías iniciales y marcadores, y luego añadir más trabajo desde el panel.",
    ar: "نعم. يمكنك البدء بقالب ومعارض أولية وعناصر مؤقتة، ثم إضافة المزيد من العمل لاحقاً من لوحة التحكم.",
    tr: "Evet. Bir tema, başlangıç galerileri ve yer tutucularla başlayıp sonra panelden daha fazla iş ekleyebilirsiniz.",
    hi: "हां। आप थीम, शुरुआती गैलरी और प्लेसहोल्डर से शुरू कर सकते हैं, फिर बाद में डैशबोर्ड से और काम जोड़ सकते हैं।",
    pt: "Sim. Você pode começar com um tema, galerias iniciais e placeholders, depois adicionar mais trabalhos pelo painel.",
    de: "Ja. Du kannst mit Theme, Startgalerien und Platzhaltern beginnen und später mehr Arbeit im Dashboard ergänzen.",
    fr: "Oui. Vous pouvez commencer avec un thème, des galeries de départ et des exemples, puis ajouter votre travail depuis le tableau de bord."
  },
  "Can I connect my own domain?": {
    en: "Can I connect my own domain?",
    ur: "کیا میں اپنا ڈومین کنیکٹ کر سکتا ہوں؟",
    es: "¿Puedo conectar mi propio dominio?",
    ar: "هل يمكنني ربط نطاقي الخاص؟",
    tr: "Kendi alan adımı bağlayabilir miyim?",
    hi: "क्या मैं अपना डोमेन कनेक्ट कर सकता हूं?",
    pt: "Posso conectar meu próprio domínio?",
    de: "Kann ich meine eigene Domain verbinden?",
    fr: "Puis-je connecter mon propre domaine ?"
  },
  "You can begin with a free Photaaz subdomain. Custom domain connection can be managed from the dashboard on supported packages.": {
    en: "You can begin with a free Photaaz subdomain. Custom domain connection can be managed from the dashboard on supported packages.",
    ur: "آپ مفت Photaaz سب ڈومین سے شروع کر سکتے ہیں۔ سپورٹڈ پیکجز پر کسٹم ڈومین ڈیش بورڈ سے منیج کیا جا سکتا ہے۔",
    es: "Puedes empezar con un subdominio gratuito de Photaaz. El dominio personalizado se gestiona desde el panel en planes compatibles.",
    ar: "يمكنك البدء بنطاق فرعي مجاني من Photaaz. يمكن إدارة النطاق المخصص من لوحة التحكم في الباقات المدعومة.",
    tr: "Ücretsiz bir Photaaz alt alan adıyla başlayabilirsiniz. Desteklenen paketlerde özel alan adı panelden yönetilir.",
    hi: "आप मुफ्त Photaaz सबडोमेन से शुरू कर सकते हैं। समर्थित पैकेज में कस्टम डोमेन डैशबोर्ड से मैनेज होता है।",
    pt: "Você pode começar com um subdomínio gratuito Photaaz. O domínio personalizado é gerenciado no painel em planos compatíveis.",
    de: "Du kannst mit einer kostenlosen Photaaz-Subdomain starten. Eigene Domains verwaltest du im Dashboard bei passenden Paketen.",
    fr: "Vous pouvez commencer avec un sous-domaine Photaaz gratuit. Le domaine personnalisé se gère depuis le tableau de bord sur les offres compatibles."
  },
  "Are translations included?": {
    en: "Are translations included?",
    ur: "کیا تراجم شامل ہیں؟",
    es: "¿Se incluyen traducciones?",
    ar: "هل الترجمات مشمولة؟",
    tr: "Çeviriler dahil mi?",
    hi: "क्या अनुवाद शामिल हैं?",
    pt: "As traduções estão incluídas?",
    de: "Sind Übersetzungen enthalten?",
    fr: "Les traductions sont-elles incluses ?"
  },
  "Translations are available only for predefined supported languages and may have separate charges set by the platform.": {
    en: "Translations are available only for predefined supported languages and may have separate charges set by the platform.",
    ur: "تراجم صرف پہلے سے طے شدہ سپورٹڈ زبانوں کے لیے دستیاب ہیں اور ان کے لیے پلیٹ فارم الگ چارجز رکھ سکتا ہے۔",
    es: "Las traducciones solo están disponibles para idiomas compatibles predefinidos y pueden tener cargos separados.",
    ar: "الترجمات متاحة فقط للغات المدعومة مسبقاً وقد تكون لها رسوم منفصلة يحددها النظام.",
    tr: "Çeviriler yalnızca önceden desteklenen diller için sunulur ve platform ayrı ücret belirleyebilir.",
    hi: "अनुवाद केवल पहले से समर्थित भाषाओं के लिए उपलब्ध हैं और इनके लिए अलग शुल्क हो सकता है।",
    pt: "As traduções estão disponíveis apenas para idiomas suportados predefinidos e podem ter cobrança separada.",
    de: "Übersetzungen sind nur für vordefinierte unterstützte Sprachen verfügbar und können separat berechnet werden.",
    fr: "Les traductions sont disponibles uniquement pour les langues prises en charge et peuvent être facturées séparément."
  },
  "New portfolio themes": {
    en: "New portfolio themes",
    ur: "نئی پورٹ فولیو تھیمز",
    es: "Nuevos temas de portafolio",
    ar: "قوالب بورتفوليو جديدة",
    tr: "Yeni portfolyo temaları",
    hi: "नई पोर्टफोलियो थीम",
    pt: "Novos temas de portfólio",
    de: "Neue Portfolio-Themes",
    fr: "Nouveaux thèmes de portfolio"
  },
  "Explore the latest theme previews and choose a layout before creating your site.": {
    en: "Explore the latest theme previews and choose a layout before creating your site.",
    ur: "اپنی سائٹ بنانے سے پہلے تازہ تھیم پری ویوز دیکھیں اور ایک لے آؤٹ منتخب کریں۔",
    es: "Explora las últimas vistas previas de temas y elige un diseño antes de crear tu sitio.",
    ar: "استعرض أحدث معاينات القوالب واختر تخطيطاً قبل إنشاء موقعك.",
    tr: "Sitenizi oluşturmadan önce en yeni tema önizlemelerini keşfedin ve bir düzen seçin.",
    hi: "अपनी साइट बनाने से पहले नवीनतम थीम प्रीव्यू देखें और लेआउट चुनें।",
    pt: "Explore as prévias mais recentes de temas e escolha um layout antes de criar seu site.",
    de: "Entdecke die neuesten Theme-Vorschauen und wähle ein Layout, bevor du deine Website erstellst.",
    fr: "Explorez les derniers aperçus de thèmes et choisissez une mise en page avant de créer votre site."
  },
  "Photaaz MVP": {
    en: "Photaaz MVP",
    ur: "Photaaz MVP",
    es: "MVP de Photaaz",
    ar: "Photaaz MVP",
    tr: "Photaaz MVP",
    hi: "Photaaz MVP",
    pt: "MVP do Photaaz",
    de: "Photaaz MVP",
    fr: "MVP Photaaz"
  },
  "Your photography SaaS foundation is ready for onboarding and upload flows.": {
    en: "Your photography SaaS foundation is ready for onboarding and upload flows.",
    ur: "آپ کی فوٹوگرافی SaaS بنیاد آن بورڈنگ اور اپ لوڈ فلو کے لیے تیار ہے۔",
    es: "La base de tu SaaS de fotografia esta lista para los flujos de onboarding y subida.",
    ar: "أساس SaaS للتصوير جاهز لتدفقات الإعداد والتحميل.",
    tr: "Fotograf SaaS temeliniz onboarding ve yukleme akislari icin hazir.",
    hi: "आपका फोटोग्राफी SaaS आधार ऑनबोर्डिंग और अपलोड फ्लो के लिए तैयार है।",
    pt: "A base do seu SaaS de fotografia esta pronta para onboarding e uploads.",
    de: "Deine Fotografie-SaaS-Basis ist bereit fuer Onboarding- und Upload-Ablaufe.",
    fr: "La base de votre SaaS photo est prete pour les parcours d'inscription et d'import."
  },
  "Showcase your work beautifully": {
    en: "Showcase your work beautifully",
    ur: "اپنا کام خوبصورتی سے دکھائیں",
    es: "Muestra tu trabajo con belleza",
    ar: "اعرض عملك بجمال",
    tr: "İşinizi güzelce sergileyin",
    hi: "अपना काम खूबसूरती से दिखाएं",
    pt: "Mostre seu trabalho com beleza",
    de: "Präsentiere deine Arbeit schön",
    fr: "Présentez votre travail avec élégance"
  },
  "Create a portfolio that feels intentional, premium, and built around your photography.": {
    en: "Create a portfolio that feels intentional, premium, and built around your photography.",
    ur: "ایسا پورٹ فولیو بنائیں جو با مقصد، پریمیم، اور آپ کی فوٹوگرافی کے گرد بنایا گیا محسوس ہو۔",
    es: "Crea un portafolio que se sienta intencional, premium y construido alrededor de tu fotografía.",
    ar: "أنشئ بورتفوليو يبدو مقصوداً واحترافياً ومبنياً حول تصويرك.",
    tr: "Fotoğrafçılığınız etrafında tasarlanmış, bilinçli ve premium hissettiren bir portfolyo oluşturun.",
    hi: "ऐसा पोर्टफोलियो बनाएं जो उद्देश्यपूर्ण, प्रीमियम और आपकी फोटोग्राफी के अनुसार बना हुआ लगे।",
    pt: "Crie um portfólio intencional, premium e construído em torno da sua fotografia.",
    de: "Erstelle ein Portfolio, das bewusst, hochwertig und auf deine Fotografie abgestimmt wirkt.",
    fr: "Créez un portfolio intentionnel, premium et construit autour de votre photographie."
  },
  "Present pages clearly": {
    en: "Present pages clearly",
    ur: "صفحات واضح انداز میں پیش کریں",
    es: "Presenta las páginas con claridad",
    ar: "اعرض الصفحات بوضوح",
    tr: "Sayfaları net sunun",
    hi: "पेज साफ तरीके से प्रस्तुत करें",
    pt: "Apresente páginas com clareza",
    de: "Stelle Seiten klar dar",
    fr: "Présentez les pages clairement"
  },
  "Publish clean, structured pages and stories that make your work easy to browse and share.": {
    en: "Publish clean, structured pages and stories that make your work easy to browse and share.",
    ur: "صاف اور منظم صفحات اور کہانیاں شائع کریں تاکہ آپ کا کام دیکھنا اور شیئر کرنا آسان ہو۔",
    es: "Publica páginas e historias limpias y estructuradas que faciliten explorar y compartir tu trabajo.",
    ar: "انشر صفحاتاً وقصصاً نظيفة ومنظمة تجعل عملك سهلاً للتصفح والمشاركة.",
    tr: "İşinizi gezmeyi ve paylaşmayı kolaylaştıran temiz, düzenli sayfalar ve hikayeler yayınlayın.",
    hi: "साफ और व्यवस्थित पेज व कहानियां प्रकाशित करें ताकि आपका काम देखना और साझा करना आसान हो।",
    pt: "Publique páginas e histórias limpas e estruturadas que facilitem navegar e compartilhar seu trabalho.",
    de: "Veröffentliche klare, strukturierte Seiten und Geschichten, die deine Arbeit leicht auffindbar und teilbar machen.",
    fr: "Publiez des pages et histoires claires et structurées qui rendent votre travail facile à parcourir et partager."
  },
  "Connect your own domain": {
    en: "Connect your own domain",
    ur: "اپنا ڈومین کنیکٹ کریں",
    es: "Conecta tu propio dominio",
    ar: "اربط نطاقك الخاص",
    tr: "Kendi alan adınızı bağlayın",
    hi: "अपना डोमेन कनेक्ट करें",
    pt: "Conecte seu próprio domínio",
    de: "Verbinde deine eigene Domain",
    fr: "Connectez votre propre domaine"
  },
  "Use a free subdomain first, then connect your professional domain when ready.": {
    en: "Use a free subdomain first, then connect your professional domain when ready.",
    ur: "پہلے مفت سب ڈومین استعمال کریں، پھر تیار ہونے پر اپنا پروفیشنل ڈومین کنیکٹ کریں۔",
    es: "Usa primero un subdominio gratuito y conecta tu dominio profesional cuando esté listo.",
    ar: "استخدم نطاقاً فرعياً مجانياً أولاً، ثم اربط نطاقك الاحترافي عندما تكون جاهزاً.",
    tr: "Önce ücretsiz bir alt alan adı kullanın, hazır olduğunuzda profesyonel alan adınızı bağlayın.",
    hi: "पहले मुफ्त सबडोमेन इस्तेमाल करें, फिर तैयार होने पर अपना प्रोफेशनल डोमेन जोड़ें।",
    pt: "Use primeiro um subdomínio gratuito e conecte seu domínio profissional quando estiver pronto.",
    de: "Nutze zuerst eine kostenlose Subdomain und verbinde später deine professionelle Domain.",
    fr: "Utilisez d’abord un sous-domaine gratuit, puis connectez votre domaine professionnel quand vous êtes prêt."
  },
  "Publish blogs and stories": {
    en: "Publish blogs and stories",
    ur: "بلاگز اور کہانیاں شائع کریں",
    es: "Publica blogs e historias",
    ar: "انشر المدونات والقصص",
    tr: "Bloglar ve hikayeler yayınlayın",
    hi: "ब्लॉग और कहानियां प्रकाशित करें",
    pt: "Publique blogs e histórias",
    de: "Veröffentliche Blogs und Geschichten",
    fr: "Publiez blogs et histoires"
  },
  "Share shoots, travel journals, behind-the-scenes notes, and updates from one place.": {
    en: "Share shoots, travel journals, behind-the-scenes notes, and updates from one place.",
    ur: "شوٹ، ٹریول جرنلز، پردے کے پیچھے نوٹس، اور اپ ڈیٹس ایک ہی جگہ سے شیئر کریں۔",
    es: "Comparte sesiones, diarios de viaje, notas detrás de cámaras y novedades desde un solo lugar.",
    ar: "شارك الجلسات ومذكرات السفر وملاحظات الكواليس والتحديثات من مكان واحد.",
    tr: "Çekimleri, seyahat günlüklerini, kamera arkası notları ve güncellemeleri tek yerden paylaşın.",
    hi: "शूट, यात्रा जर्नल, पर्दे के पीछे की बातें और अपडेट एक ही जगह से साझा करें।",
    pt: "Compartilhe ensaios, diários de viagem, bastidores e atualizações de um só lugar.",
    de: "Teile Shootings, Reisejournale, Behind-the-Scenes-Notizen und Updates an einem Ort.",
    fr: "Partagez séances, carnets de voyage, coulisses et mises à jour depuis un seul endroit."
  },
  "Manage your portfolio content": {
    en: "Manage your portfolio content",
    ur: "اپنا پورٹ فولیو مواد مینیج کریں",
    es: "Gestiona el contenido de tu portafolio",
    ar: "أدر محتوى بورتفوليوك",
    tr: "Portfolyo içeriğinizi yönetin",
    hi: "अपना पोर्टफोलियो कंटेंट प्रबंधित करें",
    pt: "Gerencie o conteúdo do seu portfólio",
    de: "Verwalte deine Portfolio-Inhalte",
    fr: "Gérez le contenu de votre portfolio"
  },
  "Keep galleries, pages, themes, contact details, and publishing settings together.": {
    en: "Keep galleries, pages, themes, contact details, and publishing settings together.",
    ur: "گیلریز، صفحات، تھیمز، رابطہ تفصیلات، اور پبلشنگ سیٹنگز ایک جگہ رکھیں۔",
    es: "Mantén galerías, páginas, temas, contactos y ajustes de publicación en un solo lugar.",
    ar: "اجمع المعارض والصفحات والقوالب وبيانات التواصل وإعدادات النشر في مكان واحد.",
    tr: "Galerileri, sayfaları, temaları, iletişim bilgilerini ve yayın ayarlarını bir arada tutun.",
    hi: "गैलरी, पेज, थीम, संपर्क विवरण और पब्लिशिंग सेटिंग्स को एक जगह रखें।",
    pt: "Mantenha galerias, páginas, temas, contatos e configurações de publicação juntos.",
    de: "Halte Galerien, Seiten, Themes, Kontaktdaten und Veröffentlichungseinstellungen zusammen.",
    fr: "Gardez galeries, pages, thèmes, contacts et réglages de publication au même endroit."
  },
  "Unlock more presentation options": {
    en: "Unlock more presentation options",
    ur: "مزید پریزنٹیشن آپشنز کھولیں",
    es: "Desbloquea más opciones de presentación",
    ar: "افتح خيارات عرض أكثر",
    tr: "Daha fazla sunum seçeneği açın",
    hi: "अधिक प्रस्तुति विकल्प खोलें",
    pt: "Desbloqueie mais opções de apresentação",
    de: "Schalte mehr Präsentationsoptionen frei",
    fr: "Débloquez plus d’options de présentation"
  },
  "Start free and upgrade when you need more room, a custom domain, or premium themes.": {
    en: "Start free and upgrade when you need more room, a custom domain, or premium themes.",
    ur: "مفت شروع کریں اور جب مزید جگہ، کسٹم ڈومین، یا پریمیم تھیمز چاہئیں تو اپ گریڈ کریں۔",
    es: "Empieza gratis y mejora cuando necesites más espacio, dominio propio o temas premium.",
    ar: "ابدأ مجاناً وقم بالترقية عندما تحتاج مساحة أكبر أو نطاقاً خاصاً أو قوالب مميزة.",
    tr: "Ücretsiz başlayın; daha fazla alan, özel alan adı veya premium tema gerektiğinde yükseltin.",
    hi: "मुफ्त शुरू करें और अधिक जगह, कस्टम डोमेन या प्रीमियम थीम की जरूरत पर अपग्रेड करें।",
    pt: "Comece grátis e faça upgrade quando precisar de mais espaço, domínio próprio ou temas premium.",
    de: "Starte kostenlos und upgrade, wenn du mehr Platz, eine eigene Domain oder Premium-Themes brauchst.",
    fr: "Commencez gratuitement puis évoluez quand vous avez besoin de plus d’espace, d’un domaine ou de thèmes premium."
  },
  "For starting a simple public portfolio.": {
    en: "For starting a simple public portfolio.",
    ur: "ایک سادہ پبلک پورٹ فولیو شروع کرنے کے لیے۔",
    es: "Para empezar un portafolio público sencillo.",
    ar: "لبدء بورتفوليو عام بسيط.",
    tr: "Basit bir herkese açık portfolyo başlatmak için.",
    hi: "एक सरल सार्वजनिक पोर्टफोलियो शुरू करने के लिए।",
    pt: "Para começar um portfólio público simples.",
    de: "Für den Start eines einfachen öffentlichen Portfolios.",
    fr: "Pour lancer un portfolio public simple."
  },
  "For photographers who need a custom domain, more content, and richer presentation controls.": {
    en: "For photographers who need a custom domain, more content, and richer presentation controls.",
    ur: "ان فوٹوگرافرز کے لیے جنہیں کسٹم ڈومین، زیادہ مواد، اور بہتر پریزنٹیشن کنٹرولز چاہئیں۔",
    es: "Para fotógrafos que necesitan dominio propio, más contenido y controles de presentación más completos.",
    ar: "للمصورين الذين يحتاجون نطاقاً خاصاً ومحتوى أكثر وتحكماً أوسع في العرض.",
    tr: "Özel alan adı, daha fazla içerik ve gelişmiş sunum kontrolleri isteyen fotoğrafçılar için.",
    hi: "उन फोटोग्राफरों के लिए जिन्हें कस्टम डोमेन, अधिक कंटेंट और बेहतर प्रस्तुति नियंत्रण चाहिए।",
    pt: "Para fotógrafos que precisam de domínio próprio, mais conteúdo e controles de apresentação melhores.",
    de: "Für Fotografen, die eine eigene Domain, mehr Inhalte und stärkere Präsentationskontrollen brauchen.",
    fr: "Pour les photographes qui veulent un domaine personnalisé, plus de contenu et plus de contrôle."
  },
  "For professional photographers who need large libraries, premium themes, and advanced portfolio capacity.": {
    en: "For professional photographers who need large libraries, premium themes, and advanced portfolio capacity.",
    ur: "پروفیشنل فوٹوگرافرز کے لیے جنہیں بڑی لائبریریز، پریمیم تھیمز، اور زیادہ پورٹ فولیو گنجائش چاہیے۔",
    es: "Para fotógrafos profesionales que necesitan bibliotecas grandes, temas premium y más capacidad.",
    ar: "للمصورين المحترفين الذين يحتاجون مكتبات كبيرة وقوالب مميزة وسعة بورتفوليو متقدمة.",
    tr: "Büyük arşivler, premium temalar ve gelişmiş portfolyo kapasitesi isteyen profesyonel fotoğrafçılar için.",
    hi: "प्रोफेशनल फोटोग्राफरों के लिए जिन्हें बड़ी लाइब्रेरी, प्रीमियम थीम और उन्नत क्षमता चाहिए।",
    pt: "Para fotógrafos profissionais que precisam de grandes bibliotecas, temas premium e capacidade avançada.",
    de: "Für professionelle Fotografen mit großen Bibliotheken, Premium-Themes und erweiterter Kapazität.",
    fr: "Pour les photographes professionnels avec grandes bibliothèques, thèmes premium et capacité avancée."
  },
  "For customers who want to own their portfolio app permanently with larger freedom and setup support.": {
    en: "For customers who want to own their portfolio app permanently with larger freedom and setup support.",
    ur: "ان کسٹمرز کے لیے جو اپنا پورٹ فولیو ایپ مستقل طور پر زیادہ آزادی اور سیٹ اپ سپورٹ کے ساتھ رکھنا چاہتے ہیں۔",
    es: "Para clientes que quieren poseer su app de portafolio permanentemente con más libertad y soporte de configuración.",
    ar: "للعملاء الذين يريدون امتلاك تطبيق البورتفوليو دائماً مع حرية أكبر ودعم في الإعداد.",
    tr: "Portfolyo uygulamasına kalıcı olarak sahip olmak ve daha fazla özgürlük isteyen müşteriler için.",
    hi: "उन ग्राहकों के लिए जो अधिक स्वतंत्रता और सेटअप सपोर्ट के साथ अपना पोर्टफोलियो ऐप स्थायी रूप से रखना चाहते हैं।",
    pt: "Para clientes que querem possuir o app de portfólio permanentemente com mais liberdade e suporte.",
    de: "Für Kunden, die ihre Portfolio-App dauerhaft mit mehr Freiheit und Setup-Support besitzen möchten.",
    fr: "Pour les clients qui veulent posséder leur application portfolio durablement avec plus de liberté."
  },
  "Total photos": {
    en: "Total photos",
    ur: "کل تصاویر",
    es: "Fotos totales",
    ar: "إجمالي الصور",
    tr: "Toplam fotoğraf",
    hi: "कुल फोटो",
    pt: "Total de fotos",
    de: "Fotos insgesamt",
    fr: "Photos totales"
  },
  "Photos per category": {
    en: "Photos per category",
    ur: "ہر کیٹیگری میں تصاویر",
    es: "Fotos por categoría",
    ar: "صور لكل تصنيف",
    tr: "Kategori başına fotoğraf",
    hi: "प्रति कैटेगरी फोटो",
    pt: "Fotos por categoria",
    de: "Fotos pro Kategorie",
    fr: "Photos par catégorie"
  },
  "Categories": {
    en: "Categories",
    ur: "کیٹیگریز",
    es: "Categorías",
    ar: "التصنيفات",
    tr: "Kategoriler",
    hi: "कैटेगरी",
    pt: "Categorias",
    de: "Kategorien",
    fr: "Catégories"
  },
  "Subcategories per category": {
    en: "Subcategories per category",
    ur: "ہر کیٹیگری میں سب کیٹیگریز",
    es: "Subcategorías por categoría",
    ar: "تصنيفات فرعية لكل تصنيف",
    tr: "Kategori başına alt kategori",
    hi: "प्रति कैटेगरी सबकैटेगरी",
    pt: "Subcategorias por categoria",
    de: "Unterkategorien pro Kategorie",
    fr: "Sous-catégories par catégorie"
  },
  "Galleries": {
    en: "Galleries",
    ur: "گیلریز",
    es: "Galerías",
    ar: "المعارض",
    tr: "Galeriler",
    hi: "गैलरी",
    pt: "Galerias",
    de: "Galerien",
    fr: "Galeries"
  },
  "Photos per gallery": {
    en: "Photos per gallery",
    ur: "ہر گیلری میں تصاویر",
    es: "Fotos por galería",
    ar: "صور لكل معرض",
    tr: "Galeri başına fotoğraf",
    hi: "प्रति गैलरी फोटो",
    pt: "Fotos por galeria",
    de: "Fotos pro Galerie",
    fr: "Photos par galerie"
  },
  "Blogs": {
    en: "Blogs",
    ur: "بلاگز",
    es: "Blog",
    ar: "المدونات",
    tr: "Bloglar",
    hi: "ब्लॉग",
    pt: "Blog",
    de: "Blogartikel",
    fr: "Blog"
  },
  "Basic themes": {
    en: "Basic themes",
    ur: "بیسک تھیمز",
    es: "Temas básicos",
    ar: "قوالب أساسية",
    tr: "Temel temalar",
    hi: "बेसिक थीम",
    pt: "Temas básicos",
    de: "Basis-Themes",
    fr: "Thèmes de base"
  },
  "Premium themes": {
    en: "Premium themes",
    ur: "پریمیم تھیمز",
    es: "Temas premium",
    ar: "قوالب مميزة",
    tr: "Premium temalar",
    hi: "प्रीमियम थीम",
    pt: "Temas premium",
    de: "Premium-Themes",
    fr: "Thèmes premium"
  },
  "Custom domain": {
    en: "Custom domain",
    ur: "کسٹم ڈومین",
    es: "Dominio personalizado",
    ar: "نطاق مخصص",
    tr: "Özel alan adı",
    hi: "कस्टम डोमेन",
    pt: "Domínio personalizado",
    de: "Eigene Domain",
    fr: "Domaine personnalisé"
  },
  "Custom theme components": {
    en: "Custom theme components",
    ur: "کسٹم تھیم کمپوننٹس",
    es: "Componentes de tema personalizados",
    ar: "مكونات قالب مخصصة",
    tr: "Özel tema bileşenleri",
    hi: "कस्टम थीम कंपोनेंट",
    pt: "Componentes de tema personalizados",
    de: "Individuelle Theme-Komponenten",
    fr: "Composants de thème personnalisés"
  },
  "Admin dashboard": {
    en: "Admin dashboard",
    ur: "ایڈمن ڈیش بورڈ",
    es: "Panel de administración",
    ar: "لوحة تحكم الإدارة",
    tr: "Yönetim paneli",
    hi: "एडमिन डैशबोर्ड",
    pt: "Painel administrativo",
    de: "Admin-Dashboard",
    fr: "Tableau de bord admin"
  },
  "Responsive design": {
    en: "Responsive design",
    ur: "ریسپانسیو ڈیزائن",
    es: "Diseño responsive",
    ar: "تصميم متجاوب",
    tr: "Duyarlı tasarım",
    hi: "रेस्पॉन्सिव डिजाइन",
    pt: "Design responsivo",
    de: "Responsives Design",
    fr: "Design responsive"
  },
  "Hero images": {
    en: "Hero images",
    ur: "ہیرو تصاویر",
    es: "Imágenes hero",
    ar: "صور الواجهة",
    tr: "Hero görselleri",
    hi: "हीरो इमेज",
    pt: "Imagens hero",
    de: "Hero-Bilder",
    fr: "Images hero"
  },
  "Page header images": {
    en: "Page header images",
    ur: "صفحہ ہیڈر تصاویر",
    es: "Imágenes de encabezado",
    ar: "صور ترويسة الصفحات",
    tr: "Sayfa başlığı görselleri",
    hi: "पेज हेडर इमेज",
    pt: "Imagens de cabeçalho",
    de: "Seitenkopf-Bilder",
    fr: "Images d’en-tête"
  },
  "Watermarks": {
    en: "Watermarks",
    ur: "واٹر مارکس",
    es: "Marcas de agua",
    ar: "العلامات المائية",
    tr: "Filigranlar",
    hi: "वॉटरमार्क",
    pt: "Marcas d’água",
    de: "Wasserzeichen",
    fr: "Filigranes"
  },
  "More customization": {
    en: "More customization",
    ur: "زیادہ کسٹمائزیشن",
    es: "Más personalización",
    ar: "تخصيص أكثر",
    tr: "Daha fazla özelleştirme",
    hi: "अधिक कस्टमाइजेशन",
    pt: "Mais personalização",
    de: "Mehr Anpassung",
    fr: "Plus de personnalisation"
  },
  "Any language localization": {
    en: "Any language localization",
    ur: "کسی بھی زبان کی لوکلائزیشن",
    es: "Localización en cualquier idioma",
    ar: "تعريب أو ترجمة لأي لغة",
    tr: "Her dil için yerelleştirme",
    hi: "किसी भी भाषा की लोकलाइजेशन",
    pt: "Localização em qualquer idioma",
    de: "Lokalisierung in jeder Sprache",
    fr: "Localisation dans toute langue"
  },
  "Free maintenance": {
    en: "Free maintenance",
    ur: "مفت مینٹیننس",
    es: "Mantenimiento gratuito",
    ar: "صيانة مجانية",
    tr: "Ücretsiz bakım",
    hi: "मुफ्त मेंटेनेंस",
    pt: "Manutenção gratuita",
    de: "Kostenlose Wartung",
    fr: "Maintenance gratuite"
  },
  "Category requests": {
    en: "Category requests",
    ur: "کیٹیگری درخواستیں",
    es: "Solicitudes de categoría",
    ar: "طلبات التصنيفات",
    tr: "Kategori talepleri",
    hi: "कैटेगरी अनुरोध",
    pt: "Pedidos de categoria",
    de: "Kategorie-Anfragen",
    fr: "Demandes de catégorie"
  },
  "Own the app permanently": {
    en: "Own the app permanently",
    ur: "ایپ مستقل طور پر اپنی کریں",
    es: "Adquiere la app permanentemente",
    ar: "امتلك التطبيق بشكل دائم",
    tr: "Uygulamaya kalıcı olarak sahip olun",
    hi: "ऐप को स्थायी रूप से अपना बनाएं",
    pt: "Tenha o app permanentemente",
    de: "Besitze die App dauerhaft",
    fr: "Possédez l’application durablement"
  },
  "Unlimited photos": {
    en: "Unlimited photos",
    ur: "لامحدود تصاویر",
    es: "Fotos ilimitadas",
    ar: "صور غير محدودة",
    tr: "Sınırsız fotoğraf",
    hi: "अनलिमिटेड फोटो",
    pt: "Fotos ilimitadas",
    de: "Unbegrenzte Fotos",
    fr: "Photos illimitées"
  },
  "Unlimited categories and subcategories": {
    en: "Unlimited categories and subcategories",
    ur: "لامحدود کیٹیگریز اور سب کیٹیگریز",
    es: "Categorías y subcategorías ilimitadas",
    ar: "تصنيفات وتصنيفات فرعية غير محدودة",
    tr: "Sınırsız kategori ve alt kategori",
    hi: "अनलिमिटेड कैटेगरी और सबकैटेगरी",
    pt: "Categorias e subcategorias ilimitadas",
    de: "Unbegrenzte Kategorien und Unterkategorien",
    fr: "Catégories et sous-catégories illimitées"
  },
  "Unlimited galleries": {
    en: "Unlimited galleries",
    ur: "لامحدود گیلریز",
    es: "Galerías ilimitadas",
    ar: "معارض غير محدودة",
    tr: "Sınırsız galeri",
    hi: "अनलिमिटेड गैलरी",
    pt: "Galerias ilimitadas",
    de: "Unbegrenzte Galerien",
    fr: "Galeries illimitées"
  },
  "Unlimited blogs": {
    en: "Unlimited blogs",
    ur: "لامحدود بلاگز",
    es: "Blogs ilimitados",
    ar: "مدونات غير محدودة",
    tr: "Sınırsız blog",
    hi: "अनलिमिटेड ब्लॉग",
    pt: "Blogs ilimitados",
    de: "Unbegrenzte Blogs",
    fr: "Blogs illimités"
  },
  "2 months free maintenance": {
    en: "2 months free maintenance",
    ur: "2 ماہ مفت مینٹیننس",
    es: "2 meses de mantenimiento gratis",
    ar: "شهران صيانة مجانية",
    tr: "2 ay ücretsiz bakım",
    hi: "2 महीने मुफ्त मेंटेनेंस",
    pt: "2 meses de manutenção gratuita",
    de: "2 Monate kostenlose Wartung",
    fr: "2 mois de maintenance gratuite"
  }
  ,
  "Clean websites for photographers, built to showcase visual work.": {
    en: "Clean websites for photographers, built to showcase visual work.",
    ur: "فوٹوگرافرز کے لیے صاف ویب سائٹس، جو بصری کام دکھانے کے لیے بنائی گئی ہیں۔",
    es: "Sitios web limpios para fotografos, creados para mostrar trabajo visual.",
    ar: "مواقع نظيفة للمصورين، مصممة لعرض العمل البصري.",
    tr: "Fotografcilar icin gorsel isi sergilemeye odaklanan temiz web siteleri.",
    hi: "फोटोग्राफरों के लिए साफ वेबसाइटें, जो दृश्य काम दिखाने के लिए बनी हैं।",
    pt: "Sites limpos para fotografos, criados para mostrar trabalho visual.",
    de: "Klare Websites fuer Fotografen, gebaut zur Praesentation visueller Arbeit.",
    fr: "Sites clairs pour photographes, concus pour presenter le travail visuel."
  },
  "Copyright (c) {year} Photaaz. All rights reserved.": {
    en: "Copyright (c) {year} Photaaz. All rights reserved.",
    ur: "کاپی رائٹ (c) {year} Photaaz. جملہ حقوق محفوظ ہیں۔",
    es: "Copyright (c) {year} Photaaz. Todos los derechos reservados.",
    ar: "حقوق النشر (c) {year} Photaaz. جميع الحقوق محفوظة.",
    tr: "Telif hakki (c) {year} Photaaz. Tum haklari saklidir.",
    hi: "कॉपीराइट (c) {year} Photaaz. सर्वाधिकार सुरक्षित।",
    pt: "Copyright (c) {year} Photaaz. Todos os direitos reservados.",
    de: "Copyright (c) {year} Photaaz. Alle Rechte vorbehalten.",
    fr: "Copyright (c) {year} Photaaz. Tous droits reserves."
  },
  "Phone": {
    en: "Phone",
    ur: "فون",
    es: "Telefono",
    ar: "الهاتف",
    tr: "Telefon",
    hi: "फोन",
    pt: "Telefone",
    de: "Telefon",
    fr: "Telephone"
  },
  "Photography Website Theme": {
    en: "Photography Website Theme",
    ur: "فوٹوگرافی ویب سائٹ تھیم",
    es: "Tema de sitio web de fotografia",
    ar: "قالب موقع تصوير",
    tr: "Fotograf Sitesi Temasi",
    hi: "फोटोग्राफी वेबसाइट थीम",
    pt: "Tema de site de fotografia",
    de: "Fotografie-Website-Theme",
    fr: "Theme de site photo"
  },
  "A refined light portfolio for wedding, portrait, and lifestyle photographers who want calm presentation.": {
    en: "A refined light portfolio for wedding, portrait, and lifestyle photographers who want calm presentation.",
    ur: "ویڈنگ، پورٹریٹ اور لائف اسٹائل فوٹوگرافرز کے لیے ایک نفیس ہلکا پورٹ فولیو جو پرسکون پیشکش چاہتے ہیں۔",
    es: "Un portafolio claro y refinado para fotografos de bodas, retratos y lifestyle que buscan una presentacion tranquila.",
    ar: "بورتفوليو فاتح ومصقول لمصوري الزفاف والبورتريه ونمط الحياة الذين يريدون عرضا هادئا.",
    tr: "Sakin bir sunum isteyen dugun, portre ve yasam tarzi fotografcilari icin zarif ve acik bir portfolyo.",
    hi: "शांत प्रस्तुति चाहने वाले वेडिंग, पोर्ट्रेट और लाइफस्टाइल फोटोग्राफरों के लिए एक साफ और परिष्कृत पोर्टफोलियो।",
    pt: "Um portfolio claro e refinado para fotografos de casamento, retrato e lifestyle que querem uma apresentacao calma.",
    de: "Ein helles, feines Portfolio fuer Hochzeits-, Portraet- und Lifestyle-Fotografen mit ruhiger Praesentation.",
    fr: "Un portfolio clair et raffine pour photographes de mariage, portrait et lifestyle qui veulent une presentation calme."
  },
  "A confident editorial layout for photographers who publish campaigns, stories, and visual essays.": {
    en: "A confident editorial layout for photographers who publish campaigns, stories, and visual essays.",
    ur: "کمپینز، کہانیوں اور بصری مضامین شائع کرنے والے فوٹوگرافرز کے لیے ایک مضبوط ایڈیٹوریل لے آؤٹ۔",
    es: "Un diseno editorial seguro para fotografos que publican campanas, historias y ensayos visuales.",
    ar: "تخطيط تحريري واثق للمصورين الذين ينشرون حملات وقصصا ومقالات بصرية.",
    tr: "Kampanyalar, hikayeler ve gorsel denemeler yayinlayan fotografcilar icin guclu bir editoryal duzen.",
    hi: "कैंपेन, कहानियां और विजुअल निबंध प्रकाशित करने वाले फोटोग्राफरों के लिए आत्मविश्वासी एडिटोरियल लेआउट।",
    pt: "Um layout editorial seguro para fotografos que publicam campanhas, historias e ensaios visuais.",
    de: "Ein selbstbewusstes Editorial-Layout fuer Fotografen, die Kampagnen, Geschichten und visuelle Essays veroeffentlichen.",
    fr: "Une mise en page editoriale affirmee pour photographes publiant campagnes, recits et essais visuels."
  },
  "A dark, full-bleed theme for dramatic travel, street, and documentary photography.": {
    en: "A dark, full-bleed theme for dramatic travel, street, and documentary photography.",
    ur: "ڈرامائی ٹریول، اسٹریٹ اور ڈاکیومنٹری فوٹوگرافی کے لیے ایک ڈارک فل بلیڈ تھیم۔",
    es: "Un tema oscuro a sangre completa para fotografia dramatica de viajes, calle y documental.",
    ar: "قالب داكن ممتد بالكامل لتصوير السفر والشارع والوثائقي الدرامي.",
    tr: "Dramatik seyahat, sokak ve belgesel fotografciligi icin koyu, tam ekran bir tema.",
    hi: "ड्रामेटिक ट्रैवल, स्ट्रीट और डॉक्यूमेंट्री फोटोग्राफी के लिए डार्क फुल-ब्लीड थीम।",
    pt: "Um tema escuro em tela cheia para fotografia dramatica de viagem, rua e documental.",
    de: "Ein dunkles Full-Bleed-Theme fuer dramatische Reise-, Street- und Dokumentarfotografie.",
    fr: "Un theme sombre pleine largeur pour la photo de voyage, rue et documentaire dramatique."
  },
  "A gallery-heavy theme for photographers with many categories, sets, and image-led archives.": {
    en: "A gallery-heavy theme for photographers with many categories, sets, and image-led archives.",
    ur: "زیادہ کیٹیگریز، سیٹس اور تصویری آرکائیوز رکھنے والے فوٹوگرافرز کے لیے گیلری پر مبنی تھیم۔",
    es: "Un tema centrado en galerias para fotografos con muchas categorias, series y archivos visuales.",
    ar: "قالب غني بالمعارض للمصورين الذين لديهم تصنيفات ومجموعات وأرشيفات بصرية كثيرة.",
    tr: "Cok sayida kategori, set ve gorsel arsivi olan fotografcilar icin galeri agirlikli bir tema.",
    hi: "कई कैटेगरी, सेट और इमेज-लीड आर्काइव वाले फोटोग्राफरों के लिए गैलरी-केंद्रित थीम।",
    pt: "Um tema focado em galerias para fotografos com muitas categorias, series e arquivos visuais.",
    de: "Ein galeriebetontes Theme fuer Fotografen mit vielen Kategorien, Serien und bildgefuehrten Archiven.",
    fr: "Un theme tres oriente galerie pour photographes avec de nombreuses categories, series et archives visuelles."
  },
  "A high-end theme for wedding, fashion, and studio brands that need a more polished first impression.": {
    en: "A high-end theme for wedding, fashion, and studio brands that need a more polished first impression.",
    ur: "ویڈنگ، فیشن اور اسٹوڈیو برانڈز کے لیے ہائی اینڈ تھیم جو زیادہ پالشڈ پہلا تاثر چاہتے ہیں۔",
    es: "Un tema de alta gama para marcas de bodas, moda y estudio que necesitan una primera impresion mas pulida.",
    ar: "قالب فاخر لعلامات الزفاف والأزياء والاستوديو التي تحتاج إلى انطباع أول أكثر صقلا.",
    tr: "Daha rafine bir ilk izlenim isteyen dugun, moda ve studyo markalari icin ust duzey bir tema.",
    hi: "वेडिंग, फैशन और स्टूडियो ब्रांड्स के लिए हाई-एंड थीम जिन्हें ज्यादा पॉलिश्ड पहला प्रभाव चाहिए।",
    pt: "Um tema premium para marcas de casamento, moda e estudio que precisam de uma primeira impressao mais refinada.",
    de: "Ein High-End-Theme fuer Wedding-, Fashion- und Studio-Marken mit besonders hochwertigem Ersteindruck.",
    fr: "Un theme haut de gamme pour marques mariage, mode et studio qui veulent une premiere impression plus raffinee."
  },
  "A special premium theme for fine-art, portrait, and black-and-white photographers.": {
    en: "A special premium theme for fine-art, portrait, and black-and-white photographers.",
    ur: "فائن آرٹ، پورٹریٹ اور بلیک اینڈ وائٹ فوٹوگرافرز کے لیے ایک خاص پریمیم تھیم۔",
    es: "Un tema premium especial para fotografos de arte, retrato y blanco y negro.",
    ar: "قالب بريميوم خاص لمصوري الفن التشكيلي والبورتريه والأبيض والأسود.",
    tr: "Guzel sanat, portre ve siyah-beyaz fotografcilar icin ozel premium tema.",
    hi: "फाइन-आर्ट, पोर्ट्रेट और ब्लैक-एंड-व्हाइट फोटोग्राफरों के लिए खास प्रीमियम थीम।",
    pt: "Um tema premium especial para fotografos de fine art, retrato e preto e branco.",
    de: "Ein besonderes Premium-Theme fuer Fine-Art-, Portraet- und Schwarzweiss-Fotografen.",
    fr: "Un theme premium special pour photographes fine art, portrait et noir et blanc."
  },
  "A cinematic premium theme for landscape, travel, and outdoor photography portfolios.": {
    en: "A cinematic premium theme for landscape, travel, and outdoor photography portfolios.",
    ur: "لینڈ اسکیپ، ٹریول اور آؤٹ ڈور فوٹوگرافی پورٹ فولیو کے لیے سینیمیٹک پریمیم تھیم۔",
    es: "Un tema premium cinematografico para portafolios de paisaje, viajes y fotografia outdoor.",
    ar: "قالب بريميوم سينمائي لمحافظ تصوير المناظر والسفر والخارج.",
    tr: "Manzara, seyahat ve outdoor fotograf portfolyolari icin sinematik premium tema.",
    hi: "लैंडस्केप, ट्रैवल और आउटडोर फोटोग्राफी पोर्टफोलियो के लिए सिनेमैटिक प्रीमियम थीम।",
    pt: "Um tema premium cinematografico para portfolios de paisagem, viagem e fotografia outdoor.",
    de: "Ein cineastisches Premium-Theme fuer Landschafts-, Reise- und Outdoor-Fotografie.",
    fr: "Un theme premium cinematographique pour portfolios paysage, voyage et outdoor."
  },
  "Soft image-first hero": {
    en: "Soft image-first hero", ur: "نرم تصویر پر مبنی ہیرو", es: "Hero suave centrado en imagen", ar: "بطل بصري ناعم أولا", tr: "Yumusak, gorsel oncelikli hero", hi: "सॉफ्ट इमेज-फर्स्ट हीरो", pt: "Hero suave com imagem em primeiro lugar", de: "Sanfter bildorientierter Hero", fr: "Hero doux centre sur l'image"
  },
  "Clean gallery index": {
    en: "Clean gallery index", ur: "صاف گیلری انڈیکس", es: "Indice de galeria limpio", ar: "فهرس معرض نظيف", tr: "Temiz galeri indeksi", hi: "क्लीन गैलरी इंडेक्स", pt: "Indice de galeria limpo", de: "Klarer Galerieindex", fr: "Index de galerie clair"
  },
  "Quiet inquiry path": {
    en: "Quiet inquiry path", ur: "سادہ انکوائری راستہ", es: "Ruta de consulta tranquila", ar: "مسار استفسار هادئ", tr: "Sade iletisim yolu", hi: "शांत इन्क्वायरी पथ", pt: "Caminho de contato discreto", de: "Ruhiger Anfrageweg", fr: "Parcours de demande discret"
  },
  "Magazine-style rhythm": {
    en: "Magazine-style rhythm", ur: "میگزین طرز کی رفتار", es: "Ritmo de revista", ar: "إيقاع بأسلوب المجلات", tr: "Dergi tarzi ritim", hi: "मैगज़ीन-स्टाइल रिदम", pt: "Ritmo de revista", de: "Magazinartiger Rhythmus", fr: "Rythme magazine"
  },
  "Story-led sections": {
    en: "Story-led sections", ur: "کہانی پر مبنی سیکشنز", es: "Secciones guiadas por historia", ar: "أقسام تقودها القصة", tr: "Hikaye odakli bolumler", hi: "स्टोरी-लेड सेक्शन", pt: "Secoes guiadas por historia", de: "Story-gefuehrte Abschnitte", fr: "Sections guidees par le recit"
  },
  "Journal-ready typography": {
    en: "Journal-ready typography", ur: "جرنل کے لیے تیار ٹائپوگرافی", es: "Tipografia lista para diario", ar: "طباعة جاهزة للمجلة", tr: "Gunluk yayina hazir tipografi", hi: "जर्नल-रेडी टाइपोग्राफी", pt: "Tipografia pronta para journal", de: "Journal-taugliche Typografie", fr: "Typographie prete pour journal"
  },
  "Dark full-bleed canvas": {
    en: "Dark full-bleed canvas", ur: "ڈارک فل بلیڈ کینوس", es: "Lienzo oscuro a sangre completa", ar: "لوحة داكنة ممتدة بالكامل", tr: "Koyu tam ekran tuval", hi: "डार्क फुल-ब्लीड कैनवास", pt: "Canvas escuro em tela cheia", de: "Dunkle Full-Bleed-Flaeche", fr: "Toile sombre pleine largeur"
  },
  "Film-like gallery pacing": {
    en: "Film-like gallery pacing", ur: "فلم جیسی گیلری رفتار", es: "Ritmo de galeria cinematografico", ar: "إيقاع معرض يشبه الفيلم", tr: "Film tadinda galeri akisi", hi: "फिल्म जैसी गैलरी पेसिंग", pt: "Ritmo de galeria cinematografico", de: "Filmische Galerie-Dramaturgie", fr: "Rythme de galerie cinematographique"
  },
  "High-contrast project pages": {
    en: "High-contrast project pages", ur: "ہائی کنٹراسٹ پراجیکٹ صفحات", es: "Paginas de proyecto de alto contraste", ar: "صفحات مشاريع عالية التباين", tr: "Yuksek kontrastli proje sayfalari", hi: "हाई-कॉन्ट्रास्ट प्रोजेक्ट पेज", pt: "Paginas de projeto em alto contraste", de: "Kontrastreiche Projektseiten", fr: "Pages projet a fort contraste"
  },
  "Dense visual browsing": {
    en: "Dense visual browsing", ur: "گھنا بصری براؤزنگ", es: "Exploracion visual densa", ar: "تصفح بصري كثيف", tr: "Yogun gorsel tarama", hi: "घना विजुअल ब्राउज़िंग", pt: "Navegacao visual densa", de: "Dichtes visuelles Browsing", fr: "Navigation visuelle dense"
  },
  "Mixed-aspect masonry": {
    en: "Mixed-aspect masonry", ur: "مختلف تناسب والی میسنری", es: "Masonry con proporciones mixtas", ar: "شبكة ماسونية بنسب مختلطة", tr: "Karisik oranli masonry", hi: "मिक्स्ड-आस्पेक्ट मेसनरी", pt: "Masonry com proporcoes mistas", de: "Masonry mit gemischten Formaten", fr: "Masonry aux formats mixtes"
  },
  "Fast collection scanning": {
    en: "Fast collection scanning", ur: "کلیکشنز کی تیز اسکیننگ", es: "Exploracion rapida de colecciones", ar: "تصفح سريع للمجموعات", tr: "Koleksiyonlari hizli tarama", hi: "कलेक्शन की तेज़ स्कैनिंग", pt: "Exploracao rapida de colecoes", de: "Schnelles Scannen von Kollektionen", fr: "Lecture rapide des collections"
  },
  "Boutique studio polish": {
    en: "Boutique studio polish", ur: "بوتیک اسٹوڈیو پالش", es: "Pulido de estudio boutique", ar: "لمسة استوديو بوتيك", tr: "Butik studyo sikligi", hi: "बुटीक स्टूडियो पॉलिश", pt: "Acabamento de estudio boutique", de: "Boutique-Studio-Feinschliff", fr: "Finition studio boutique"
  },
  "Elegant spacing": {
    en: "Elegant spacing", ur: "خوبصورت اسپیسنگ", es: "Espaciado elegante", ar: "مسافات أنيقة", tr: "Zarif bosluklar", hi: "एलिगेंट स्पेसिंग", pt: "Espacamento elegante", de: "Elegante Abstaende", fr: "Espacement elegant"
  },
  "Premium booking flow": {
    en: "Premium booking flow", ur: "پریمیم بکنگ فلو", es: "Flujo de reserva premium", ar: "مسار حجز فاخر", tr: "Premium rezervasyon akisi", hi: "प्रीमियम बुकिंग फ्लो", pt: "Fluxo de reserva premium", de: "Premium-Buchungsablauf", fr: "Flux de reservation premium"
  },
  "Fine-art monochrome layout": {
    en: "Fine-art monochrome layout", ur: "فائن آرٹ مونوکروم لے آؤٹ", es: "Diseno monocromo fine art", ar: "تخطيط أحادي للفن التشكيلي", tr: "Fine-art monokrom duzen", hi: "फाइन-आर्ट मोनोक्रोम लेआउट", pt: "Layout monocromatico fine art", de: "Fine-Art-Monochrom-Layout", fr: "Mise en page monochrome fine art"
  },
  "Gallery-grade image viewer": {
    en: "Gallery-grade image viewer", ur: "گیلری لیول امیج ویور", es: "Visor de imagenes de nivel galeria", ar: "عارض صور بمستوى المعارض", tr: "Galeri kalitesinde gorsel goruntuleyici", hi: "गैलरी-ग्रेड इमेज व्यूअर", pt: "Visualizador de imagem nivel galeria", de: "Bildviewer auf Galerie-Niveau", fr: "Visionneuse d'images niveau galerie"
  },
  "Collector-style categories": {
    en: "Collector-style categories", ur: "کلیکٹر طرز کی کیٹیگریز", es: "Categorias estilo coleccionista", ar: "تصنيفات بأسلوب المقتنين", tr: "Koleksiyoner tarzi kategoriler", hi: "कलेक्टर-स्टाइल कैटेगरी", pt: "Categorias estilo colecionador", de: "Kategorien im Sammler-Stil", fr: "Categories style collectionneur"
  },
  "Wide panoramic stories": {
    en: "Wide panoramic stories", ur: "وسیع پینورامک کہانیاں", es: "Historias panoramicas amplias", ar: "قصص بانورامية واسعة", tr: "Genis panoramik hikayeler", hi: "वाइड पैनोरमिक स्टोरीज़", pt: "Historias panoramicas amplas", de: "Weite Panorama-Storys", fr: "Histoires panoramiques larges"
  },
  "Landscape-first gallery flow": {
    en: "Landscape-first gallery flow", ur: "لینڈ اسکیپ فرسٹ گیلری فلو", es: "Flujo de galeria centrado en paisaje", ar: "تدفق معرض يضع المناظر أولا", tr: "Manzara oncelikli galeri akisi", hi: "लैंडस्केप-फर्स्ट गैलरी फ्लो", pt: "Fluxo de galeria focado em paisagem", de: "Landschaftsorientierter Galeriefluss", fr: "Flux de galerie centre paysage"
  },
  "Route-based browsing": {
    en: "Route-based browsing", ur: "روٹ بیسڈ براؤزنگ", es: "Navegacion basada en rutas", ar: "تصفح مبني على المسارات", tr: "Rota tabanli gezinme", hi: "रूट-बेस्ड ब्राउज़िंग", pt: "Navegacao baseada em rotas", de: "Routenbasiertes Browsing", fr: "Navigation par itineraires"
  },
  "Events": {
    en: "Events", ur: "تقریبات", es: "Eventos", ar: "الفعاليات", tr: "Etkinlikler", hi: "कार्यक्रम", pt: "Eventos", de: "Veranstaltungen", fr: "Evenements"
  },
  "Portrait": {
    en: "Portrait", ur: "پورٹریٹ", es: "Retrato", ar: "بورتريه", tr: "Portre", hi: "पोर्ट्रेट", pt: "Retrato", de: "Portraet", fr: "Portrait photo"
  },
  "Nature & Landscape": {
    en: "Nature & Landscape", ur: "قدرت اور مناظر", es: "Naturaleza y paisaje", ar: "الطبيعة والمناظر", tr: "Doga ve manzara", hi: "प्रकृति और परिदृश्य", pt: "Natureza e paisagem", de: "Natur und Landschaft", fr: "Nature et paysage"
  },
  "Fashion": {
    en: "Fashion", ur: "فیشن", es: "Moda", ar: "الأزياء", tr: "Moda", hi: "फ़ैशन", pt: "Moda", de: "Mode", fr: "Mode"
  },
  "Commercial": {
    en: "Commercial", ur: "کمرشل", es: "Comercial", ar: "تجاري", tr: "Ticari", hi: "कमर्शियल", pt: "Comercial", de: "Kommerziell", fr: "Commercial pro"
  },
  "Street": {
    en: "Street", ur: "اسٹریٹ", es: "Calle", ar: "الشارع", tr: "Sokak", hi: "स्ट्रीट", pt: "Rua", de: "Strasse", fr: "Rue"
  },
  "Food": {
    en: "Food", ur: "فوڈ", es: "Comida", ar: "الطعام", tr: "Yemek", hi: "फ़ूड", pt: "Comida", de: "Essen", fr: "Cuisine"
  },
  "Real Estate": {
    en: "Real Estate", ur: "رئیل اسٹیٹ", es: "Inmobiliaria", ar: "العقارات", tr: "Gayrimenkul", hi: "रियल एस्टेट", pt: "Imobiliario", de: "Immobilien", fr: "Immobilier"
  },
  "Sports": {
    en: "Sports", ur: "کھیل", es: "Deportes", ar: "الرياضة", tr: "Spor", hi: "स्पोर्ट्स", pt: "Esportes", de: "Sport", fr: "Sports"
  },
  "Wedding": {
    en: "Wedding", ur: "شادی", es: "Boda", ar: "الزفاف", tr: "Dugun", hi: "शादी", pt: "Casamento", de: "Hochzeit", fr: "Mariage"
  },
  "Corporate": {
    en: "Corporate", ur: "کارپوریٹ", es: "Corporativo", ar: "الشركات", tr: "Kurumsal", hi: "कॉर्पोरेट", pt: "Corporativo", de: "Unternehmen", fr: "Entreprise"
  },
  "Birthday": {
    en: "Birthday", ur: "سالگرہ", es: "Cumpleanos", ar: "عيد ميلاد", tr: "Dogum gunu", hi: "जन्मदिन", pt: "Aniversario", de: "Geburtstag", fr: "Anniversaire"
  },
  "Graduation": {
    en: "Graduation", ur: "گریجویشن", es: "Graduacion", ar: "التخرج", tr: "Mezuniyet", hi: "ग्रेजुएशन", pt: "Formatura", de: "Abschlussfeier", fr: "Remise de diplome"
  },
  "Concert": {
    en: "Concert", ur: "کنسرٹ", es: "Concierto", ar: "حفلة موسيقية", tr: "Konser", hi: "कॉन्सर्ट", pt: "Concerto", de: "Konzert", fr: "Concert"
  },
  "Family": {
    en: "Family", ur: "فیملی", es: "Familia", ar: "العائلة", tr: "Aile", hi: "परिवार", pt: "Familia", de: "Familie", fr: "Famille"
  },
  "Maternity": {
    en: "Maternity", ur: "میٹرنٹی", es: "Maternidad", ar: "الأمومة", tr: "Hamilelik", hi: "मैटरनिटी", pt: "Maternidade", de: "Mutterschaft", fr: "Maternite"
  },
  "Newborn": {
    en: "Newborn", ur: "نوزائیدہ", es: "Recien nacido", ar: "حديث الولادة", tr: "Yenidogan", hi: "नवजात", pt: "Recem-nascido", de: "Neugeborene", fr: "Nouveau-ne"
  },
  "Headshots": {
    en: "Headshots", ur: "ہیڈ شاٹس", es: "Retratos profesionales", ar: "صور شخصية احترافية", tr: "Profil portreleri", hi: "हेडशॉट्स", pt: "Retratos profissionais", de: "Businessportraets", fr: "Portraits professionnels"
  },
  "Landscapes": {
    en: "Landscapes", ur: "مناظر", es: "Paisajes", ar: "مناظر طبيعية", tr: "Manzaralar", hi: "लैंडस्केप", pt: "Paisagens", de: "Landschaften", fr: "Paysages"
  },
  "Wildlife": {
    en: "Wildlife", ur: "وائلڈ لائف", es: "Vida silvestre", ar: "الحياة البرية", tr: "Yaban hayati", hi: "वन्यजीव", pt: "Vida selvagem", de: "Tierwelt", fr: "Faune sauvage"
  },
  "Macro": {
    en: "Macro", ur: "میکرو", es: "Macro", ar: "ماكرو", tr: "Makro", hi: "मैक्रो", pt: "Macro", de: "Makro", fr: "Macro"
  },
  "Publish SEO-friendly articles and stories.": {
    en: "Publish SEO-friendly articles and stories.",
    ur: "SEO کے لیے موزوں مضامین اور کہانیاں شائع کریں۔",
    es: "Publica artículos e historias optimizados para SEO.",
    ar: "انشر مقالات وقصصًا صديقة لمحركات البحث.",
    tr: "SEO uyumlu yazılar ve hikayeler yayınlayın.",
    hi: "SEO-अनुकूल लेख और कहानियां प्रकाशित करें।",
    pt: "Publique artigos e histórias otimizados para SEO.",
    de: "Veröffentliche SEO-freundliche Artikel und Geschichten.",
    fr: "Publiez des articles et récits optimisés pour le SEO."
  },
  "Connect one verified custom domain on supported plans.": {
    en: "Connect one verified custom domain on supported plans.",
    ur: "سپورٹڈ پلانز پر ایک تصدیق شدہ کسٹم ڈومین منسلک کریں۔",
    es: "Conecta un dominio personalizado verificado en los planes compatibles.",
    ar: "اربط نطاقًا مخصصًا موثقًا واحدًا في الخطط المدعومة.",
    tr: "Desteklenen planlarda bir doğrulanmış özel alan adı bağlayın.",
    hi: "समर्थित प्लान पर एक सत्यापित कस्टम डोमेन जोड़ें।",
    pt: "Conecte um domínio personalizado verificado nos planos compatíveis.",
    de: "Verbinde eine verifizierte eigene Domain in unterstützten Tarifen.",
    fr: "Connectez un domaine personnalisé vérifié sur les forfaits compatibles."
  },
  "Unlock paid code-based portfolio themes.": {
    en: "Unlock paid code-based portfolio themes.",
    ur: "پیڈ کوڈ بیسڈ پورٹ فولیو تھیمز ان لاک کریں۔",
    es: "Desbloquea temas de portafolio premium basados en código.",
    ar: "افتح قوالب بورتفوليو مدفوعة مبنية بالكود.",
    tr: "Ücretli kod tabanlı portfolyo temalarının kilidini açın.",
    hi: "पेड कोड-आधारित पोर्टफोलियो थीम अनलॉक करें।",
    pt: "Desbloqueie temas de portfólio pagos baseados em código.",
    de: "Schalte kostenpflichtige codebasierte Portfolio-Themes frei.",
    fr: "Débloquez des thèmes portfolio premium basés sur le code."
  },
  "Apply future watermark workflows to media.": {
    en: "Apply future watermark workflows to media.",
    ur: "میڈیا پر آئندہ واٹر مارک ورک فلو لاگو کریں۔",
    es: "Aplica futuros flujos de marca de agua a los medios.",
    ar: "طبّق مسارات عمل العلامة المائية المستقبلية على الوسائط.",
    tr: "Medyaya gelecekteki filigran iş akışlarını uygulayın.",
    hi: "मीडिया पर भविष्य के वॉटरमार्क वर्कफ्लो लागू करें।",
    pt: "Aplique futuros fluxos de marca d'água à mídia.",
    de: "Wende künftige Wasserzeichen-Workflows auf Medien an.",
    fr: "Appliquez de futurs flux de filigrane aux médias."
  },
  "Maximum photos a tenant can upload overall.": {
    en: "Maximum photos a tenant can upload overall.",
    ur: "ایک ٹیننٹ کل زیادہ سے زیادہ کتنی تصاویر اپ لوڈ کر سکتا ہے۔",
    es: "Número máximo total de fotos que un tenant puede subir.",
    ar: "الحد الأقصى لإجمالي الصور التي يمكن للمستأجر رفعها.",
    tr: "Bir kiracının toplamda yükleyebileceği en fazla fotoğraf sayısı.",
    hi: "किसी टेनेंट द्वारा कुल अपलोड की जा सकने वाली अधिकतम फोटो।",
    pt: "Máximo total de fotos que um tenant pode enviar.",
    de: "Maximale Gesamtzahl an Fotos, die ein Tenant hochladen kann.",
    fr: "Nombre total maximal de photos qu'un tenant peut téléverser."
  },
  "Maximum homepage hero images a tenant can use.": {
    en: "Maximum homepage hero images a tenant can use.",
    ur: "ہوم پیج ہیرو میں استعمال ہونے والی زیادہ سے زیادہ تصاویر۔",
    es: "Número máximo de imágenes hero que un tenant puede usar en la página principal.",
    ar: "الحد الأقصى لصور الواجهة التي يمكن للمستأجر استخدامها في الصفحة الرئيسية.",
    tr: "Bir kiracının ana sayfada kullanabileceği en fazla hero görseli.",
    hi: "होमपेज हीरो में उपयोग की जा सकने वाली अधिकतम इमेज।",
    pt: "Máximo de imagens hero que um tenant pode usar na página inicial.",
    de: "Maximale Anzahl von Hero-Bildern auf der Startseite.",
    fr: "Nombre maximal d'images hero utilisables sur l'accueil."
  },
  "Set custom cover images for public portfolio pages such as gallery, categories, blog, and about.": {
    en: "Set custom cover images for public portfolio pages such as gallery, categories, blog, and about.",
    ur: "گیلری، کیٹیگریز، بلاگ اور اباؤٹ جیسے پبلک پورٹ فولیو صفحات کے لیے کسٹم کور تصاویر سیٹ کریں۔",
    es: "Define imágenes de portada personalizadas para páginas públicas como galería, categorías, blog y acerca de.",
    ar: "عيّن صور غلاف مخصصة لصفحات البورتفوليو العامة مثل المعرض والتصنيفات والمدونة ونبذة.",
    tr: "Galeri, kategoriler, blog ve hakkında gibi genel portfolyo sayfaları için özel kapak görselleri belirleyin.",
    hi: "गैलरी, कैटेगरी, ब्लॉग और अबाउट जैसे सार्वजनिक पोर्टफोलियो पेजों के लिए कस्टम कवर इमेज सेट करें।",
    pt: "Defina imagens de capa personalizadas para páginas públicas como galeria, categorias, blog e sobre.",
    de: "Lege eigene Titelbilder für öffentliche Portfolio-Seiten wie Galerie, Kategorien, Blog und Über fest.",
    fr: "Définissez des images de couverture personnalisées pour les pages publiques comme galerie, catégories, blog et à propos."
  },
  "Maximum photos a tenant can upload to one category or subcategory.": {
    en: "Maximum photos a tenant can upload to one category or subcategory.",
    ur: "ایک کیٹیگری یا سب کیٹیگری میں اپ لوڈ کی جانے والی زیادہ سے زیادہ تصاویر۔",
    es: "Número máximo de fotos que un tenant puede subir a una categoría o subcategoría.",
    ar: "الحد الأقصى للصور التي يمكن رفعها إلى تصنيف أو تصنيف فرعي واحد.",
    tr: "Bir kategoriye veya alt kategoriye yüklenebilecek en fazla fotoğraf sayısı.",
    hi: "एक कैटेगरी या सबकैटेगरी में अपलोड की जा सकने वाली अधिकतम फोटो।",
    pt: "Máximo de fotos que um tenant pode enviar para uma categoria ou subcategoria.",
    de: "Maximale Fotos pro Kategorie oder Unterkategorie.",
    fr: "Nombre maximal de photos par catégorie ou sous-catégorie."
  },
  "Maximum parent categories a tenant can organize.": {
    en: "Maximum parent categories a tenant can organize.",
    ur: "ٹیننٹ زیادہ سے زیادہ کتنی پیرنٹ کیٹیگریز منظم کر سکتا ہے۔",
    es: "Número máximo de categorías principales que un tenant puede organizar.",
    ar: "الحد الأقصى للتصنيفات الرئيسية التي يمكن للمستأجر تنظيمها.",
    tr: "Bir kiracının düzenleyebileceği en fazla ana kategori sayısı.",
    hi: "टेनेंट द्वारा व्यवस्थित की जा सकने वाली अधिकतम पैरेंट कैटेगरी।",
    pt: "Máximo de categorias principais que um tenant pode organizar.",
    de: "Maximale Anzahl an Hauptkategorien.",
    fr: "Nombre maximal de catégories principales."
  },
  "Maximum subcategories allowed inside each parent category.": {
    en: "Maximum subcategories allowed inside each parent category.",
    ur: "ہر پیرنٹ کیٹیگری میں اجازت شدہ زیادہ سے زیادہ سب کیٹیگریز۔",
    es: "Número máximo de subcategorías permitidas dentro de cada categoría principal.",
    ar: "الحد الأقصى للتصنيفات الفرعية المسموح بها داخل كل تصنيف رئيسي.",
    tr: "Her ana kategori içinde izin verilen en fazla alt kategori sayısı.",
    hi: "हर पैरेंट कैटेगरी में अनुमत अधिकतम सबकैटेगरी।",
    pt: "Máximo de subcategorias permitidas em cada categoria principal.",
    de: "Maximale Unterkategorien pro Hauptkategorie.",
    fr: "Nombre maximal de sous-catégories par catégorie principale."
  },
  "Maximum curated galleries a tenant can publish.": {
    en: "Maximum curated galleries a tenant can publish.",
    ur: "ٹیننٹ زیادہ سے زیادہ کتنی منتخب گیلریز شائع کر سکتا ہے۔",
    es: "Número máximo de galerías curadas que un tenant puede publicar.",
    ar: "الحد الأقصى للمعارض المنسقة التي يمكن للمستأجر نشرها.",
    tr: "Bir kiracının yayınlayabileceği en fazla seçilmiş galeri sayısı.",
    hi: "टेनेंट द्वारा प्रकाशित की जा सकने वाली अधिकतम क्यूरेटेड गैलरी।",
    pt: "Máximo de galerias selecionadas que um tenant pode publicar.",
    de: "Maximale Anzahl kuratierter Galerien.",
    fr: "Nombre maximal de galeries sélectionnées publiables."
  },
  "Maximum photos allowed inside each gallery.": {
    en: "Maximum photos allowed inside each gallery.",
    ur: "ہر گیلری میں اجازت شدہ زیادہ سے زیادہ تصاویر۔",
    es: "Número máximo de fotos permitidas dentro de cada galería.",
    ar: "الحد الأقصى للصور المسموح بها داخل كل معرض.",
    tr: "Her galeride izin verilen en fazla fotoğraf sayısı.",
    hi: "हर गैलरी में अनुमत अधिकतम फोटो।",
    pt: "Máximo de fotos permitidas em cada galeria.",
    de: "Maximale Fotos pro Galerie.",
    fr: "Nombre maximal de photos par galerie."
  },
  "Number of premium themes available on this package.": {
    en: "Number of premium themes available on this package.",
    ur: "اس پیکج میں دستیاب پریمیم تھیمز کی تعداد۔",
    es: "Número de temas premium disponibles en este paquete.",
    ar: "عدد القوالب المميزة المتاحة في هذه الباقة.",
    tr: "Bu pakette kullanılabilir premium tema sayısı.",
    hi: "इस पैकेज में उपलब्ध प्रीमियम थीम की संख्या।",
    pt: "Número de temas premium disponíveis neste pacote.",
    de: "Anzahl der Premium-Themes in diesem Paket.",
    fr: "Nombre de thèmes premium disponibles dans ce forfait."
  },
  "Access configurable theme components such as navigation and card styles.": {
    en: "Access configurable theme components such as navigation and card styles.",
    ur: "نیویگیشن اور کارڈ اسٹائلز جیسے کنفیگر ایبل تھیم کمپوننٹس استعمال کریں۔",
    es: "Accede a componentes configurables como navegación y estilos de tarjetas.",
    ar: "استخدم مكونات قالب قابلة للضبط مثل التنقل وأنماط البطاقات.",
    tr: "Navigasyon ve kart stilleri gibi yapılandırılabilir tema bileşenlerine erişin.",
    hi: "नेविगेशन और कार्ड स्टाइल जैसे कॉन्फिगर करने योग्य थीम कंपोनेंट्स का उपयोग करें।",
    pt: "Acesse componentes configuráveis como navegação e estilos de cards.",
    de: "Nutze konfigurierbare Theme-Komponenten wie Navigation und Kartenstile.",
    fr: "Accédez à des composants configurables comme la navigation et les styles de cartes."
  },
  "Extended customization options beyond standard theme controls.": {
    en: "Extended customization options beyond standard theme controls.",
    ur: "اسٹینڈرڈ تھیم کنٹرولز سے آگے مزید کسٹمائزیشن آپشنز۔",
    es: "Opciones de personalización avanzadas más allá de los controles estándar.",
    ar: "خيارات تخصيص موسعة تتجاوز عناصر التحكم القياسية للقالب.",
    tr: "Standart tema kontrollerinin ötesinde gelişmiş özelleştirme seçenekleri.",
    hi: "स्टैंडर्ड थीम कंट्रोल से आगे विस्तृत कस्टमाइजेशन विकल्प।",
    pt: "Opções avançadas de personalização além dos controles padrão.",
    de: "Erweiterte Anpassungsoptionen über Standard-Theme-Steuerungen hinaus.",
    fr: "Options de personnalisation avancées au-delà des contrôles standards."
  },
  "Localization support for any language required by the customer.": {
    en: "Localization support for any language required by the customer.",
    ur: "کسٹمر کو درکار کسی بھی زبان کے لیے لوکلائزیشن سپورٹ۔",
    es: "Soporte de localización para cualquier idioma requerido por el cliente.",
    ar: "دعم الترجمة لأي لغة يحتاجها العميل.",
    tr: "Müşterinin ihtiyaç duyduğu herhangi bir dil için yerelleştirme desteği.",
    hi: "ग्राहक द्वारा आवश्यक किसी भी भाषा के लिए लोकलाइजेशन सपोर्ट।",
    pt: "Suporte de localização para qualquer idioma exigido pelo cliente.",
    de: "Lokalisierungsunterstützung für jede vom Kunden benötigte Sprache.",
    fr: "Support de localisation pour toute langue requise par le client."
  },
  "Included maintenance period after ownership purchase.": {
    en: "Included maintenance period after ownership purchase.",
    ur: "اونرشپ خریداری کے بعد شامل مینٹیننس مدت۔",
    es: "Periodo de mantenimiento incluido después de comprar la propiedad.",
    ar: "فترة الصيانة المضمنة بعد شراء الملكية.",
    tr: "Sahiplik satın alımından sonra dahil bakım süresi.",
    hi: "ओनरशिप खरीद के बाद शामिल मेंटेनेंस अवधि।",
    pt: "Período de manutenção incluído após a compra de propriedade.",
    de: "Enthaltener Wartungszeitraum nach dem Ownership-Kauf.",
    fr: "Période de maintenance incluse après l'achat de propriété."
  },
  "Manage portfolio content from the customer dashboard.": {
    en: "Manage portfolio content from the customer dashboard.",
    ur: "کسٹمر ڈیش بورڈ سے پورٹ فولیو مواد مینیج کریں۔",
    es: "Gestiona el contenido del portafolio desde el panel del cliente.",
    ar: "أدر محتوى البورتفوليو من لوحة تحكم العميل.",
    tr: "Portfolyo içeriğini müşteri panelinden yönetin.",
    hi: "कस्टमर डैशबोर्ड से पोर्टफोलियो कंटेंट मैनेज करें।",
    pt: "Gerencie o conteúdo do portfólio pelo painel do cliente.",
    de: "Verwalte Portfolio-Inhalte im Kundendashboard.",
    fr: "Gérez le contenu du portfolio depuis le tableau de bord client."
  },
  "Portfolio layouts adapt for mobile, tablet, and desktop screens.": {
    en: "Portfolio layouts adapt for mobile, tablet, and desktop screens.",
    ur: "پورٹ فولیو لے آؤٹس موبائل، ٹیبلٹ اور ڈیسک ٹاپ اسکرینز کے مطابق ڈھلتے ہیں۔",
    es: "Los diseños del portafolio se adaptan a móvil, tablet y escritorio.",
    ar: "تتكيّف تخطيطات البورتفوليو مع شاشات الهاتف والتابلت وسطح المكتب.",
    tr: "Portfolyo düzenleri mobil, tablet ve masaüstü ekranlara uyum sağlar.",
    hi: "पोर्टफोलियो लेआउट मोबाइल, टैबलेट और डेस्कटॉप स्क्रीन के अनुसार ढलते हैं।",
    pt: "Os layouts do portfólio se adaptam a mobile, tablet e desktop.",
    de: "Portfolio-Layouts passen sich Mobil-, Tablet- und Desktop-Bildschirmen an.",
    fr: "Les mises en page du portfolio s'adaptent au mobile, à la tablette et au bureau."
  },
  "Number of custom category or subcategory requests a tenant can submit.": {
    en: "Number of custom category or subcategory requests a tenant can submit.",
    ur: "ٹیننٹ کتنی کسٹم کیٹیگری یا سب کیٹیگری درخواستیں بھیج سکتا ہے۔",
    es: "Número de solicitudes de categoría o subcategoría personalizada que un tenant puede enviar.",
    ar: "عدد طلبات التصنيف أو التصنيف الفرعي المخصص التي يمكن للمستأجر إرسالها.",
    tr: "Bir kiracının gönderebileceği özel kategori veya alt kategori talebi sayısı.",
    hi: "टेनेंट द्वारा भेजे जा सकने वाले कस्टम कैटेगरी या सबकैटेगरी अनुरोधों की संख्या।",
    pt: "Número de pedidos de categoria ou subcategoria personalizada que um tenant pode enviar.",
    de: "Anzahl eigener Kategorie- oder Unterkategorie-Anfragen, die ein Tenant senden kann.",
    fr: "Nombre de demandes de catégorie ou sous-catégorie personnalisée qu'un tenant peut envoyer."
  },
  "A curated selection of our finest moments across weddings, portraits, and creative sessions.": {
    en: "A curated selection of our finest moments across weddings, portraits, and creative sessions.",
    ur: "شادیوں، پورٹریٹس اور تخلیقی سیشنز کے بہترین لمحات کا منتخب مجموعہ۔",
    es: "Una selección curada de nuestros mejores momentos en bodas, retratos y sesiones creativas.",
    ar: "مجموعة مختارة من أجمل لحظاتنا في حفلات الزفاف والبورتريه والجلسات الإبداعية.",
    tr: "Düğünler, portreler ve yaratıcı çekimlerden en iyi anlarımızın seçilmiş bir derlemesi.",
    hi: "शादियों, पोर्ट्रेट और क्रिएटिव सेशन के हमारे बेहतरीन पलों का चुना हुआ संग्रह।",
    pt: "Uma seleção curada dos nossos melhores momentos em casamentos, retratos e sessões criativas.",
    de: "Eine kuratierte Auswahl unserer schönsten Momente aus Hochzeiten, Porträts und kreativen Sessions.",
    fr: "Une sélection soignée de nos meilleurs moments de mariages, portraits et séances créatives."
  },
  "An intimate garden ceremony captured in soft afternoon light.": {
    en: "An intimate garden ceremony captured in soft afternoon light.",
    ur: "نرم دوپہر کی روشنی میں محفوظ کی گئی ایک قریبی گارڈن تقریب۔",
    es: "Una ceremonia íntima en jardín capturada con luz suave de la tarde.",
    ar: "مراسم حديقة حميمة التُقطت بضوء بعد الظهر الناعم.",
    tr: "Yumuşak öğleden sonra ışığında çekilmiş samimi bir bahçe töreni.",
    hi: "मुलायम दोपहर की रोशनी में कैप्चर की गई एक आत्मीय गार्डन सेरेमनी।",
    pt: "Uma cerimônia íntima no jardim capturada com luz suave da tarde.",
    de: "Eine intime Gartenzeremonie im weichen Nachmittagslicht festgehalten.",
    fr: "Une cérémonie intime dans un jardin capturée dans une douce lumière d'après-midi."
  },
  "Bold portraits shot against the raw textures of the city.": {
    en: "Bold portraits shot against the raw textures of the city.",
    ur: "شہر کی خام بناوٹوں کے پس منظر میں شوٹ کیے گئے جاندار پورٹریٹس۔",
    es: "Retratos audaces fotografiados contra las texturas crudas de la ciudad.",
    ar: "بورتريهات جريئة صُورت أمام خامات المدينة الصريحة.",
    tr: "Şehrin ham dokuları önünde çekilmiş güçlü portreler.",
    hi: "शहर की कच्ची बनावटों के सामने शूट किए गए बोल्ड पोर्ट्रेट।",
    pt: "Retratos marcantes fotografados contra as texturas cruas da cidade.",
    de: "Ausdrucksstarke Porträts vor den rauen Texturen der Stadt.",
    fr: "Des portraits audacieux photographiés devant les textures brutes de la ville."
  },
  "First light over the northern peaks — a personal landscape project.": {
    en: "First light over the northern peaks — a personal landscape project.",
    ur: "شمالی چوٹیوں پر پہلی روشنی — ایک ذاتی لینڈ اسکیپ پروجیکٹ۔",
    es: "Primera luz sobre los picos del norte: un proyecto personal de paisaje.",
    ar: "أول ضوء فوق القمم الشمالية — مشروع مناظر طبيعية شخصي.",
    tr: "Kuzey zirvelerinde ilk ışık — kişisel bir manzara projesi.",
    hi: "उत्तरी चोटियों पर पहली रोशनी — एक निजी लैंडस्केप प्रोजेक्ट।",
    pt: "Primeira luz sobre os picos do norte — um projeto pessoal de paisagem.",
    de: "Erstes Licht über den nördlichen Gipfeln — ein persönliches Landschaftsprojekt.",
    fr: "Première lumière sur les sommets du nord — un projet paysage personnel."
  },
  "Corporate event coverage with candid moments and stage highlights.": {
    en: "Corporate event coverage with candid moments and stage highlights.",
    ur: "کینڈڈ لمحات اور اسٹیج ہائی لائٹس کے ساتھ کارپوریٹ ایونٹ کوریج۔",
    es: "Cobertura de eventos corporativos con momentos espontáneos y destacados del escenario.",
    ar: "تغطية فعاليات الشركات بلحظات عفوية ولقطات بارزة من المسرح.",
    tr: "Doğal anlar ve sahne öne çıkanlarıyla kurumsal etkinlik çekimi.",
    hi: "कैंडिड पलों और स्टेज हाइलाइट्स के साथ कॉर्पोरेट इवेंट कवरेज।",
    pt: "Cobertura de eventos corporativos com momentos espontâneos e destaques do palco.",
    de: "Corporate-Event-Reportage mit spontanen Momenten und Bühnen-Highlights.",
    fr: "Couverture d'événements d'entreprise avec moments spontanés et temps forts sur scène."
  },
  "Stories behind recent sessions, galleries, and visual decisions.": {
    en: "Stories behind recent sessions, galleries, and visual decisions.",
    ur: "حالیہ سیشنز، گیلریز اور بصری فیصلوں کے پیچھے کی کہانیاں۔",
    es: "Historias detrás de sesiones recientes, galerías y decisiones visuales.",
    ar: "قصص وراء الجلسات الحديثة والمعارض والقرارات البصرية.",
    tr: "Son çekimlerin, galerilerin ve görsel kararların arkasındaki hikayeler.",
    hi: "हाल के सेशन, गैलरी और विजुअल फैसलों के पीछे की कहानियां।",
    pt: "Histórias por trás de sessões recentes, galerias e decisões visuais.",
    de: "Geschichten hinter aktuellen Sessions, Galerien und visuellen Entscheidungen.",
    fr: "Histoires derrière les séances récentes, les galeries et les choix visuels."
  },
  "Guides for selecting, preparing, and publishing portfolio work.": {
    en: "Guides for selecting, preparing, and publishing portfolio work.",
    ur: "پورٹ فولیو ورک منتخب، تیار اور شائع کرنے کے لیے گائیڈز۔",
    es: "Guías para seleccionar, preparar y publicar trabajos de portafolio.",
    ar: "أدلة لاختيار أعمال البورتفوليو وتجهيزها ونشرها.",
    tr: "Portfolyo çalışmalarını seçme, hazırlama ve yayınlama rehberleri.",
    hi: "पोर्टफोलियो काम चुनने, तैयार करने और प्रकाशित करने की गाइड।",
    pt: "Guias para selecionar, preparar e publicar trabalhos de portfólio.",
    de: "Leitfäden zum Auswählen, Vorbereiten und Veröffentlichen von Portfolio-Arbeiten.",
    fr: "Guides pour sélectionner, préparer et publier des travaux de portfolio."
  },
  "Notes on process, light, locations, and preparation.": {
    en: "Notes on process, light, locations, and preparation.",
    ur: "عمل، روشنی، لوکیشنز اور تیاری پر نوٹس۔",
    es: "Notas sobre proceso, luz, ubicaciones y preparación.",
    ar: "ملاحظات حول العملية والضوء والمواقع والتحضير.",
    tr: "Süreç, ışık, mekanlar ve hazırlık üzerine notlar.",
    hi: "प्रक्रिया, रोशनी, लोकेशन और तैयारी पर नोट्स।",
    pt: "Notas sobre processo, luz, locais e preparação.",
    de: "Notizen zu Prozess, Licht, Locations und Vorbereitung.",
    fr: "Notes sur le processus, la lumière, les lieux et la préparation."
  }
};

export function localizedPlatformCopy(en: string, overrides: Partial<Record<PlatformCopyLocale, string>> = {}): PlatformCopy {
  const base = platformCopyTranslations[en] ?? platformLocales.reduce<PlatformCopy>((result, locale) => {
    result[locale] = en;
    return result;
  }, {} as PlatformCopy);

  return {
    ...base,
    ...overrides,
    en
  };
}

export function localizedPlatformFeature(name: string, limit?: number | null): PlatformCopy {
  const translated = localizedPlatformCopy(name);

  if (limit == null) {
    return translated;
  }

  return Object.fromEntries(platformLocales.map((locale) => [locale, `${translated[locale]} (${limit})`])) as PlatformCopy;
}
