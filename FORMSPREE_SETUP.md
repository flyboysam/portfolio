# Formspree Setup Instructions

Formspree is a simple, reliable form service that sends emails with all your form data. No backend required!

## Steps to Set Up Formspree:

1. **Sign up for Formspree** (free account):
   - Go to https://formspree.io/
   - Click "Sign Up" (free tier allows 50 submissions/month)
   - Verify your email address

2. **Create a New Form**:
   - After signing in, click "New Form" or "Get Started"
   - Give your form a name (e.g., "Portfolio Contact Form")
   - Set the email address to receive submissions: **sbevans@iastate.edu**
   - Click "Create Form"

3. **Get Your Form Endpoint**:
   - After creating the form, you'll see your form endpoint URL
   - It will look like: `https://formspree.io/f/YOUR_FORM_ID`
   - **Copy this URL** (you'll need it in the next step)

4. **Update Your Contact Form**:
   - Open `contact.html`
   - Find the form element (around line 98)
   - Replace `YOUR_FORM_ID` in the action attribute with your actual Form ID
   - Example: `action="https://formspree.io/f/xpzgvqyn"`

## Example:

Your form action should look like this:
```html
<form class="contact__form" id="contactForm" action="https://formspree.io/f/xpzgvqyn" method="POST">
```

## Testing:

1. Fill out the contact form on your website
2. Submit it
3. Check sbevans@iastate.edu for the email
4. The email will contain all the form data in a nicely formatted layout

## What You'll Receive:

Formspree will send you an email with:
- Name
- Email (you can reply directly to the sender)
- Phone number
- Subject
- Message

All in a clean, readable format!

## Free Tier Limits:

- 50 submissions per month (free)
- Unlimited forms
- Email notifications
- Spam protection

That's it! Much simpler than EmailJS - just sign up, create a form, and update the form action URL.

