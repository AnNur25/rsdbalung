export default function Footer() {
  // const navLinks = [
  //   { to: '/about', label: 'About Us' },
  //   { to: '/services', label: 'Services' },
  //   { to: '/contact', label: 'Contact' },
  //   { to: '/faq', label: 'FAQ' },
  // ];
  // {navLinks.map((link, index) => (
  //   <a key={index} href={link.to} className="text-blue-500 no-underline">
  //     {link.label}
  //   </a>
  // ))}

  const iconSize: number = 36;
  const socialMedia = {
    facebook: "https://facebook.com",
    instagram: "https://www.instagram.com/rsdbalungjember/",
    youtube: "https://youtube.com/@rsdbalungjember",
  };

  return (
    <footer className="bg-sky-700 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Tentang Kami</h3>
            <ul>
              <li className="mb-2">
                <a href="/profile" className="hover:underline">
                  Profil
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Berita
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Layanan Unggulan
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:w-min lg:justify-self-end">
            <h3 className="mb-4 text-lg font-semibold text-nowrap">
              Media Sosial Kami
            </h3>
            <div className="flex space-x-4">
              <a
                href={socialMedia.facebook}
                target="_blank"
                className="hover:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={iconSize}
                  height={iconSize}
                  viewBox="0,0,256,256"
                >
                  <g
                    fill-rule="nonzero"
                    stroke="none"
                    stroke-width="1"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="10"
                    stroke-dasharray=""
                    stroke-dashoffset="0"
                    font-family="none"
                    font-weight="none"
                    font-size="none"
                    text-anchor="none"
                    style={{ mixBlendMode: "normal" }}
                    className="h-6 w-6 fill-white"
                  >
                    <g transform="scale(10.66667,10.66667)">
                      <path d="M17,3h-10c-2.209,0 -4,1.791 -4,4v10c0,2.209 1.791,4 4,4h5.621v-6.961h-2.343v-2.725h2.343v-2.005c0,-2.324 1.421,-3.591 3.495,-3.591c0.699,-0.002 1.397,0.034 2.092,0.105v2.43h-1.428c-1.13,0 -1.35,0.534 -1.35,1.322v1.735h2.7l-0.351,2.725h-2.365v6.965h1.586c2.209,0 4,-1.791 4,-4v-10c0,-2.209 -1.791,-4 -4,-4z"></path>
                    </g>
                  </g>
                </svg>
              </a>
              <a
                href={socialMedia.instagram}
                target="_blank"
                className="hover:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={iconSize}
                  height={iconSize}
                  viewBox="0,0,256,256"
                >
                  <g
                    fill-rule="nonzero"
                    stroke="none"
                    stroke-width="1"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="10"
                    stroke-dasharray=""
                    stroke-dashoffset="0"
                    font-family="none"
                    font-weight="none"
                    font-size="none"
                    text-anchor="none"
                    style={{ mixBlendMode: "normal" }}
                    className="h-6 w-6 fill-white"
                  >
                    <g transform="scale(10.66667,10.66667)">
                      <path d="M8,3c-2.761,0 -5,2.239 -5,5v8c0,2.761 2.239,5 5,5h8c2.761,0 5,-2.239 5,-5v-8c0,-2.761 -2.239,-5 -5,-5zM18,5c0.552,0 1,0.448 1,1c0,0.552 -0.448,1 -1,1c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1zM12,7c2.761,0 5,2.239 5,5c0,2.761 -2.239,5 -5,5c-2.761,0 -5,-2.239 -5,-5c0,-2.761 2.239,-5 5,-5zM12,9c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3z"></path>
                    </g>
                  </g>
                </svg>
              </a>
              <a
                href={socialMedia.youtube}
                target="_blank"
                className="hover:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={iconSize}
                  height={iconSize}
                  viewBox="0,0,256,256"
                >
                  <g
                    fill-rule="nonzero"
                    stroke="none"
                    stroke-width="1"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="10"
                    stroke-dasharray=""
                    stroke-dashoffset="0"
                    font-family="none"
                    font-weight="none"
                    font-size="none"
                    text-anchor="none"
                    style={{ mixBlendMode: "normal" }}
                    className="h-6 w-6 fill-white"
                  >
                    <g transform="scale(10.66667,10.66667)">
                      <path d="M21.582,6.186c-0.23,-0.86 -0.908,-1.538 -1.768,-1.768c-1.56,-0.418 -7.814,-0.418 -7.814,-0.418c0,0 -6.254,0 -7.814,0.418c-0.86,0.23 -1.538,0.908 -1.768,1.768c-0.418,1.56 -0.418,5.814 -0.418,5.814c0,0 0,4.254 0.418,5.814c0.23,0.86 0.908,1.538 1.768,1.768c1.56,0.418 7.814,0.418 7.814,0.418c0,0 6.254,0 7.814,-0.418c0.861,-0.23 1.538,-0.908 1.768,-1.768c0.418,-1.56 0.418,-5.814 0.418,-5.814c0,0 0,-4.254 -0.418,-5.814zM10,14.598v-5.196c0,-0.385 0.417,-0.625 0.75,-0.433l4.5,2.598c0.333,0.192 0.333,0.674 0,0.866l-4.5,2.598c-0.333,0.193 -0.75,-0.048 -0.75,-0.433z"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Rumah Sakit Daerah Balung Kabupaten
          Jember
        </div>
      </div>
    </footer>
  );
}
