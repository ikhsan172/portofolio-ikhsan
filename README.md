# Portofolio Ikhsan Saputra

Website portofolio interaktif dan modern yang dibangun dengan fokus pada performa, estetika UI, dan grafis interaktif.

## 📁 Struktur Direktori

```text
portfolio-ikhsan/
├── index.html                  # Halaman utama portofolio
├── assets/
│   ├── css/
│   │   └── style.css           # Styling kustom (Design tokens, glassmorphism, responsive)
│   ├── js/
│   │   └── main.js             # Logika interaktif (Three.js 3D, GSAP physics, Lucide, Tabs)
│   └── images/
│       └── ikhsan.jpg          # Pas foto profil pada kartu ID badge
└── README.md                   # Dokumentasi proyek
```

## 🚀 Fitur & Teknologi

- **Frontend & UI**:
  - Semantic HTML5 & CSS3 modern (Variables, Grid, Flexbox, Safe-area insets).
  - Terstruktur rapi untuk kemudahan migrasi ke komponen React / Tailwind jika diinginkan.
- **Animasi & Grafis**:
  - **Three.js**: Latar belakang semesta partikel 3D interaktif yang merespons pergerakan kursor mouse.
  - **GSAP**: Efek kemiringan 3D (*physics tilt*) interaktif pada ID card lanyard, animasi pembuka halus, dan transisi tab.
- **Font & Widget**:
  - **Lucide Icons**: Ikon SVG tajam dan modern di seluruh elemen navigasi, kontak, dan riwayat.
  - **Google Font API**: Tipografi bersih menggunakan font *Inter*.
  - **Spotify Embed Widget**: Pemutar musik terintegrasi langsung di bagian About.

## 💻 Cara Menjalankan

1. Cukup buka file `index.html` langsung di browser favorit Anda (Chrome, Edge, Firefox), atau
2. Jalankan ekstensi **Live Server** di VS Code / Antigravity IDE untuk pengalaman reload otomatis.

