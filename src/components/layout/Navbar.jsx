'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, X } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

// SVG Path component for Hamburger ↔ X morphing
const Path = props => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

// --- FlipText sem corte ---
const DURATION = 0.32;
const EASE = [0.22, 1, 0.36, 1];

function FlipText({
  children,
  hoverColorClass = 'text-vermelho',
  className = '',
  active = null,
}) {
  const topVariants = { rest: { y: 0 }, hover: { y: '100%' } };
  const bottomVariants = { rest: { y: '-110%' }, hover: { y: 0 } };

  return (
    <span className={`relative inline-block align-middle ${className}`}>
      <span
        aria-hidden="true"
        className="invisible block font-bold leading-[1.1] whitespace-nowrap px-[2px]"
      >
        {children}
      </span>

      <motion.span
        initial="rest"
        animate={active ? 'hover' : 'rest'}
        whileHover="hover"
        className="absolute inset-0 overflow-hidden"
      >
        <motion.span
          variants={topVariants}
          transition={{ type: 'tween', duration: DURATION, ease: EASE }}
          className="block text-white leading-[1.1] whitespace-nowrap px-[2px] will-change-transform"
        >
          {children}
        </motion.span>

        <motion.span
          variants={bottomVariants}
          transition={{ type: 'tween', duration: DURATION, ease: EASE }}
          className={`block absolute left-0 top-0 font-bold ${hoverColorClass} leading-[1.1] whitespace-nowrap px-[2px] will-change-transform`}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}

/** Subcomponente que usa useSearchParams — ficará dentro de <Suspense> */
function ScrollToParamEffect({ pathname, router, scrollToId }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname !== '/') return;
    const target = searchParams.get('to');
    if (!target) return;

    const t = setTimeout(() => {
      scrollToId(target);
      router.replace('/', { scroll: false });
    }, 0);

    return () => clearTimeout(t);
  }, [pathname, searchParams, router, scrollToId]);

  return null;
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  // ❌ REMOVIDO: const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [langHoverDesktop, setLangHoverDesktop] = useState(false);
  const [langHoverMobile, setLangHoverMobile] = useState(false);

  const desktopLangRef = useRef(null);
  const mobileLangRef = useRef(null);
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const toggleLang = () => setLangOpen(prev => !prev);

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      const clickDesktop = desktopLangRef.current?.contains(e.target);
      const clickMobile = mobileLangRef.current?.contains(e.target);
      if (!clickDesktop && !clickMobile) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========= SCROLL LOCK =========
  const bodyScrollY = useRef(0);
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isOpen) {
      bodyScrollY.current = window.scrollY || window.pageYOffset || 0;
      body.style.position = 'fixed';
      body.style.top = `-${bodyScrollY.current}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      html.style.overscrollBehaviorY = 'none';
    } else {
      const y = -parseInt(body.style.top || '0', 10) || 0;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overscrollBehaviorY = '';
      if (y) window.scrollTo(0, y);
    }

    return () => {
      const y = -parseInt(body.style.top || '0', 10) || 0;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overscrollBehaviorY = '';
      if (y) window.scrollTo(0, y);
    };
  }, [isOpen]);
  // ===============================

  const NAV_TALL = 64;
  const NAV_SMALL = 56;

  const menuVariants = {
    closed: { opacity: 0, y: '-100%' },
    open: {
      opacity: 1,
      y: 0,
      transition: { when: 'beforeChildren', staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  const navVariants = {
    atTop: {
      opacity: 1,
      height: NAV_TALL,
      transition: { type: 'tween', duration: 0.4, ease: EASE },
    },
    scrolled: {
      opacity: 0.98,
      height: NAV_SMALL,
      transition: { type: 'tween', duration: 0.4, ease: EASE },
    },
    flat: {
      opacity: 1,
      height: NAV_SMALL,
      transition: { type: 'tween', duration: 0.3, ease: EASE },
    },
  };

  const sections = [
    { id: 'sobre', label: t('navbar.about') },
    { id: 'projetos', label: t('navbar.projects') },
    { id: 'contato', label: t('navbar.contact') },
  ];

  const getOffset = () => {
    const h = navRef.current?.getBoundingClientRect().height || NAV_TALL;
    return Math.round(h + 8);
  };

  const scrollToId = id => {
    const offset = getOffset();
    let tries = 0;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (tries < 60) {
        tries += 1;
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);
  };

  // ✅ Correção: sempre fechar overlay antes de agir; no / faz scroll, fora do / navega
  const handleSectionClick = (e, id) => {
    if (e) e.preventDefault();

    const wasOpen = isOpen;
    setIsOpen(false);
    setLangOpen(false);

    if (pathname === '/') {
      setTimeout(() => {
        scrollToId(id);
      }, 0);
    } else {
      router.push(`/?to=${encodeURIComponent(id)}`, { scroll: false });
    }
  };

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-40 px-4 items-center justify-center ${
        scrolled ? 'bg-black/70 backdrop-blur-md shadow-lg' : 'bg-black'
      }`}
      variants={navVariants}
      initial={false}
      animate={isOpen ? 'flat' : scrolled ? 'scrolled' : 'atTop'}
    >
      <div className="max-w-7xl mx-auto h-full">
        <div className="h-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="block">
            <FlipText className="text-2xl" hoverColorClass="text-vermelho">
              Lucas Souza
            </FlipText>
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center p-2 text-white focus:outline-none -lg:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">{t('navbar.menu_open')}</span>
            <svg width="24" height="24" viewBox="0 0 23 23">
              <Path
                variants={{
                  closed: { d: 'M 2 2.5 L 20 2.5' },
                  open: { d: 'M 3 16.5 L 17 2.5' },
                }}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
              />
              <Path
                variants={{
                  closed: { d: 'M 4 9.423 L 18 9.423', opacity: 1 },
                  open: { opacity: 0 },
                }}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
                transition={{ duration: 0.1 }}
              />
              <Path
                variants={{
                  closed: { d: 'M 7 16.346 L 16 16.346' },
                  open: { d: 'M 3 2.5 L 17 16.346' },
                }}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
              />
            </svg>
          </button>

          {/* Desktop links + language selector */}
          <div className="hidden -lg:flex -lg:space-x-8 -lg:items-center">
            {sections.map(s => (
              <motion.div
                key={s.id}
                className="relative cursor-pointer"
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <a
                  href={pathname === '/' ? `#${s.id}` : `/?to=${s.id}`}
                  onClick={e => handleSectionClick(e, s.id)}
                  className="relative z-10 block whitespace-nowrap py-2"
                >
                  <FlipText
                    className="text-base"
                    hoverColorClass="text-vermelho"
                  >
                    {s.label}
                  </FlipText>
                </a>
              </motion.div>
            ))}

            {/* Desktop language selector */}
            <motion.div
              ref={desktopLangRef}
              className="relative cursor-pointer flex items-center"
              variants={itemVariants}
              initial="closed"
              animate="open"
            >
              <motion.button
                onMouseEnter={() => setLangHoverDesktop(true)}
                onMouseLeave={() => setLangHoverDesktop(false)}
                onClick={toggleLang}
                className="flex items-center gap-2 focus:outline-none leading-none"
              >
                <Globe
                  size={16}
                  className={`${
                    langHoverDesktop ? 'text-vermelho' : 'text-white'
                  } transition-colors duration-200`}
                />
                <span className="leading-none">
                  <FlipText
                    className="leading-none"
                    hoverColorClass="text-vermelho"
                    active={langHoverDesktop}
                  >
                    {t('navbar.language')}
                  </FlipText>
                </span>
                <ChevronDown
                  size={16}
                  className={`ml-0.5 shrink-0 -translate-y-px ${
                    langHoverDesktop ? 'text-vermelho' : 'text-white'
                  } transition-colors duration-200`}
                />
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-30 w-32 bg-[#1a1919] rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <button
                      onClick={() => changeLanguage('pt')}
                      className="block w-full text-left px-4 py-2 hover:text-vermelho transition-colors text-white"
                    >
                      Português
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="block w-full text-left px-4 py-2  hover:text-vermelho transition-colors text-white"
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-8"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Close button */}
            <button
              onClick={toggleMenu}
              className="absolute top-5 right-5 text-white focus:outline-none"
            >
              <X size={28} />
            </button>

            {/* Mobile links */}
            {sections.map(s => (
              <motion.div
                key={s.id}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <a
                  href={pathname === '/' ? `#${s.id}` : `/?to=${s.id}`}
                  onClick={e => handleSectionClick(e, s.id)}
                  className="block"
                >
                  <FlipText
                    className="text-2xl"
                    hoverColorClass="text-vermelho"
                  >
                    {s.label}
                  </FlipText>
                </a>
              </motion.div>
            ))}

            {/* Mobile language selector */}
            <motion.div
              ref={mobileLangRef}
              variants={itemVariants}
              initial="closed"
              animate="open"
              className="relative"
            >
              <motion.button
                onMouseEnter={() => setLangHoverMobile(true)}
                onMouseLeave={() => setLangHoverMobile(false)}
                onClick={toggleLang}
                className="flex items-center gap-2 text-2xl focus:outline-none leading-none"
              >
                <Globe
                  size={18}
                  className={`shrink-0 ${
                    langHoverMobile ? 'text-vermelho' : 'text-white'
                  } transition-colors duration-200`}
                />
                <span className="leading-none">
                  <FlipText
                    className="text-2xl leading-none"
                    hoverColorClass="text-vermelho"
                    active={langHoverMobile}
                  >
                    {t('navbar.language')}
                  </FlipText>
                </span>
                <ChevronDown
                  size={18}
                  className={`-translate-y-px shrink-0 ${
                    langHoverMobile ? 'text-vermelho' : 'text-white'
                  } transition-colors duration-200`}
                />
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <button
                      onClick={() => changeLanguage('pt')}
                      className="block w-full text-left px-4 py-2 text-base font-bold text-gray-900 hover:bg-gray-100"
                    >
                      Português
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="block w-full text-left px-4 py-2 text-base font-bold text-gray-900 hover:bg-gray-100"
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⬇️ O uso do hook ficou isolado e dentro de Suspense */}
      <Suspense fallback={null}>
        <ScrollToParamEffect
          pathname={pathname}
          router={router}
          scrollToId={scrollToId}
        />
      </Suspense>
    </motion.nav>
  );
}
