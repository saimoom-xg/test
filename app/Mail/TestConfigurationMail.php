<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestConfigurationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $siteName,
        public string $fromEmail,
        public string $fromSenderName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[{$this->siteName}] SMTP Configuration Test Email",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "<h2>Congratulations!</h2><p>This is a test email sent from <strong>{$this->siteName}</strong> to verify that your mail/SMTP settings are configured correctly.</p>",
        );
    }
}
