export default function SvgDefs() {
  return (
    <>
      {/* Inline icon sprite (keeps HTTP requests down) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <symbol id="i-check" viewBox="0 0 24 24">
            <path
              d="M20 6 9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="i-grid" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </g>
          </symbol>
          <symbol id="i-spark" viewBox="0 0 24 24">
            <path
              d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="i-cube" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M3.3 7 12 12l8.7-5M12 22V12" />
            </g>
          </symbol>
          <symbol id="i-chat" viewBox="0 0 24 24">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="i-move" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
            </g>
          </symbol>
          <symbol id="i-box" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </g>
          </symbol>
          <symbol id="i-team" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </g>
          </symbol>
          <symbol id="i-layers" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 2 10 5-10 5L2 7z" />
              <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
            </g>
          </symbol>
          <symbol id="i-pin" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </g>
          </symbol>
          <symbol id="i-hash" viewBox="0 0 24 24">
            <path
              d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </symbol>
          <symbol id="i-link" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </g>
          </symbol>
          <symbol id="i-search" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </g>
          </symbol>
          <symbol id="i-plus" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </symbol>
          <symbol id="i-arrow" viewBox="0 0 24 24">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="i-menu" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </symbol>
        </defs>
      </svg>

      {/* Real EventSpacePro editor asset (10 seater round table), simplified */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <symbol id="a-round10" viewBox="-3.053 -2707.223 2710.017 2717.6">
            <g transform="matrix(1 0 0 -1 -8279.242 4691.04)">
              <circle vectorEffect="non-scaling-stroke" cx="9631" cy="6039" r="850" />
              <g>
                <path
                  vectorEffect="non-scaling-stroke"
                  d="M10971 6252a217 217 0 0 1 -86 -18 1181 1181 0 0 0 -354 -131 22 22 0 0 0 -5 24 12 12 0 0 1 -2 9 481 481 0 0 0 -20 50l-40 124 -40 124a481 481 0 0 0 -13 53 12 12 0 0 1 -3 8 22 22 0 0 0 -10 22 1181 1181 0 0 0 364 102 217 217 0 0 1 80 36 13 13 0 0 0 22 -4l124 -382a13 13 0 0 0 -15 -16Z"
                />
                <path
                  vectorEffect="non-scaling-stroke"
                  d="M9843 7379a217 217 0 0 1 -10 -87 1181 1181 0 0 0 16 -377 22 22 0 0 0 -24 3 12 12 0 0 1 -9 1 481 481 0 0 0 -54 -4h-260a481 481 0 0 0 -54 4 12 12 0 0 1 -9 -1 22 22 0 0 0 -24 -3 1181 1181 0 0 0 16 377 217 217 0 0 1 -10 87 13 13 0 0 0 11 19h402a13 13 0 0 0 11 -19Z"
                />
                <path
                  vectorEffect="non-scaling-stroke"
                  d="M8714 6252a217 217 0 0 1 86 -18 1181 1181 0 0 0 354 -131 22 22 0 0 0 5 24 12 12 0 0 1 2 9 481 481 0 0 0 20 50l40 124 40 124a481 481 0 0 0 13 53 12 12 0 0 1 3 8 22 22 0 0 0 10 22 1181 1181 0 0 0 -364 102 217 217 0 0 1 -80 36 13 13 0 0 0 -22 -4l-124 -382a13 13 0 0 0 15 -16Z"
                />
                <path
                  vectorEffect="non-scaling-stroke"
                  d="M8412 5450a217 217 0 0 1 80 36 1181 1181 0 0 0 364 102 22 22 0 0 0 -10 22 12 12 0 0 1 -3 8 481 481 0 0 0 -13 53l-40 124 -40 124a481 481 0 0 0 -20 50 12 12 0 0 1 -2 9 22 22 0 0 0 -5 24 1181 1181 0 0 0 -354 -131 217 217 0 0 1 -86 -18 13 13 0 0 0 -15 -16l124 -382a13 13 0 0 0 22 -4"
                />
                <path vectorEffect="non-scaling-stroke" d="M8419 5453a241 241 0 0 1 82 35" />
                <path vectorEffect="non-scaling-stroke" d="M8435 5463a317 317 0 0 1 80 42" />
                <path vectorEffect="non-scaling-stroke" d="M8413 5821a317 317 0 0 1 -90 -14" />
                <path vectorEffect="non-scaling-stroke" d="M8392 5826a241 241 0 0 1 -87 -20" />
                <path vectorEffect="non-scaling-stroke" d="m8445 5656 33 -102" />
                <path vectorEffect="non-scaling-stroke" d="M8860 5588a1154 1154 0 0 1 -355 -99" />
                <path vectorEffect="non-scaling-stroke" d="M8539 5493a98 98 0 0 1 -61 62" />
                <path vectorEffect="non-scaling-stroke" d="M8860 5588a12 12 0 0 1 -3 8" />
                <path vectorEffect="non-scaling-stroke" d="m8856 5597 -18 -8" />
                <path vectorEffect="non-scaling-stroke" d="m8838 5589 7 -7" />
                <path vectorEffect="non-scaling-stroke" d="m8838 5589 3 -9" />
                <path vectorEffect="non-scaling-stroke" d="m8724 5942 -3 9" />
                <path vectorEffect="non-scaling-stroke" d="m8724 5942 1 10" />
                <path vectorEffect="non-scaling-stroke" d="m8743 5947 -19 -4" />
                <path vectorEffect="non-scaling-stroke" d="M8743 5947a12 12 0 0 1 -2 9" />
                <path vectorEffect="non-scaling-stroke" d="M8412 5758a98 98 0 0 1 13 86" />
                <path vectorEffect="non-scaling-stroke" d="M8394 5827a1154 1154 0 0 1 346 128" />
                <path vectorEffect="non-scaling-stroke" d="m8441 5653 33 -102" />
                <path vectorEffect="non-scaling-stroke" d="m8363 5628 -57 174" />
                <path vectorEffect="non-scaling-stroke" d="m8355 5625 -57 175" />
                <path vectorEffect="non-scaling-stroke" d="M8301 5803a2 2 0 0 1 -3 -3" />
                <path vectorEffect="non-scaling-stroke" d="M8307 5803a1 1 0 0 1 -1 -1" />
                <path vectorEffect="non-scaling-stroke" d="m8364 5628 -57 174" />
                <path vectorEffect="non-scaling-stroke" d="M8307 5803a0 0 0 0 1 0 -1" />
                <path vectorEffect="non-scaling-stroke" d="M8420 5453a0 0 0 0 1 1 0" />
                <path vectorEffect="non-scaling-stroke" d="m8364 5628 57 -174" />
                <path vectorEffect="non-scaling-stroke" d="M8419 5453a1 1 0 0 1 1 0" />
                <path vectorEffect="non-scaling-stroke" d="M8412 5450a2 2 0 0 1 4 -1" />
                <path vectorEffect="non-scaling-stroke" d="m8355 5625 57 -175" />
                <path vectorEffect="non-scaling-stroke" d="m8363 5628 57 -174" />
                <path
                  vectorEffect="non-scaling-stroke"
                  d="M10840 5424a217 217 0 0 1 -80 36 1181 1181 0 0 0 -364 102 22 22 0 0 0 10 22 12 12 0 0 1 3 8 481 481 0 0 0 13 53l40 124 40 124a481 481 0 0 0 20 50 12 12 0 0 1 2 9 22 22 0 0 0 5 24 1181 1181 0 0 0 354 -131 217 217 0 0 1 86 -18 13 13 0 0 0 15 -16l-124 -382a13 13 0 0 0 -22 -4"
                />
                <path vectorEffect="non-scaling-stroke" d="M10847 5449a241 241 0 0 1 -82 35" />
                <path vectorEffect="non-scaling-stroke" d="M10831 5459a317 317 0 0 1 -80 42" />
                <path vectorEffect="non-scaling-stroke" d="M10853 5817a317 317 0 0 1 90 -14" />
                <path vectorEffect="non-scaling-stroke" d="M10874 5822a241 241 0 0 1 87 -20" />
                <path vectorEffect="non-scaling-stroke" d="m10821 5652 -33 -102" />
                <path vectorEffect="non-scaling-stroke" d="M10406 5584a1154 1154 0 0 1 355 -99" />
                <path vectorEffect="non-scaling-stroke" d="M10727 5489a98 98 0 0 1 61 62" />
                <path vectorEffect="non-scaling-stroke" d="M10406 5584a12 12 0 0 1 3 8" />
                <path vectorEffect="non-scaling-stroke" d="m10410 5593 18 -8" />
                <path vectorEffect="non-scaling-stroke" d="m10428 5585 -7 -7" />
                <path vectorEffect="non-scaling-stroke" d="m10428 5585 -3 -9" />
                <path vectorEffect="non-scaling-stroke" d="m10542 5938 3 9" />
                <path vectorEffect="non-scaling-stroke" d="m10542 5938 -1 10" />
                <path vectorEffect="non-scaling-stroke" d="m10523 5943 19 -4" />
                <path vectorEffect="non-scaling-stroke" d="M10523 5943a12 12 0 0 1 2 9" />
                <path vectorEffect="non-scaling-stroke" d="M10854 5754a98 98 0 0 1 -13 86" />
                <path vectorEffect="non-scaling-stroke" d="M10872 5823a1154 1154 0 0 1 -346 128" />
                <path vectorEffect="non-scaling-stroke" d="m10821 5652 33 102" />
                <path vectorEffect="non-scaling-stroke" d="m10899 5627 -57 -174" />
                <path vectorEffect="non-scaling-stroke" d="m10907 5625 -57 -175" />
                <path vectorEffect="non-scaling-stroke" d="M10847 5449a2 2 0 0 1 4 1" />
                <path vectorEffect="non-scaling-stroke" d="M10842 5452a1 1 0 0 1 1 0" />
                <path vectorEffect="non-scaling-stroke" d="m10899 5627 -57 -174" />
                <path vectorEffect="non-scaling-stroke" d="M10841 5452a0 0 0 0 1 1 0" />
                <path vectorEffect="non-scaling-stroke" d="M10955 5802a0 0 0 0 1 0 1" />
                <path vectorEffect="non-scaling-stroke" d="m10899 5627 57 174" />
                <path vectorEffect="non-scaling-stroke" d="M10956 5801a1 1 0 0 1 -1 1" />
                <path vectorEffect="non-scaling-stroke" d="M10964 5799a2 2 0 0 1 -3 3" />
                <path vectorEffect="non-scaling-stroke" d="m10907 5625 57 175" />
                <path vectorEffect="non-scaling-stroke" d="m10899 5627 57 174" />
              </g>
            </g>
          </symbol>
          <pattern id="p-grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="#0056a91c" strokeWidth="1" />
          </pattern>
          <pattern id="p-grid-lg" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="url(#p-grid)" />
            <path d="M60 0H0V60" fill="none" stroke="#0056a930" strokeWidth="1" />
          </pattern>
          <pattern id="p-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0V8" stroke="#02193826" strokeWidth="2" />
          </pattern>
        </defs>
      </svg>
    </>
  );
}
