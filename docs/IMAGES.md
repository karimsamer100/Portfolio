# Adding photos and certificates

Drop files into `src/assets/photos/` with the names below. No code changes are needed: the
site picks them up on the next `npm run dev` or `npm run build`. Allowed formats: `.jpg`,
`.jpeg`, `.png`, `.webp`, `.avif`. Use lowercase names. Folder names match loosely (`ain-shams`, `ainshams` and `Ain_Shams` are the same folder).

Anything missing simply doesn't show on the live site. In dev, or with `?preview` in the
URL, missing images appear as grey placeholders so you can see where they go.

## 1. Hero portrait

| File | What |
|---|---|
| `src/assets/photos/portrait.webp` (or `.png`) | You, cut out with a **transparent background** (PNG or WebP). Head and shoulders to waist, facing camera, at least 1200 px. It stands on the right of the name (below it on phones), and its bottom edge sits on the bottom of the screen. |

Tip: remove.bg or Photoshop "Remove background" both work. It is shown in full colour.

## 2. Experience (several images per stop)

One folder per stop. Inside, name the images `1.jpg`, `2.jpg`, `3.jpg` … in the order you
want them. Any file whose name starts with `cert` (for example
`certificate.jpg`, `certificate-2.jpg`) gets the white certificate frame. Two to four images
per stop looks best. Photos are shown in their original colour, cropped to about 4:3.

| Stop | Folder |
|---|---|
| Ain Shams University (logo only) | `src/assets/photos/experience/ain-shams/logo.png` |
| Huawei × NTI | `src/assets/photos/experience/huawei/` |
| CIB Egypt | `src/assets/photos/experience/cib/` |
| GSS | `src/assets/photos/experience/gss/` |
| DEPI | `src/assets/photos/experience/depi/` |
| Konecta | `src/assets/photos/experience/konecta/` |
| Dell Technologies | `src/assets/photos/experience/dell/` |
| Cisco Egypt | `src/assets/photos/experience/cisco/` |

A file named `logo.png` in any of these folders is shown above that stop instead of as a card
(Ain Shams uses only this). Keep photos under about 2 MB; very large camera files slow the page.

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
