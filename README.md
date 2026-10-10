# Samish Digital Wave portfolio

A complete, framework-free portfolio site built with semantic HTML, shared CSS and vanilla JavaScript. Open `index.html` directly for a preview, or serve the folder locally for the best booking-form experience.

## Files

- `index.html` — Home
- `about.html` — About Me
- `services.html` — Services
- `contact.html` — Contact and booking form
- `assets/samish-logo-horizontal-dark.png` — primary navbar and footer logo
- `assets/samish-logo-stacked-dark.png` — social preview and favicon artwork
- `assets/samish-maharjan.png` — website-ready portrait
- `css/style.css` — shared responsive design
- `js/script.js` — menu, animations, counters, slider, FAQ and form validation

## Edit the placeholders

Search the project for `placeholder` to find the sample testimonials, journey milestones and skill levels that still need real content. The email (`maharjansamish@gmail.com`), phone number and Kathmandu location are already applied consistently across the contact page and all four footers.

Replace the social `href="#"` values with the full LinkedIn, Facebook and Instagram profile URLs. Replace only verified statistics and client testimonials.

## Swap the portrait

Replace `assets/samish-maharjan.png` with another image using the same filename, or change the image path in `about.html` and the Open Graph image path in each page. A portrait around 4:5 works best; CSS crops it responsively.

## Booking form and email activation

The form in `contact.html` is connected to **FormSubmit** and sends valid consultation requests to `maharjansamish@gmail.com`. On a hosted page, JavaScript uses FormSubmit's AJAX endpoint so visitors stay on the website and see a success message. When the site is opened directly as a `file://` page, it switches to FormSubmit's normal POST endpoint and includes the required `_url` field.

FormSubmit requires a one-time activation for a new receiving email address:

1. Preview the site through a local web server or deploy it.
2. Submit one complete test request from the contact page.
3. Open the activation email sent by FormSubmit to `maharjansamish@gmail.com` and click **Activate Form**. Check Spam if it is not in the inbox.
4. Submit the form again and confirm the request arrives in the inbox.

Until activation is completed, FormSubmit sends activation emails instead of immediately forwarding new requests. The form includes a custom email subject, table layout and honeypot spam protection. If you add a Calendly link later, replace the booking button URLs with your scheduling URL.

## Preview locally

You can double-click `index.html` for a visual preview; the form will use its direct-post fallback. For an experience that matches deployment and keeps the success message on the page, run a simple local server from this folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

- **Netlify:** drag this folder into Netlify Drop, or connect the Git repository. No build command is needed; publish the project root.
- **Vercel:** import the repository as an “Other” project. Leave the build command empty and use `.` as the output directory.
- **GitHub Pages:** push the files to a repository, then enable Pages from the root of the selected branch.

No package installation or build step is required.
