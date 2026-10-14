import { config as c } from '../data/site-config.mjs';
import { link } from '../layouts/page.mjs';
import { product as p } from '../data/product-facts.mjs';
export default {
  route: '', label: 'Overview', modified: '2026-10-14',
  title: 'RelayInbox — Forward Android SMS to Telegram',
  description: 'Receive SMS, incoming caller numbers, and battery alerts from your second Android phone in Telegram. Personal bot, direct delivery, and a one-time purchase after a 14-day trial.',
  body: `<section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">A small utility for Android</p>
      <h1>SMS from your other phone.<br>In Telegram.</h1>
      <p class="lead">Leave the receiving phone at home. Get its SMS, incoming caller numbers, and battery alerts in your personal Telegram bot, ready to read on another phone or computer.</p>
      <p class="supporting">14 days to try the current test build. Then one purchase, with no subscription or automatic charge.</p>
      <div class="actions"><a href="${p.playUrl}" class="button">Open in Google Play</a>${link('setup/', 'Setup guide', 'text-link')}</div>
      <p class="availability">Currently in testing. Google Play access may require an authorized tester account.</p>
    </div>
    <figure class="app-preview">
      <div class="screens">
        <a href="${c.path('assets/messages.webp')}" aria-label="View the full Messages screen"><img src="${c.path('assets/messages.webp')}" width="480" height="853" alt="RelayInbox Messages screen showing fictional SMS and delivery states"></a>
        <a href="${c.path('assets/status.webp')}" aria-label="View the full Status screen"><img src="${c.path('assets/status.webp')}" width="480" height="853" alt="RelayInbox Status screen with forwarding controls and the phone health checklist"></a>
      </div>
      <figcaption>Actual app layouts with fictional demo data.<br>Native UI renders, not physical-device screenshots.</figcaption>
    </figure>
  </section>
  <dl class="product-summary" aria-label="At a glance">
    <div><dt>Receiving device</dt><dd>Android 7.0 or later</dd></div>
    <div><dt>Destination</dt><dd>Your personal Telegram bot</dd></div>
    <div><dt>Message relay</dt><dd>Direct from your phone to Telegram</dd></div>
  </dl>
  <section class="editorial-row" aria-labelledby="phone-updates">
    <div class="row-heading"><p class="eyebrow">More than SMS</p><h2 id="phone-updates">Keep an eye on the phone you left behind.</h2></div>
    <div class="row-body"><dl class="privacy-facts">
      <div><dt>Incoming SMS</dt><dd>Read messages in Telegram, with sender and text filters to skip unwanted SMS.</dd></div>
      <div><dt>Caller numbers</dt><dd>Enable incoming-call alerts to see the caller’s number in Telegram. Available on supported Android 10+ phones with the caller-ID/screening role enabled.</dd></div>
      <div><dt>Battery alerts</dt><dd>Get low-battery warnings at 15%, 10%, and 5%, and an alert when charging reaches your chosen level.</dd></div>
    </dl><p class="supporting">Caller alerts report an incoming call; they do not relay call audio. Hidden numbers are unavailable, and saved-contact calls require optional Contacts access. Call and battery alerts are optional.</p></div>
  </section>
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">Why RelayInbox</p><h2>Your bot.<br>One purchase.</h2></div>
    <div class="row-body"><h3>No RelayInbox account or relay server</h3><p>Your phone sends directly to Telegram using your personal bot. No RelayInbox account is needed. Telegram still processes and stores the delivered content.</p><h3>One purchase for the current features</h3><p>The 1.1 test build includes SMS forwarding, caller-number alerts, and battery alerts in one unlock after a 14-day trial. There is no recurring subscription. Regional checkout prices remain unconfirmed.</p><h3>A delivery state you can check</h3><p>See what is pending, what was sent, and what needs attention. A local queue keeps accepted messages while internet is unavailable; temporary failures retry automatically. Diagnostics and a connection test help you troubleshoot.</p>${link('faq/', 'Read feature requirements and answers', 'text-link')}</div>
  </section>
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">How it works</p><h2>The phone stays.<br>The SMS reaches you.</h2></div>
    <div class="row-body"><p>The Android phone still receives the SMS. With permission granted and forwarding enabled, RelayInbox sends selected messages directly to Telegram Bot API over HTTPS.</p>
      <ol class="delivery-path"><li><strong>Your Android phone</strong><span>Receives SMS and queues eligible messages locally.</span></li><li><strong>Telegram Bot API</strong><span>Receives the forwarded content through your bot.</span></li><li><strong>Your destination chat</strong><span>Available in Telegram on your other devices.</span></li></ol>
      <p class="supporting">Keep the receiving phone powered, connected to cellular SMS service, and online for delivery. Telegram also needs internet on the device where you read messages.</p>
    </div>
  </section>
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">Getting started</p><h2>Your phone.<br>Your bot.</h2>${link('setup/', 'Open the setup guide', 'text-link')}</div>
    <div class="row-body"><ol class="setup-steps"><li><h3>Install on the receiving Android phone</h3><p>Open the Google Play listing with your authorized tester account. If it is unavailable, contact the developer for access.</p></li><li><h3>Connect your personal Telegram bot</h3><p>Create a bot through BotFather, press Start in its chat, then paste the token inside RelayInbox. Keep the token private.</p></li><li><h3>Enable forwarding and send a test SMS</h3><p>Read the disclosure, grant SMS access, and turn forwarding on. A harmless real SMS checks the full path.</p></li></ol></div>
  </section>
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">Everyday use</p><h2>See what arrived.<br>Check what is waiting.</h2></div>
    <div class="row-body"><p>Review delivery states in Messages. Sender and message filters let you skip unwanted SMS. When internet is unavailable, accepted messages wait in a local queue.</p><p>Temporary failures retry automatically. Configuration errors need correction and a retry. Android battery restrictions can delay delivery; interrupted confirmation can cause a duplicate.</p><p>Messages received while forwarding is paused are not queued. This is a convenience tool, not a guaranteed emergency or verification-code delivery service.</p>${link('guides/forward-android-sms-to-telegram/', 'Read the practical forwarding guide', 'text-link')}</div>
  </section>
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">Privacy</p><h2>Know where your messages go.</h2>${link('privacy/', 'Read the privacy explanation', 'text-link')}</div>
    <div class="row-body"><dl class="privacy-facts"><div><dt>On your phone</dt><dd>Queued messages and recent history are stored locally. New bot credentials use Android Keystore-backed encryption.</dd></div><div><dt>At Telegram</dt><dd>Delivered content is processed and stored by Telegram. Ordinary bot chats are not end-to-end encrypted.</dd></div><div><dt>Other services</dt><dd>Included Google SDKs can collect technical diagnostics, even with translation off. There is no RelayInbox-operated message storage backend.</dd></div></dl><p class="supporting">Forwarding an OTP creates another sensitive copy. Review these boundaries before enabling forwarding for private messages.</p></div>
  </section>
  <section class="editorial-row release-row" aria-labelledby="availability">
    <div class="row-heading"><p class="eyebrow">Availability</p><h2 id="availability">In testing.</h2></div>
    <div class="row-body"><p>The 1.1 test release implements 14 days of free access followed by a one-time Google Play purchase, with no subscription or automatic charge. Regional checkout prices and public release availability remain unconfirmed.</p><p><a href="${p.playUrl}">Open RelayInbox in Google Play</a>. Testing access may be restricted. If Google Play says the app is unavailable, <a href="mailto:${p.contact}">contact the developer about test access</a>. These guides describe the current test build.</p><p>Questions about SIM cards, travel, iPhone access, or offline delivery? ${link('faq/', 'Read the FAQ')}.</p></div>
  </section>`,
};
