import { config as c } from '../data/site-config.mjs';
import { link } from '../layouts/page.mjs';
export default {
  route: '', label: 'Overview', modified: '2026-10-12',
  title: 'RelayInbox — Forward Android SMS to Telegram',
  description: 'Read incoming SMS from your second Android phone in Telegram. Learn how RelayInbox connects your personal bot, handles offline delivery, and protects credentials.',
  body: `<section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">A small utility for Android</p>
      <h1>SMS from your other phone.<br>In Telegram.</h1>
      <p class="lead">Leave the receiving phone at home. RelayInbox forwards its incoming SMS to your personal Telegram bot, ready to read on another phone or computer.</p>
      <div class="actions">${link('setup/', 'Set up RelayInbox', 'button')}${link('privacy/', 'How your data is handled', 'text-link')}</div>
      <p class="availability">Currently in testing. Public Google Play release pending.</p>
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
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">How it works</p><h2>The phone stays.<br>The SMS reaches you.</h2></div>
    <div class="row-body"><p>The Android phone still receives the SMS. With permission granted and forwarding enabled, RelayInbox sends selected messages directly to Telegram Bot API over HTTPS.</p>
      <ol class="delivery-path"><li><strong>Your Android phone</strong><span>Receives SMS and queues eligible messages locally.</span></li><li><strong>Telegram Bot API</strong><span>Receives the forwarded content through your bot.</span></li><li><strong>Your destination chat</strong><span>Available in Telegram on your other devices.</span></li></ol>
      <p class="supporting">Keep the receiving phone powered, connected to cellular SMS service, and online for delivery. Telegram also needs internet on the device where you read messages.</p>
    </div>
  </section>
  <section class="editorial-row">
    <div class="row-heading"><p class="eyebrow">Getting started</p><h2>Your phone.<br>Your bot.</h2>${link('setup/', 'Open the setup guide', 'text-link')}</div>
    <div class="row-body"><ol class="setup-steps"><li><h3>Install on the receiving Android phone</h3><p>Use the developer’s authorized test distribution while public availability is pending.</p></li><li><h3>Connect your personal Telegram bot</h3><p>Create a bot through BotFather, press Start in its chat, then paste the token inside RelayInbox. Keep the token private.</p></li><li><h3>Enable forwarding and send a test SMS</h3><p>Read the disclosure, grant SMS access, and turn forwarding on. A harmless real SMS checks the full path.</p></li></ol></div>
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
    <div class="row-body"><p>The 1.1 test release implements 14 days of free access followed by a one-time Google Play purchase, with no subscription or automatic charge. Regional checkout prices and public release availability remain unconfirmed.</p><p class="owner-note"><strong>TODO — owner confirmation:</strong> add the verified public Google Play installation link and release availability. These guides describe the current test build.</p><p>Questions about SIM cards, travel, iPhone access, or offline delivery? ${link('faq/', 'Read the FAQ')}.</p></div>
  </section>`,
};
