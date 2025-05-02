interface IconProps {
  iconSize?: number;
  className: string;
}

export default function FacebookIcon({ iconSize = 48, className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={iconSize}
      height={iconSize}
      viewBox="0,0,256,256"
    >
      <g
        fill="currentColor"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeDasharray=""
        strokeDashoffset="0"
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
        style={{ mixBlendMode: "normal" }}
      >
        <g transform="scale(10.66667,10.66667)">
          <path d="M17,3h-10c-2.209,0 -4,1.791 -4,4v10c0,2.209 1.791,4 4,4h5.621v-6.961h-2.343v-2.725h2.343v-2.005c0,-2.324 1.421,-3.591 3.495,-3.591c0.699,-0.002 1.397,0.034 2.092,0.105v2.43h-1.428c-1.13,0 -1.35,0.534 -1.35,1.322v1.735h2.7l-0.351,2.725h-2.365v6.965h1.586c2.209,0 4,-1.791 4,-4v-10c0,-2.209 -1.791,-4 -4,-4z"></path>
        </g>
      </g>
    </svg>
  );
}
