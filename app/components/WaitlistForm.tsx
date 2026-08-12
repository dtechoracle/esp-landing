"use client";

import { Fragment, useRef, useState } from "react";
import Button from "./Button";
import { waitlistSignup } from "@/lib/backend-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s().-]{7,}$/;

const inputStyle: React.CSSProperties = {
  height: 46,
  border: "none",
  outline: "none",
  borderRadius: "var(--radius-md)",
  background: "var(--surface-input)",
  boxShadow: "inset 0 0 0 0.5px var(--surface-input-border)",
  padding: "0 16px",
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "-0.015em",
  color: "var(--ink-900)",
  boxSizing: "border-box",
};

export default function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [role, setRole] = useState("event_planner");
  const [whatsappOn, setWhatsappOn] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  async function submit() {
    setError("");
    if (!firstName.trim()) {
      setError("Enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setError("Enter your last name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      emailRef.current?.focus();
      return;
    }
    if (whatsappOn && !PHONE_RE.test(phone)) {
      setError("Enter a valid phone number for WhatsApp updates.");
      return;
    }

    setStatus("submitting");
    try {
      const result = await waitlistSignup({
        email: email.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        role,
        whatsappOn,
        phone: `${countryCode}${phone.trim()}`,
      });

      if (result.ok || result.status === 409) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setRole("event_planner");
        setWhatsappOn(false);
        setStatus("idle");
        setError("");
        setShowSuccess(true);
        if (whatsappOn) {
          setTimeout(() => {
            window.open("https://whatsapp.com/channel/0029VbDahNlLdQej7Bpe5L3t", "_blank");
          }, 3000);
        }
        return;
      }

      setStatus("idle");
      setError(result.message || "We couldn't add you to the waitlist. Please try again in a moment.");
    } catch {
      setStatus("idle");
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <>
    <div
      id="waitlist"
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 480,
        boxSizing: "border-box",
        border: "1px solid var(--line-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>
          Get early access
        </span>
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>First name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="First name"
              aria-label="First name"
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Last name</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Last name"
              aria-label="Last name"
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>I&apos;m a…</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ ...inputStyle, width: "100%", cursor: "pointer" }}
        >
          <option value="event_planner">Event planner</option>
          <option value="decorator">Decorator</option>
          <option value="venue_staff">Venue / Venue staff</option>
          <option value="other_creative_pro">Other creative pro</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Work email</span>
        <input
          ref={emailRef}
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ ...inputStyle, width: "100%" }}
          aria-label="Work email"
        />
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "-0.015em",
          color: "var(--ink-900)",
        }}
      >
        <input
          type="checkbox"
          checked={whatsappOn}
          onChange={() => {
            setWhatsappOn((v) => !v);
            setError("");
          }}
          style={{ display: "none" }}
        />
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            flexShrink: 0,
            transition: "all 150ms ease",
            background: whatsappOn ? "var(--blue-600)" : "var(--surface-input)",
            color: "white",
            boxShadow: whatsappOn
              ? "none"
              : "inset 0 0 0 1px var(--surface-input-border)",
          }}
        >
          {whatsappOn ? "✓" : ""}
        </span>
        Add me to the WhatsApp community and channel for updates, tips and special offers
      </label>

      {whatsappOn && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>WhatsApp number</span>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{ ...inputStyle, width: 110, flexShrink: 0, cursor: "pointer" }}
              aria-label="Country code"
            >
              <option value="+1">🇺🇸 +1 (US/CA)</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+234">🇳🇬 +234</option>
              <option value="+27">🇿🇦 +27</option>
              <option value="+254">🇰🇪 +254</option>
              <option value="+233">🇬🇭 +233</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+966">🇸🇦 +966</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+39">🇮🇹 +39</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+55">🇧🇷 +55</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+64">🇳🇿 +64</option>
              <option value="+20">🇪🇬 +20</option>
              <option value="+212">🇲🇦 +212</option>
              <option value="+256">🇺🇬 +256</option>
              <option value="+255">🇹🇿 +255</option>
              <option value="+263">🇿🇼 +263</option>
              <option value="+260">🇿🇲 +260</option>
              <option value="+267">🇧🇼 +267</option>
              <option value="+268">🇸🇿 +268</option>
              <option value="+264">🇳🇦 +264</option>
              <option value="+380">🇺🇦 +380</option>
              <option value="+48">🇵🇱 +48</option>
              <option value="+31">🇳🇱 +31</option>
              <option value="+46">🇸🇪 +46</option>
              <option value="+47">🇳🇴 +47</option>
              <option value="+45">🇩🇰 +45</option>
              <option value="+358">🇫🇮 +358</option>
              <option value="+41">🇨🇭 +41</option>
              <option value="+43">🇦🇹 +43</option>
              <option value="+32">🇧🇪 +32</option>
              <option value="+351">🇵🇹 +351</option>
              <option value="+90">🇹🇷 +90</option>
              <option value="+82">🇰🇷 +82</option>
              <option value="+63">🇵🇭 +63</option>
              <option value="+62">🇮🇩 +62</option>
              <option value="+66">🇹🇭 +66</option>
              <option value="+84">🇻🇳 +84</option>
              <option value="+60">🇲🇾 +60</option>
              <option value="+65">🇸🇬 +65</option>
              <option value="+880">🇧🇩 +880</option>
              <option value="+94">🇱🇰 +94</option>
              <option value="+92">🇵🇰 +92</option>
              <option value="+977">🇳🇵 +977</option>
              <option value="+98">🇮🇷 +98</option>
              <option value="+964">🇮🇶 +964</option>
              <option value="+972">🇮🇱 +972</option>
              <option value="+970">🇵🇸 +970</option>
              <option value="+962">🇯🇴 +962</option>
              <option value="+961">🇱🇧 +961</option>
              <option value="+963">🇸🇾 +963</option>
              <option value="+968">🇴🇲 +968</option>
              <option value="+974">🇶🇦 +974</option>
              <option value="+973">🇧🇭 +973</option>
              <option value="+965">🇰🇼 +965</option>
              <option value="+972">🇮🇱 +972</option>
              <option value="+213">🇩🇿 +213</option>
              <option value="+216">🇹🇳 +216</option>
              <option value="+218">🇱🇾 +218</option>
              <option value="+249">🇸🇩 +249</option>
              <option value="+251">🇪🇹 +251</option>
              <option value="+252">🇸🇴 +252</option>
              <option value="+253">🇩🇯 +253</option>
              <option value="+257">🇧🇮 +257</option>
              <option value="+243">🇨🇩 +243</option>
              <option value="+242">🇨🇬 +242</option>
              <option value="+236">🇨🇫 +236</option>
              <option value="+235">🇹🇩 +235</option>
              <option value="+237">🇨🇲 +237</option>
              <option value="+240">🇬🇶 +240</option>
              <option value="+241">🇬🇦 +241</option>
              <option value="+228">🇹🇬 +228</option>
              <option value="+229">🇧🇯 +229</option>
              <option value="+226">🇧🇫 +226</option>
              <option value="+225">🇨🇮 +225</option>
              <option value="+223">🇲🇱 +223</option>
              <option value="+221">🇸🇳 +221</option>
              <option value="+220">🇬🇲 +220</option>
              <option value="+224">🇬🇳 +224</option>
              <option value="+245">🇬🇼 +245</option>
              <option value="+238">🇨🇻 +238</option>
              <option value="+239">🇸🇹 +239</option>
              <option value="+244">🇦🇴 +244</option>
              <option value="+265">🇲🇼 +265</option>
              <option value="+266">🇱🇸 +266</option>
              <option value="+269">🇰🇲 +269</option>
              <option value="+262">🇷🇪 +262</option>
              <option value="+230">🇲🇺 +230</option>
              <option value="+248">🇸🇨 +248</option>
              <option value="+262">🇾🇹 +262</option>
              <option value="+350">🇬🇮 +350</option>
              <option value="+352">🇱🇺 +352</option>
              <option value="+354">🇮🇸 +354</option>
              <option value="+353">🇮🇪 +353</option>
              <option value="+356">🇲🇹 +356</option>
              <option value="+370">🇱🇹 +370</option>
              <option value="+371">🇱🇻 +371</option>
              <option value="+372">🇪🇪 +372</option>
              <option value="+373">🇲🇩 +373</option>
              <option value="+374">🇦🇲 +374</option>
              <option value="+995">🇬🇪 +995</option>
              <option value="+994">🇦🇿 +994</option>
              <option value="+992">🇹🇯 +992</option>
              <option value="+996">🇰🇬 +996</option>
              <option value="+998">🇺🇿 +998</option>
              <option value="+7">🇰🇿 +7</option>
              <option value="+856">🇱🇦 +856</option>
              <option value="+855">🇰🇭 +855</option>
              <option value="+95">🇲🇲 +95</option>
              <option value="+976">🇲🇳 +976</option>
              <option value="+852">🇭🇰 +852</option>
              <option value="+853">🇲🇴 +853</option>
              <option value="+886">🇹🇼 +886</option>
              <option value="+94">🇱🇰 +94</option>
              <option value="+960">🇲🇻 +960</option>
              <option value="+975">🇧🇹 +975</option>
              <option value="+670">🇹🇱 +670</option>
              <option value="+673">🇧🇳 +673</option>
              <option value="+679">🇫🇯 +679</option>
              <option value="+685">🇼🇸 +685</option>
              <option value="+676">🇹🇴 +676</option>
              <option value="+688">🇹🇻 +688</option>
              <option value="+690">🇹🇰 +690</option>
              <option value="+692">🇲🇭 +692</option>
              <option value="+1">🇯🇲 +1</option>
              <option value="+1">🇹🇹 +1</option>
              <option value="+1">🇧🇧 +1</option>
              <option value="+1">🇦🇬 +1</option>
              <option value="+1">🇩🇲 +1</option>
              <option value="+1">🇬🇩 +1</option>
              <option value="+1">🇰🇳 +1</option>
              <option value="+1">🇱🇨 +1</option>
              <option value="+1">🇻🇨 +1</option>
              <option value="+501">🇧🇿 +501</option>
              <option value="+502">🇬🇹 +502</option>
              <option value="+503">🇸🇻 +503</option>
              <option value="+504">🇭🇳 +504</option>
              <option value="+505">🇳🇮 +505</option>
              <option value="+506">🇨🇷 +506</option>
              <option value="+507">🇵🇦 +507</option>
              <option value="+595">🇵🇾 +595</option>
              <option value="+598">🇺🇾 +598</option>
              <option value="+56">🇨🇱 +56</option>
              <option value="+57">🇨🇴 +57</option>
              <option value="+58">🇻🇪 +58</option>
              <option value="+51">🇵🇪 +51</option>
              <option value="+593">🇪🇨 +593</option>
              <option value="+591">🇧🇴 +591</option>
              <option value="+597">🇸🇷 +597</option>
              <option value="+592">🇬🇾 +592</option>
              <option value="+359">🇧🇬 +359</option>
              <option value="+40">🇷🇴 +40</option>
              <option value="+381">🇷🇸 +381</option>
              <option value="+382">🇲🇪 +382</option>
              <option value="+387">🇧🇦 +387</option>
              <option value="+389">🇲🇰 +389</option>
              <option value="+355">🇦🇱 +355</option>
              <option value="+385">🇭🇷 +385</option>
              <option value="+386">🇸🇮 +386</option>
              <option value="+421">🇸🇰 +421</option>
              <option value="+420">🇨🇿 +420</option>
              <option value="+36">🇭🇺 +36</option>
              <option value="+371">🇱🇻 +371</option>
              <option value="+370">🇱🇹 +370</option>
              <option value="+372">🇪🇪 +372</option>
              <option value="+386">🇸🇮 +386</option>
            </select>
            <input
              type="tel"
              placeholder="555 000 0000"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{ ...inputStyle, width: "100%" }}
              aria-label="WhatsApp number"
            />
          </div>
        </div>
      )}

      {error && (
        <span style={{ fontSize: 13, color: "var(--error-500)", fontWeight: 500 }}>
          {error}
        </span>
      )}

      <Button size="lg" onClick={submit} disabled={status === "submitting"} style={{ width: "100%" }}>
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </Button>

      <span style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
        No spam. One email when your invite is ready.
      </span>

    </div>

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              padding: 32,
              maxWidth: 400,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>You&apos;re on the list!</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
              We&apos;ll send you an email when your invite is ready.
              {whatsappOn && (
                <span> Redirecting to WhatsApp in 3 seconds…</span>
              )}
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                height: 44,
                padding: "0 24px",
                border: "none",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}