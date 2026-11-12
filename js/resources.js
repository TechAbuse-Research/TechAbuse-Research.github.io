/* =============================================================================
   Tech Abuse Handbook: edition manifest
   -----------------------------------------------------------------------------
   This file is the single place where handbook downloads are listed. The
   download buttons, language cards, "coming soon" labels and the edition
   counts on the page are all generated from it.

   HOW TO PUBLISH A NEW PDF (full instructions in README.md)
     1. Save the PDF using the naming convention, with the version at the end
        (dots written as hyphens), for example
          assets/documents/uk/handbook-pl-mobile-v1-0.pdf   (version 1.0)
     2. Find the matching entry in `editions` below.
     3. Change  status: 'coming-soon'  to  status: 'available', set `file`,
        and fill in `version` (required: it is part of both file names)
        and `size` (and `published` if known).
     4. Optional: add a cover image (see README.md, "Adding a cover").
     5. Optional: run  node tools/site-check.mjs --write  to check your work
        and refresh the list shown to visitors who have JavaScript turned off.

   FIELDS
     region     'uk' or 'switzerland' (see `regions`)
     language   a code from `languages`
     layout     'mobile' or 'desktop' (see `layouts`)
     status     'available'    PDF is in the repository and can be downloaded
                'coming-soon'  edition exists but the PDF has not been added yet
                'unavailable'  temporarily withdrawn (shown as "Currently unavailable")
     file       path to the PDF, relative to index.html. You may also use a
                full https:// address if the PDF is hosted elsewhere.
     size       optional, as you want it shown, e.g. '2.6 MB'
     cover      optional cover image, relative to index.html
     coverSrcset optional higher-resolution versions of the cover
     version    e.g. '1.0'. Required for available editions: it is shown on the
                page and is part of the file name, both the stored one
                (…-v1-0.pdf) and the name the download is saved under
                (…_v1-0.pdf). A new version gets a new file name.
     published  optional, e.g. 'November 2025'

   Never list the Tech Abuse Checklists here: they must not be published.
   ============================================================================= */

window.TAR_HANDBOOK = {
  regions: {
    uk: { name: 'United Kingdom', label: 'UK edition', sectionId: 'handbook-uk' },
    switzerland: { name: 'Switzerland', label: 'Swiss edition', sectionId: 'handbook-switzerland' }
  },

  /* `name` is shown in English; `nativeName` is how speakers write the
     language. Set dir: 'rtl' for right-to-left scripts. */
  languages: {
    en: { name: 'English', nativeName: 'English' },
    pl: { name: 'Polish', nativeName: 'Polski' },
    fa: { name: 'Persian (Farsi)', nativeName: 'فارسی', dir: 'rtl' },
    ur: { name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
    hi: { name: 'Hindi', nativeName: 'हिन्दी' },
    pt: { name: 'Portuguese', nativeName: 'Português' },
    de: { name: 'German', nativeName: 'Deutsch' },
    fr: { name: 'French', nativeName: 'Français' },
    it: { name: 'Italian', nativeName: 'Italiano' }
  },

  /* Order here is the order layouts are shown in. */
  layouts: {
    mobile: { name: 'Mobile layout', short: 'Mobile' },
    desktop: { name: 'Desktop layout', short: 'Desktop' }
  },

  editions: [
    /* ---------------- United Kingdom ---------------- */
    {
      region: 'uk', language: 'en', layout: 'mobile',
      status: 'available',
      file: 'assets/documents/uk/handbook-en-mobile-v1-0.pdf',
      size: '2.6 MB',
      cover: 'assets/images/covers/uk-en-mobile-360.webp',
      coverSrcset: 'assets/images/covers/uk-en-mobile-360.webp 360w, assets/images/covers/uk-en-mobile-720.webp 720w',
      version: '1.0',
      published: 'November 2025'
    },
    {
      region: 'uk', language: 'en', layout: 'desktop',
      status: 'available',
      file: 'assets/documents/uk/handbook-en-desktop-v1-0.pdf',
      size: '1.6 MB',
      cover: 'assets/images/covers/uk-en-desktop-480.webp',
      coverSrcset: 'assets/images/covers/uk-en-desktop-480.webp 480w, assets/images/covers/uk-en-desktop-960.webp 960w',
      version: '1.0',
      published: 'November 2025'
    },
    {
      region: 'uk', language: 'pl', layout: 'mobile',
      status: 'available',
      file: 'assets/documents/uk/handbook-pl-mobile-v1-0.pdf',
      size: '3.8 MB',
      cover: 'assets/images/covers/uk-pl-mobile-360.webp',
      coverSrcset: 'assets/images/covers/uk-pl-mobile-360.webp 360w, assets/images/covers/uk-pl-mobile-720.webp 720w',
      version: '1.0',
      published: 'November 2025'
    },
    {
      region: 'uk', language: 'fa', layout: 'mobile',
      status: 'available',
      file: 'assets/documents/uk/handbook-fa-mobile-v1-0.pdf',
      size: '3.8 MB',
      cover: 'assets/images/covers/uk-fa-mobile-360.webp',
      coverSrcset: 'assets/images/covers/uk-fa-mobile-360.webp 360w, assets/images/covers/uk-fa-mobile-720.webp 720w',
      version: '1.0',
      published: 'November 2025'
    },
    {
      region: 'uk', language: 'ur', layout: 'mobile',
      status: 'available',
      file: 'assets/documents/uk/handbook-ur-mobile-v1-0.pdf',
      size: '4.0 MB',
      cover: 'assets/images/covers/uk-ur-mobile-360.webp',
      coverSrcset: 'assets/images/covers/uk-ur-mobile-360.webp 360w, assets/images/covers/uk-ur-mobile-720.webp 720w',
      version: '1.0',
      published: 'November 2025'
    },
    {
      region: 'uk', language: 'hi', layout: 'mobile',
      status: 'available',
      file: 'assets/documents/uk/handbook-hi-mobile-v1-0.pdf',
      size: '3.8 MB',
      cover: 'assets/images/covers/uk-hi-mobile-360.webp',
      coverSrcset: 'assets/images/covers/uk-hi-mobile-360.webp 360w, assets/images/covers/uk-hi-mobile-720.webp 720w',
      version: '1.0',
      published: 'November 2025'
    },
    {
      region: 'uk', language: 'pt', layout: 'mobile',
      status: 'available',
      file: 'assets/documents/uk/handbook-pt-mobile-v1-0.pdf',
      size: '3.8 MB',
      cover: 'assets/images/covers/uk-pt-mobile-360.webp',
      coverSrcset: 'assets/images/covers/uk-pt-mobile-360.webp 360w, assets/images/covers/uk-pt-mobile-720.webp 720w',
      version: '1.0',
      published: 'November 2025'
    },

    /* ---------------- Switzerland ----------------
       Not published yet. When a PDF arrives, check its version and adjust the
       end of the file name to match (for example -v1-0 for version 1.0). */
    { region: 'switzerland', language: 'en', layout: 'mobile', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-en-mobile-v1-0.pdf' },
    { region: 'switzerland', language: 'en', layout: 'desktop', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-en-desktop-v1-0.pdf' },
    { region: 'switzerland', language: 'de', layout: 'mobile', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-de-mobile-v1-0.pdf' },
    { region: 'switzerland', language: 'de', layout: 'desktop', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-de-desktop-v1-0.pdf' },
    { region: 'switzerland', language: 'fr', layout: 'mobile', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-fr-mobile-v1-0.pdf' },
    { region: 'switzerland', language: 'fr', layout: 'desktop', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-fr-desktop-v1-0.pdf' },
    { region: 'switzerland', language: 'it', layout: 'mobile', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-it-mobile-v1-0.pdf' },
    { region: 'switzerland', language: 'it', layout: 'desktop', status: 'coming-soon', file: 'assets/documents/switzerland/handbook-it-desktop-v1-0.pdf' }
  ]
};
