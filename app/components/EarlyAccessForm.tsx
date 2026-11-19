"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CONTENT } from "@/content/site";
import { waitlistSignup } from "@/lib/backend-client";

type CountryTuple = [string, string, string, number];

const RAW_COUNTRIES: CountryTuple[] = [
  ["us", "+1", "United States", 0],
  ["ca", "+1", "Canada", 1],
  ["gb", "+44", "United Kingdom", 2],
  ["ng", "+234", "Nigeria", 3],
  ["za", "+27", "South Africa", 4],
  ["ke", "+254", "Kenya", 5],
  ["gh", "+233", "Ghana", 6],
  ["ae", "+971", "United Arab Emirates", 7],
  ["sa", "+966", "Saudi Arabia", 8],
  ["in", "+91", "India", 9],
  ["cn", "+86", "China", 10],
  ["jp", "+81", "Japan", 11],
  ["kr", "+82", "South Korea", 12],
  ["de", "+49", "Germany", 13],
  ["fr", "+33", "France", 14],
  ["it", "+39", "Italy", 15],
  ["es", "+34", "Spain", 16],
  ["pt", "+351", "Portugal", 17],
  ["br", "+55", "Brazil", 18],
  ["mx", "+52", "Mexico", 19],
  ["ar", "+54", "Argentina", 20],
  ["cl", "+56", "Chile", 21],
  ["co", "+57", "Colombia", 22],
  ["pe", "+51", "Peru", 23],
  ["ve", "+58", "Venezuela", 24],
  ["ec", "+593", "Ecuador", 25],
  ["py", "+595", "Paraguay", 26],
  ["uy", "+598", "Uruguay", 27],
  ["bo", "+591", "Bolivia", 28],
  ["au", "+61", "Australia", 29],
  ["nz", "+64", "New Zealand", 30],
  ["eg", "+20", "Egypt", 31],
  ["ma", "+212", "Morocco", 32],
  ["dz", "+213", "Algeria", 33],
  ["tn", "+216", "Tunisia", 34],
  ["ly", "+218", "Libya", 35],
  ["sd", "+249", "Sudan", 36],
  ["et", "+251", "Ethiopia", 37],
  ["so", "+252", "Somalia", 38],
  ["dj", "+253", "Djibouti", 39],
  ["tz", "+255", "Tanzania", 40],
  ["ug", "+256", "Uganda", 41],
  ["bi", "+257", "Burundi", 42],
  ["zm", "+260", "Zambia", 43],
  ["zw", "+263", "Zimbabwe", 44],
  ["na", "+264", "Namibia", 45],
  ["mw", "+265", "Malawi", 46],
  ["ls", "+266", "Lesotho", 47],
  ["bw", "+267", "Botswana", 48],
  ["sz", "+268", "Eswatini", 49],
  ["km", "+269", "Comoros", 50],
  ["mu", "+230", "Mauritius", 51],
  ["sc", "+248", "Seychelles", 52],
  ["cd", "+243", "DR Congo", 53],
  ["cg", "+242", "Republic of Congo", 54],
  ["cf", "+236", "Central African Republic", 55],
  ["td", "+235", "Chad", 56],
  ["cm", "+237", "Cameroon", 57],
  ["gq", "+240", "Equatorial Guinea", 58],
  ["ga", "+241", "Gabon", 59],
  ["tg", "+228", "Togo", 60],
  ["bj", "+229", "Benin", 61],
  ["bf", "+226", "Burkina Faso", 62],
  ["ci", "+225", "Ivory Coast", 63],
  ["ml", "+223", "Mali", 64],
  ["sn", "+221", "Senegal", 65],
  ["gm", "+220", "Gambia", 66],
  ["gn", "+224", "Guinea", 67],
  ["cv", "+238", "Cape Verde", 68],
  ["st", "+239", "São Tomé and Príncipe", 69],
  ["ao", "+244", "Angola", 70],
  ["gw", "+245", "Guinea-Bissau", 71],
  ["ir", "+98", "Iran", 72],
  ["iq", "+964", "Iraq", 73],
  ["il", "+972", "Israel", 74],
  ["ps", "+970", "Palestine", 75],
  ["jo", "+962", "Jordan", 76],
  ["lb", "+961", "Lebanon", 77],
  ["sy", "+963", "Syria", 78],
  ["om", "+968", "Oman", 79],
  ["qa", "+974", "Qatar", 80],
  ["bh", "+973", "Bahrain", 81],
  ["kw", "+965", "Kuwait", 82],
  ["np", "+977", "Nepal", 83],
  ["lk", "+94", "Sri Lanka", 84],
  ["pk", "+92", "Pakistan", 85],
  ["bd", "+880", "Bangladesh", 86],
  ["mv", "+960", "Maldives", 87],
  ["bt", "+975", "Bhutan", 88],
  ["mm", "+95", "Myanmar", 89],
  ["la", "+856", "Laos", 90],
  ["kh", "+855", "Cambodia", 91],
  ["vn", "+84", "Vietnam", 92],
  ["th", "+66", "Thailand", 93],
  ["my", "+60", "Malaysia", 94],
  ["sg", "+65", "Singapore", 95],
  ["ph", "+63", "Philippines", 96],
  ["id", "+62", "Indonesia", 97],
  ["hk", "+852", "Hong Kong", 98],
  ["mo", "+853", "Macau", 99],
  ["tw", "+886", "Taiwan", 100],
  ["kp", "+850", "North Korea", 101],
  ["mn", "+976", "Mongolia", 102],
  ["kz", "+7", "Kazakhstan", 103],
  ["uz", "+998", "Uzbekistan", 104],
  ["tj", "+992", "Tajikistan", 105],
  ["kg", "+996", "Kyrgyzstan", 106],
  ["tm", "+993", "Turkmenistan", 107],
  ["az", "+994", "Azerbaijan", 108],
  ["ge", "+995", "Georgia", 109],
  ["am", "+374", "Armenia", 110],
  ["ua", "+380", "Ukraine", 111],
  ["by", "+375", "Belarus", 112],
  ["md", "+373", "Moldova", 113],
  ["pl", "+48", "Poland", 114],
  ["cz", "+420", "Czech Republic", 115],
  ["sk", "+421", "Slovakia", 116],
  ["hu", "+36", "Hungary", 117],
  ["ro", "+40", "Romania", 118],
  ["bg", "+359", "Bulgaria", 119],
  ["rs", "+381", "Serbia", 120],
  ["me", "+382", "Montenegro", 121],
  ["ba", "+387", "Bosnia and Herzegovina", 122],
  ["mk", "+389", "North Macedonia", 123],
  ["al", "+355", "Albania", 124],
  ["hr", "+385", "Croatia", 125],
  ["si", "+386", "Slovenia", 126],
  ["lu", "+352", "Luxembourg", 127],
  ["is", "+354", "Iceland", 128],
  ["ie", "+353", "Ireland", 129],
  ["mt", "+356", "Malta", 130],
  ["gi", "+350", "Gibraltar", 131],
  ["lt", "+370", "Lithuania", 132],
  ["lv", "+371", "Latvia", 133],
  ["ee", "+372", "Estonia", 134],
  ["nl", "+31", "Netherlands", 135],
  ["be", "+32", "Belgium", 136],
  ["ch", "+41", "Switzerland", 137],
  ["at", "+43", "Austria", 138],
  ["se", "+46", "Sweden", 139],
  ["no", "+47", "Norway", 140],
  ["dk", "+45", "Denmark", 141],
  ["fi", "+358", "Finland", 142],
  ["tr", "+90", "Turkey", 143],
  ["fj", "+679", "Fiji", 144],
  ["ws", "+685", "Samoa", 145],
  ["to", "+676", "Tonga", 146],
  ["tv", "+688", "Tuvalu", 147],
  ["mh", "+692", "Marshall Islands", 148],
  ["fm", "+691", "Micronesia", 149],
  ["tl", "+670", "Timor-Leste", 150],
  ["bn", "+673", "Brunei", 151],
  ["jm", "+1", "Jamaica", 152],
  ["tt", "+1", "Trinidad and Tobago", 153],
  ["bb", "+1", "Barbados", 154],
  ["ag", "+1", "Antigua and Barbuda", 155],
  ["dm", "+1", "Dominica", 156],
  ["gd", "+1", "Grenada", 157],
  ["kn", "+1", "Saint Kitts and Nevis", 158],
  ["lc", "+1", "Saint Lucia", 159],
  ["vc", "+1", "Saint Vincent and the Grenadines", 160],
  ["bz", "+501", "Belize", 161],
  ["gt", "+502", "Guatemala", 162],
  ["sv", "+503", "El Salvador", 163],
  ["hn", "+504", "Honduras", 164],
  ["ni", "+505", "Nicaragua", 165],
  ["cr", "+506", "Costa Rica", 166],
  ["pa", "+507", "Panama", 167],
  ["ht", "+509", "Haiti", 168],
  ["do", "+1", "Dominican Republic", 169],
  ["pr", "+1", "Puerto Rico", 170],
  ["gy", "+592", "Guyana", 171],
  ["sr", "+597", "Suriname", 172],
];

const CC_COLS = 14;
const FLAG_W = 21;
const FLAG_H = 14;
const TOP_ISO = ["ng", "gb", "us"];

function flagPos(k: number) {
  return `-${(k % CC_COLS) * FLAG_W}px -${Math.floor(k / CC_COLS) * FLAG_H}px`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9][0-9\s\-()]{5,16}$/;

export default function EarlyAccessForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("event_planner");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappOn, setWhatsappOn] = useState(false);

  // Country code picker state
  const [selectedCountry, setSelectedCountry] = useState<CountryTuple>(() => {
    return RAW_COUNTRIES.find((c) => c[0] === "ng") || RAW_COUNTRIES[3];
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sorted countries: Nigeria, UK, US first, then alphabetical
  const sortedCountries = useMemo(() => {
    return [...RAW_COUNTRIES].sort((a, b) => {
      const ta = TOP_ISO.indexOf(a[0]);
      const tb = TOP_ISO.indexOf(b[0]);
      if (ta !== -1 && tb !== -1) return ta - tb;
      if (ta !== -1) return -1;
      if (tb !== -1) return 1;
      return a[2].localeCompare(b[2]);
    });
  }, []);

  // Filtered countries based on search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return sortedCountries;
    return sortedCountries.filter(
      (c) =>
        c[2].toLowerCase().includes(q) ||
        c[1].replace("+", "").replace("-", "").startsWith(q.replace("-", "")) ||
        c[0] === q
    );
  }, [searchQuery, sortedCountries]);

  // Handle outside click to close picker
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    if (pickerOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
      if (searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
      }
    }
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [pickerOpen]);

  function handleSelectCountry(country: CountryTuple) {
    setSelectedCountry(country);
    setPickerOpen(false);
    setSearchQuery("");
  }

  function handlePickerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(filteredCountries.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCountries[activeIndex]) {
        handleSelectCountry(filteredCountries[activeIndex]);
      }
    } else if (e.key === "Escape" || e.key === "Tab") {
      setPickerOpen(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName.trim()) {
      setErrorMessage("Enter your first name.");
      document.getElementById("f-first")?.focus();
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage("Enter your last name.");
      document.getElementById("f-last")?.focus();
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMessage("Enter a valid email address.");
      document.getElementById("f-email")?.focus();
      return;
    }
    if (!PHONE_RE.test(phone.trim())) {
      setErrorMessage("Enter your WhatsApp number.");
      document.getElementById("f-phone")?.focus();
      return;
    }

    const fullPhone = selectedCountry[1] + phone.trim();
    const payload = {
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      role,
      whatsappOn,
      phone: fullPhone,
      feedbackGroupConsentAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const res = await waitlistSignup(payload);
      setIsSubmitting(false);

      if (res.ok || res.status === 409) {
        const isDup = res.status === 409;
        setIsDuplicate(isDup);
        setIsSuccess(true);

        const delay = 2500 + (whatsappOn && !isDup ? 2500 : 0);
        setTimeout(() => {
          window.location.href = CONTENT.SIGN_UP_URL;
        }, delay);
      } else {
        setErrorMessage(res.message || "We couldn't add you just now. Please try again in a moment.");
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Cannot reach the server. Please check your connection and try again.");
    }
  }

  return (
    <div className="form-card" id="early-access">
      {!isSuccess ? (
        <form id="ea-form" noValidate onSubmit={handleSubmit}>
          <h2>Get early access</h2>
          <div className="row-2">
            <div className="field">
              <label htmlFor="f-first">First name</label>
              <input
                className="input"
                id="f-first"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="f-last">Last name</label>
              <input
                className="input"
                id="f-last"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-role">I&apos;m a…</label>
            <select
              className="input"
              id="f-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="event_planner">Event planner</option>
              <option value="decorator">Decorator</option>
              <option value="venue_staff">Venue / Venue staff</option>
              <option value="other_creative_pro">Other creative pro</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-email">Work email</label>
            <input
              className="input"
              id="f-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field" id="wa-fields">
            <span className="label" id="wa-label">
              WhatsApp number
            </span>
            <div className="phone-row" ref={pickerRef}>
              <div className="cc">
                <input type="hidden" id="f-cc" value={selectedCountry[1]} />
                <button
                  type="button"
                  className="input cc-btn"
                  id="cc-btn"
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                  aria-controls="cc-pop"
                  aria-label={`Country code: ${selectedCountry[2]} ${selectedCountry[1]}`}
                  onClick={() => setPickerOpen(!pickerOpen)}
                >
                  <span className="flag" id="cc-flag">
                    {selectedCountry[0] === "ng" ? (
                      <svg viewBox="0 0 3 2" width="21" height="14" aria-hidden="true">
                        <rect width="1" height="2" fill="#008751" />
                        <rect x="1" width="1" height="2" fill="#fff" />
                        <rect x="2" width="1" height="2" fill="#008751" />
                      </svg>
                    ) : (
                      <span
                        className="flag sprite"
                        style={{ backgroundPosition: flagPos(selectedCountry[3]) }}
                      />
                    )}
                  </span>
                  <span id="cc-code">{selectedCountry[1]}</span>
                  <svg
                    className="cc-chev"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>

              <input
                className="input"
                id="f-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="801 234 5678"
                aria-labelledby="wa-label"
                aria-describedby="wa-note"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {pickerOpen && (
                <div className="cc-pop" id="cc-pop">
                  <div className="cc-search-wrap">
                    <svg width="15" height="15" aria-hidden="true">
                      <use href="#i-search" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      className="cc-search"
                      id="cc-search"
                      type="text"
                      placeholder="Search country or code"
                      aria-label="Search countries"
                      autoComplete="off"
                      role="combobox"
                      aria-controls="cc-list"
                      aria-expanded="true"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handlePickerKeyDown}
                    />
                  </div>
                  <ul className="cc-list" id="cc-list" role="listbox" ref={listRef} aria-label="Countries">
                    {filteredCountries.length === 0 ? (
                      <li className="cc-empty" role="presentation">
                        No country found
                      </li>
                    ) : (
                      filteredCountries.map((c, i) => {
                        const isSep = !searchQuery && i === TOP_ISO.length;
                        const isSelected = c[0] === selectedCountry[0];
                        const isActive = i === activeIndex;
                        return (
                          <span key={c[0]}>
                            {isSep && <li className="cc-sep" role="presentation" />}
                            <li
                              role="option"
                              id={`cc-opt-${c[0]}`}
                              aria-selected={isSelected}
                              className={isActive ? "active" : ""}
                              onClick={() => handleSelectCountry(c)}
                              onMouseMove={() => setActiveIndex(i)}
                            >
                              <span
                                className="flag sprite"
                                style={{ backgroundPosition: flagPos(c[3]) }}
                              />
                              <span className="cc-name">{c[2]}</span>
                              <span className="cc-dial">{c[1]}</span>
                            </li>
                          </span>
                        );
                      })
                    )}
                  </ul>
                </div>
              )}
            </div>
            <p className="field-note" id="wa-note">
              By adding your number, you agree to join our WhatsApp group for early access members, where
              you can give feedback on how EventSpacePro works.
            </p>
          </div>
          <label className="check">
            <input
              type="checkbox"
              id="f-wa"
              checked={whatsappOn}
              onChange={(e) => setWhatsappOn(e.target.checked)}
            />
            <span>Add me to the WhatsApp channel for updates, tips and special offers</span>
          </label>
          {errorMessage && (
            <p className="form-error" id="f-error" role="alert">
              {errorMessage}
            </p>
          )}
          <button className="btn btn-primary btn-lg btn-block" type="submit" id="f-submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Get early access"}
          </button>
          <p className="form-note">Early access is open. Create your account in under a minute.</p>
        </form>
      ) : (
        <div className="success" id="ea-success" aria-live="polite">
          <div className="success-icon">
            <svg width="26" height="26">
              <use href="#i-check" />
            </svg>
          </div>
          <h3 id="success-title">{isDuplicate ? "You're already on the list." : "You're in."}</h3>
          <p id="success-msg">Taking you to sign-up…</p>
          <div className="actions">
            <a className="btn btn-primary btn-lg btn-block js-signup" href={CONTENT.SIGN_UP_URL}>
              Continue to sign-up
            </a>
            {whatsappOn && !isDuplicate && CONTENT.SOCIALS.whatsapp && (
              <a
                className="btn btn-ghost btn-lg btn-block"
                id="wa-channel-btn"
                href={CONTENT.SOCIALS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the WhatsApp channel
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
