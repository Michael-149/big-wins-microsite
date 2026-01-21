import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Logo and Description */}
          <div className="flex flex-col gap-6">
            <Image
              src="/big-wins-microsite/images/SIL-Logo-RGB-Colour-soft.png"
              alt="Stanford Impact Labs"
              width={200}
              height={60}
              className="h-10 w-auto brightness-0 invert"
              loading="lazy"
              style={{ objectFit: 'contain' }}
            />
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Powered by Stanford Impact Labs, partnering to put social science to use for society.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:items-end gap-6">
            <nav className="flex flex-col md:items-end gap-3" aria-label="Footer navigation">
              <a
                href="https://impact.stanford.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sil-primary transition-colors text-sm font-medium"
              >
                Stanford Impact Labs →
              </a>
              <a
                href="/about"
                className="text-gray-300 hover:text-sil-primary transition-colors text-sm font-medium"
              >
                About This Project
              </a>
              <a
                href="https://forms.gle/gLgeuRk9qD1dm5XV9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sil-primary transition-colors text-sm font-medium"
              >
                Report Bugs or Errors
              </a>
              <a
                href="https://michael-149.github.io/big-wins/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sil-primary transition-colors text-sm font-medium"
              >
                Play the Game 🎮
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Stanford Impact Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
