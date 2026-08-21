import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import { useWaitlistTranslations } from '../../i18n/utils';
import { defaultLang } from '../../i18n/ui';

interface WaitlistFormProps {
  lang?: any;
}

export function WaitlistForm({ lang = defaultLang }: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [wouldBuy, setWouldBuy] = useState<'yes' | 'no' | null>(null);
  const [price, setPrice] = useState('');
  const [email, setEmail] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = useWaitlistTranslations(lang as any);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace this URL with your own Formspree endpoint (e.g. https://formspree.io/f/your_id)
    const FORMSPREE_URL = "https://formspree.io/f/placeholder";
    
    try {
      if (FORMSPREE_URL.includes("placeholder")) {
        // If it's a placeholder, just simulate a successful submit for now
        console.log("Simulating submit because Formspree URL is placeholder", { wouldBuy, price, email });
      } else {
        await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ wouldBuy, price, email, source: 'Pro Calculator Waitlist' })
        });
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }

    setSubmitted(true);
    
    // Fire confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
    });
  };

  if (!isClient) return <div className="h-[400px]" />;

  if (submitted) {
    return (
      <div className="bg-canvas-soft-2 border border-hairline rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-ink mb-2">{t('waitlist.success.title')}</h3>
        <p className="text-sm text-body leading-relaxed">
          {t('waitlist.success.desc')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-canvas rounded-xl shadow-card p-6 md:p-8 w-full border border-hairline text-left">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-ink mb-1">{t('waitlist.title')}</h3>
        <p className="text-sm text-body">{t('waitlist.subtitle')}</p>
      </div>

      {/* Q1 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-3">
          {t('waitlist.q1')}
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setWouldBuy('yes')}
            className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
              wouldBuy === 'yes' ? 'bg-ink text-canvas border-ink' : 'bg-canvas-soft border-hairline text-body hover:border-hairline-strong'
            }`}
          >
            {t('waitlist.yes')}
          </button>
          <button
            type="button"
            onClick={() => setWouldBuy('no')}
            className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
              wouldBuy === 'no' ? 'bg-ink text-canvas border-ink' : 'bg-canvas-soft border-hairline text-body hover:border-hairline-strong'
            }`}
          >
            {t('waitlist.no')}
          </button>
        </div>
      </div>

      {/* Dynamic Q2 & Q3 based on answer */}
      {wouldBuy === 'no' ? (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <label htmlFor="feedback" className="block text-sm font-medium text-ink mb-2">
            {t('waitlist.q2.alt')} <span className="text-mute font-normal">{t('waitlist.q2.alt.opt')}</span>
          </label>
          <textarea
            id="feedback"
            rows={3}
            placeholder={t('waitlist.feedback.ph')}
            className="w-full rounded-lg border border-hairline bg-canvas-soft p-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-hairline-strong transition-all resize-none"
          />
        </div>
      ) : (
        <>
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="price" className="block text-sm font-medium text-ink mb-2" dangerouslySetInnerHTML={{__html: t('waitlist.q2')}} />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute">$</span>
              <input
                id="price"
                type="text"
                inputMode="numeric"
                placeholder="59"
                value={price}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = val.split('.');
                  if (parts.length > 2) {
                    val = parts[0] + '.' + parts.slice(1).join('');
                  }
                  setPrice(val);
                }}
                className="w-full h-10 rounded-lg border border-hairline bg-canvas-soft pl-7 pr-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-hairline-strong transition-all"
              />
            </div>
          </div>

          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
              {t('waitlist.q3')} <span className="text-mute font-normal">{t('waitlist.q3.opt')}</span>
            </label>
            <input
              id="email"
              type="email"
              required={wouldBuy !== 'no'}
              placeholder="trader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 rounded-lg border border-hairline bg-canvas-soft px-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-hairline-strong transition-all"
            />
          </div>
        </>
      )}

      <Button type="submit" variant="primary" className="w-full h-11 text-base">
        {wouldBuy === 'no' ? t('waitlist.btn.feedback') : t('waitlist.btn.waitlist')}
      </Button>
      
      {wouldBuy !== 'no' && (
        <p className="mt-4 text-xs text-center text-mute">
          {t('waitlist.spam')}
        </p>
      )}
    </form>
  );
}
