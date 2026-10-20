# Adding photos and certificates

Drop files into `src/assets/photos/` with the names below. No code changes are needed: the
site picks them up on the next `npm run dev` or `npm run build`. Allowed formats: `.jpg`,
`.jpeg`, `.png`, `.webp`, `.avif`. Use lowercase names exactly as written.

Anything missing simply doesn't show on the live site. In dev, or with `?preview` in the
URL, missing images appear as grey placeholders so you can see where they go.

## 1. Hero portrait

| File | What |
|---|---|
| `src/assets/photos/portrait.png` | You, cut out with a **transparent background** (PNG or WebP). Head and shoulders to waist, facing camera, about 1200×1600 px. The bottom edge of the photo sits on the bottom of the screen. |

Tip: remove.bg or Photoshop "Remove background" both work. It is shown in grayscale.

## 2. Experience (several images per stop)

One folder per stop. Inside, name the images `1.jpg`, `2.jpg`, `3.jpg` … in the order you
want them. Any file whose name starts with `certificate` (for example
`certificate.jpg`, `certificate-2.jpg`) gets the white certificate frame. Two to four images
per stop looks best. Photos are shown in grayscale, about 4:3.

| Stop | Folder |
|---|---|
| Huawei × NTI | `src/assets/photos/experience/huawei/` |
| CIB Egypt | `src/assets/photos/experience/cib/` |
| GSS | `src/assets/photos/experience/gss/` |
| DEPI | `src/assets/photos/experience/depi/` |
| Konecta | `src/assets/photos/experience/konecta/` |
| Dell Technologies | `src/assets/photos/experience/dell/` |
| Cisco Egypt | `src/assets/photos/experience/cisco/` |

Optional: a file named `background.jpg` in any of these folders (including
`experience/ain-shams/`) replaces that stop's large outlined name with a faint background photo.

Example:

```
src/assets/photos/experience/konecta/
  1.jpg
  2.jpg
  certificate.jpg
```

## 3. Certificates (shown in the certificate viewer)

A clear scan or export of each certificate, landscape, at least 1600 px wide. PDF is not
supported, so export the first page as PNG or JPG.

| Certificate | File |
|---|---|
| Machine Learning Specialization · DeepLearning.AI | `src/assets/photos/certificates/ml-specialization.jpg` |
| Intro to Deep Learning & Neural Networks · IBM | `src/assets/photos/certificates/ibm-deep-learning.jpg` |
| Responsible Innovation & Trustworthy AI · SAS | `src/assets/photos/certificates/sas-trustworthy-ai.jpg` |
| Machine Learning Engineer track · Microsoft / DEPI | `src/assets/photos/certificates/microsoft-ml-engineer.jpg` |
| HCIA-Big Data · Huawei | `src/assets/photos/certificates/huawei-hcia-big-data.jpg` |
| Cloud Foundations · AWS Academy | `src/assets/photos/certificates/aws-cloud-foundations.jpg` |
| Automation Developer Associate Training · UiPath | `src/assets/photos/certificates/uipath-automation.jpg` |
| IELTS 7.5 | `src/assets/photos/certificates/ielts.jpg` |

Before uploading, hide anything private on a certificate (ID numbers, date of birth,
candidate numbers, the IELTS TRF number).

## Size

Keep each file under about 500 KB (export as WebP or JPG quality ~80). Large originals slow
the site down.
